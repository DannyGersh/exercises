import json
import psycopg2
import os
import pathlib
import subprocess

from django.contrib import admin
from django.urls import path
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.models import User

from django.contrib.sessions.backends.db import SessionStore

from . settings import DEBUG

from . constants import *

from . compileLatex import gen_svg


conn = psycopg2.connect("dbname=exercises user=postgres")
conn.set_session(autocommit=True)
cur = conn.cursor()
cur.execute('SELECT version()')
db_version = cur.fetchone()
print(db_version)


def csrf_exempt_if_debug(func):
    if DEBUG: 
        return csrf_exempt(func)
    else:
        return func

def comSQL(sqlCall, outData, POST=False):

    # comunicate with SQL database

    try:
        cur.execute(sqlCall)
        
        if not POST:
            outData['SQL'] = cur.fetchall()

        return False
    
    except Exception as err:
        outData['error'] = str(err)
        cur.execute( "insert into errors(error, type) values('%s','%s')"%(str(err), "SQL") )            
        return True

def getChalange(id):
    
    cur.execute('''
    select 
        a.id, a.exercise, a.answer, a.hints, 
        
        a.author, 
        
        to_char(a.creationdate, 'MM/DD/YYYY - HH24:MI'), a.title, a.rating, 
        
        array(select name from tags where id in (select * from unnest(a.tags)) ), 
        
        a.explain, a.latex, a.latexp, b.username
        
        from chalanges as a
        inner join auth_user as b
        on a.author = b.id
        
        where a.id=''' + str(id)
    )
    inData = cur.fetchone() 
    
    if inData:

        outData = { k:v for (k,v) in zip(sql_chalange, inData) }
        #outData['authorName'] = inData[-1]
        
        dir_exercise = os.path.join(dir_users, str(outData['author']), outData['latex'])
        file_json = os.path.join(dir_exercise, '.json')
        
        if not os.path.exists(dir_exercise):
            os.makedirs(dir_exercise)
        
        if not os.path.exists(file_json):
            with open(file_json, 'w') as f:
                f.write(json.dumps({"title": [], "exercise": [], "answer": [], "hints": [], "explain": []}))

        with open(file_json, 'r') as f:
            identifiers = json.loads(f.read())

        outData['list_latex'] = identifiers
        
    else:
        outData = None


@csrf_exempt_if_debug
def fetch_test(request):
    inData = json.loads(request.body.decode("utf-8"))
    print("inData", inData)
    print("request.user.id", request.user.id)
    print("request.user", request.user)
    return JsonResponse({'test123':'test123'})

@csrf_exempt_if_debug
def fetch_submitErrorSql(request):
    inData = json.loads(request.body.decode("utf-8"))
    error = json.dumps(inData)
    errorType = inData['type'] 
    comSQL(
        "insert into errors(error, type) values('%s','%s')"%(error, errorType), {}, True
    )

    return JsonResponse({'success':0})

def fetch_home(request):

    outData = {}
    # outData['isAuth'] = request.session.get('isAuth')
    outData['userid'] = request.user.id
    request.session['currentUrl'] = '/'

    in_hotest = []
    in_latest = []

    # in production, while loop always has 1 iteration
    # this is not true for debug build
    count = 0
    while not len(in_hotest) or not len(in_latest):

        count += 1
        if count == 10:
            break

        if comSQL(sql_get_hotest, outData):
            pass
        else:
            in_hotest = [{ k:v for (k,v) in zip(sql_chalange, index) } for index in outData['SQL']]
        
        if comSQL(sql_get_latest, outData):
            pass
        else:
            in_latest = [{ k:v for (k,v) in zip(sql_chalange, index) } for index in outData['SQL']]

    output = {
        "userid": request.user.id,
        "hotest": in_hotest,
        "latest": in_latest,
    } 

    poop = {}
    if comSQL(sql_get_hotest2, poop):
        print(poop['error'])
    else:
        print(dict(zip(sql_get_hotest2_elements, poop['SQL'][0])))

    return JsonResponse(output)

