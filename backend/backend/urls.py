import json
import psycopg2
import os
import pathlib
import subprocess
import traceback

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

def getStackTrace():
    stackTrace = traceback.format_list(traceback.extract_stack(limit=10))
    return ''.join(stackTrace) + traceback.format_exc()

def printError(msg):
    print("\n-------ERROR-------\n")
    print(getStackTrace(), ' -- message:', msg)
    print('\n-------END ERROR-------\n')

def sql_post_error(message, errorType, stackTrace=None):

    if DEBUG: printError(message) # force stackTrace

    message = message.replace("'", "''")
    errorType = errorType.replace("'","''")
    
    if not stackTrace:
        stackTrace = getStackTrace()
    
    stackTrace = stackTrace.replace("'", "''")

    cur.execute("insert into errors(error, type, stackTrace) values('%s', '%s', '%s')"%(message, errorType, stackTrace))            

def try_except(func):

    def wraper(*args, **kwargs):
        try:

            return func(*args, **kwargs)

        except Exception as exp:
            
            if DEBUG: printError(exp)
            sql_post_error(str(exp), str(type(exp)), getStackTrace()+traceback.format_exc())

    return wraper

def safe_fetch(func):
    
    @csrf_exempt_if_debug
    @try_except
    def wraper(*args, **kwargs):
        return func(*args, **kwargs)

    return wraper


@try_except
def execSQL(methode, directive):

    res = []    
    sql = None

    if methode not in ['GET', 'POST']:
        sql_post_error('methode not GET nor POST', 'type')
        return None

    cur.execute(directive[0])
    sql = cur.fetchall() if methode == 'GET' else conn.commit()

    if sql:
        for i in sql:
            res.append({k:v for (k,v) in zip(directive[1],i)})
    
    return res

@try_except
def genResponse(protocall, data, errorMessage='an error hase occurred.'):

    error = JsonResponse({'error': errorMessage})

    if len(protocall) != len(data):
        sql_post_error('protocall and data not matching', 'type error')
        return error

    for i in range(len(data)):
        if type(data[i]) != protocall[i][1]:
            jsonError = json.dumps({'expected': str(protocall[i][1]), 'but got':str(type(data[i]))})
            sql_post_error(jsonError, 'type error')
            return error
    
    output = {k:v for (k,v) in zip([i[0] for i in protocall], data)}
    
    return JsonResponse(output)


@safe_fetch
def fetch_test(request):
    
    inData = json.loads(request.body.decode("utf-8"))
    print("inData", inData)
    print("request.user.id", request.user.id)
    print("request.user", request.user)
    return JsonResponse({'test123':'test123'})

@safe_fetch
def fetch_submitErrorSql(request):
    
    inData = json.loads(request.body.decode("utf-8"))

    return JsonResponse({'success':0})

@safe_fetch
def fetch_home(request):

    userid = request.user.id if request.user.id else 0
    hotest = execSQL('GET', sql_get_hotest)
    latest = execSQL('GET', sql_get_latest)

    protocall = protocall_fetch_home
    data = (userid, hotest, latest)

    return genResponse(protocall, data)

@safe_fetch
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
  
@safe_fetch
def fetch_logout(request):
    logout(request)
    return JsonResponse({'success':0})

@safe_fetch
def fetch_exercisePage(request):

    inData = json.loads(request.body.decode("utf-8"))

    protocall = protocall_fetch_exercise_page;
    data = [int(inData['exerciseId'])];

    return genResponse(protocall, data)

@safe_fetch
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

@safe_fetch
def fetch_deleteLatex(request):
    inData = json.loads(request.body.decode("utf-8"))

    if not inData['userid']:
        inData['userid'] = 0

    dir_target = DIR_USERS / str(inData['userid']) / inData['exercise'] / inData['target']
    file_svg = dir_target / (str(inData['latexid'])+'.svg')        

    try:
        subprocess.Popen(['rm', file_svg])
    except Exception as exp:
        # TODO - add to errors database
        return JsonResponse({'error':'could not compile latex'})

    return JsonResponse({'success':0})

@safe_fetch
def fetch_submit_exercise(request):
    
    inData = json.loads(request.body.decode("utf-8"))

    # when user is undefined, then this is debug
    # in that case userid must be 0
    if not inData['userid']:
        inData['userid'] = 0

    dir_user = DIR_USERS / str(inData['userid']) 
    dir_temp = dir_user / 'temp' 
    dir_temp.mkdir(parents=True, exist_ok=True)

    # delete all directories that are
    # not 'temp' or numeric
    for i in os.listdir(dir_user):
        if i != 'temp' and not os.path.basename(i).isnumeric():
            subprocess.run(['rm', '-r', dir_user / i,])

    # BEGIN validation

    temp_inData = inData.copy()

    for i in inData:
        if i not in latex_targets:
            temp_inData.pop(i)
    
    for i in latex_targets:
        dir_target = dir_temp / i
        dir_target.mkdir(parents=True, exist_ok=True)

        ready = [i.split('.')[0] for i in os.listdir(dir_target)]
        expected = list(temp_inData[i][1].keys())

        if expected != ready:
            return JsonResponse({'error': 'cant submit, check your latex.'})

    # END validation

    # create new unique exercise directorie
    # unicue per user
    new_exercise_dir = 0
    listDir = os.listdir(dir_user)
    if 'temp' in listDir:
        listDir.remove('temp')
    listDir = [int(os.path.basename(i)) for i in listDir]
    
    if listDir:
        new_exercise_dir = max(listDir) + 1

    dir_new_exercise = dir_user / str(new_exercise_dir)

    subprocess.run(['cp', '-r', dir_temp, dir_new_exercise])

    # SQL
    sql_args = {
        'author' : repr(str(inData['userid'])),          
        'latex_dir' : repr(new_exercise_dir),       
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

    res = sql_insert_exercise.format(**sql_args)
    
    if comSQL(res, {}, True):
        return JsonResponse({'error': 'submition failed.'})
    
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
    path('fetch/exercisePage/', fetch_exercisePage),

    path('fetch/addLatex/', fetch_addLatex),
    path('fetch/deleteLatex/', fetch_deleteLatex),
    path('fetch/submitExercise/', fetch_submit_exercise),
]