@csrf_exempt_if_debug
def fetch_register_submit(request):

    body = json.loads(request.body.decode("utf-8"))

    isLogin = body.get('isLogin')
    uname = body.get('uname')
    password = body.get('password')

    if isLogin:

        user = authenticate(username=uname, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'userid': request.user.id})
        else:
           return JsonResponse({'error': "could not log in ..."})

    else:
        
        res = {}
        
        if comSQL('select username from auth_user', res):
            return JsonResponse({"error": "could not create user ..."})
        
        else:
            names = [i[0] for i in res['SQL']]
            if uname in names:
                return JsonResponse({"error": 'user name taken, try another one.'})
            else:
                user = User.objects.create_user(
                    uname, '', password
                )
                if not user:
                    return JsonResponse({'error': "could not create user ..."})
                else:
                    login(request, user)
                    return JsonResponse({"userid": user.id})
  
def fetch_logout(request):
    logout(request)
    return JsonResponse({'success':0})


@csrf_exempt_if_debug
def fetch_addLatex(request):
    
    inData = json.loads(request.body.decode("utf-8"))

    if not inData['userid']:
        inData['userid'] = 0

    dir_target = DIR_USERS / str(inData['userid']) / inData['exercise'] / inData['target']
    dir_target.mkdir(parents=True, exist_ok=True)

    file_svg = dir_target / (str(inData['latexid'])+'.svg')        
    res = gen_svg(inData['latex'], inData['latexid'], dir_target, inData['packages'])
    
    if(res):
        return JsonResponse({'error':'could not compile latex'})
    
    return JsonResponse({'success':0})

@csrf_exempt_if_debug
def fetch_deleteLatex(request):
    inData = json.loads(request.body.decode("utf-8"))

    if not inData['userid']:
        inData['userid'] = 0

    dir_target = DIR_USERS / str(inData['userid']) / inData['exercise'] / inData['target']
    file_svg = dir_target / (str(inData['latexid'])+'.svg')        

    try:
        subprocess.Popen([
            'rm', file_svg,
        ])
    except Exception as exp:
        # TODO - add to errors database
        return JsonResponse({'error':'could not compile latex'})

    return JsonResponse({'success':0})

@csrf_exempt_if_debug
def fetch_validateExercise(request):
    
    inData = json.loads(request.body.decode("utf-8"))

    new_latex_dir = inData['new_latex_dir']
    dir_user = pathlib.Path(inData['dir_user'])

    dir_temp = dir_user / 'temp'
    dir_new_exercise = dir_user / str(new_latex_dir)

    temp_inData = inData.copy()
    temp_inData.pop('userid')
    temp_inData.pop('latexp')
    temp_inData.pop('new_latex_dir')
    temp_inData.pop('dir_user')

    for i in temp_inData:
        temp_dir = dir_temp / i
        if not os.path.exists(temp_dir):
            os.mkdir(temp_dir)

        temp_ready = [i.split('.')[0] for i in os.listdir(temp_dir)]
        print(i, list(temp_inData[i][1].keys()), temp_ready)
        if list(temp_inData[i][1].keys()) != temp_ready:
            return JsonResponse({
                'notReady':True, 
                'dir_user':str(dir_user), 
                'new_latex_dir': new_latex_dir
            })

    return JsonResponse({'notReady':False})

@csrf_exempt_if_debug
def fetch_submit_exercise(request):
    
    inData = json.loads(request.body.decode("utf-8"))

    if not inData['userid']:
        inData['userid'] = 0

    dir_user = DIR_USERS / str(inData['userid']) 
    subprocess.run(['mkdir', dir_user])

    for i in os.listdir(dir_user):
        if i != 'temp' and not os.path.basename(i).isnumeric():
            subprocess.run(['rm', '-r', dir_user / i,])

    new_latex_dir = 0
    filenames = os.listdir(dir_user)
    if 'temp' in filenames:
        filenames.remove('temp')
    filenames = [int(os.path.basename(i)) for i in filenames]
    
    if filenames:
        new_latex_dir = max(filenames) + 1

    dir_temp = dir_user / 'temp'
    dir_new_exercise = dir_user / str(new_latex_dir)

    temp_inData = inData.copy()
    temp_inData.pop('userid')
    temp_inData.pop('latexp')
    for i in temp_inData:
        temp_dir = dir_temp / i
        if not os.path.exists(temp_dir):
            os.mkdir(temp_dir)

        temp_ready = [i.split('.')[0] for i in os.listdir(temp_dir)]
        print(i, list(temp_inData[i][1].keys()), temp_ready)
        if list(temp_inData[i][1].keys()) != temp_ready:
            return JsonResponse({
                'notReady':True, 
                'dir_user':str(dir_user), 
                'new_latex_dir': new_latex_dir
            })

    subprocess.run(['cp', '-r', dir_temp, dir_new_exercise])

    sql_args = {
        'author' : repr(str(inData['userid'])),          
        'latex_dir' : repr(new_latex_dir),       
        'latex_pkg' : repr(inData['latexp']),        

        'title' : repr(inData['title'][0]),          
        'exercise' : repr(inData['exercise'][0]),        
        'answer' : repr(inData['answer'][0]),          
        'hints' : repr(inData['hints'][0]),            
        'explain' : repr(inData['explain'][0]),          

        'latex_title' : repr(json.dumps(inData['title'][1])),     
        'latex_exercise' : repr(json.dumps(inData['exercise'][1])),  
        'latex_answer' : repr(json.dumps(inData['answer'][1])),    
        'latex_hints' : repr(json.dumps(inData['hints'][1])),     
        'latex_explain' : repr(json.dumps(inData['explain'][1])),   
    }

    outData = {}
    res = sql_insert_exercise.format(**sql_args)
    
    if comSQL(res, outData, True):
        return JsonResponse({'error':outData['error']})
    
    return JsonResponse({'success':0})

@csrf_exempt_if_debug
def fetch_submit_exercise_SQL(request):

    inData = json.loads(request.body.decode("utf-8"))

    subprocess.run(['cp', '-r', inData['dir_temp'], inData['dir_new_exercise']])

    sql_args = {
        'author' : repr(str(inData['userid'])),          
        'latex_dir' : repr(inData['new_latex_dir']),       
        'latex_pkg' : repr(inData['latexp']),        

        'title' : repr(inData['title'][0]),          
        'exercise' : repr(inData['exercise'][0]),        
        'answer' : repr(inData['answer'][0]),          
        'hints' : repr(inData['hints'][0]),            
        'explain' : repr(inData['explain'][0]),          

        'latex_title' : repr(json.dumps(inData['title'][1])),     
        'latex_exercise' : repr(json.dumps(inData['exercise'][1])),  
        'latex_answer' : repr(json.dumps(inData['answer'][1])),    
        'latex_hints' : repr(json.dumps(inData['hints'][1])),     
        'latex_explain' : repr(json.dumps(inData['explain'][1])),   
    }

    outData = {}
    res = sql_insert_exercise.format(**sql_args)
    
    if comSQL(res, outData, True):
        return JsonResponse({'error':outData['error']})
    
    return JsonResponse({'success':0})


@ensure_csrf_cookie
def home(request):
    outData={'userid':request.user.id}
    return render(request, 'index.html', context={'value':outData})

@ensure_csrf_cookie
def nonHome(request, id):
    return render(request, 'index.html')

# routing is done in react - see App.js
# home() is the home page
# nonHome() is anything but the home page

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home), # see (1) in App.js
    path('<slug:id>/', nonHome), # see (2) in App.js
    path('profile/<slug:id>/', nonHome), # see (3) in App.js

    path('fetch/test123/', fetch_test),
    path('fetch/submitErrorSql/', fetch_submitErrorSql),
    path('fetch/home/', fetch_home),
    path('fetch/logout/', fetch_logout),
    path('fetch/register_submit/', fetch_register_submit),
    path('fetch/addLatex/', fetch_addLatex),
    path('fetch/deleteLatex/', fetch_deleteLatex),
    path('fetch/submit_exercise/', fetch_submit_exercise),
    path('fetch/validateExercise/', fetch_validateExercise),
]
