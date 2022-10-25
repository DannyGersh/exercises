import json
import psycopg2
import os
import pathlib

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

def getSQL(sqlCall, outData):

    try:
        cur.execute(sqlCall)
        outData['SQL'] = cur.fetchall()
        return False
    
    except Exception as err:
        outData['ERR'] = err
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

    return outData


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

        if getSQL(sql_get_hotest, outData):
            pass
        else:
            in_hotest = [{ k:v for (k,v) in zip(sql_chalange, index) } for index in outData['SQL']]
        
        if getSQL(sql_get_latest, outData):
            pass
        else:
            in_latest = [{ k:v for (k,v) in zip(sql_chalange, index) } for index in outData['SQL']]

    output = {
        "userid": request.user.id,
        "hotest": in_hotest,
        "latest": in_latest,
    } 

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
        
        if getSQL('select username from auth_user', res):
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
def fetch_test(request):
    inData = json.loads(request.body.decode("utf-8"))
    print("AAAAAAAAAAAAAAAAAAAA", inData)
    print("AAAAAAAAAAAAAAAAAAAA", request.user.id)
    print(request.user)
    return JsonResponse({'userid':request.user.id})

@csrf_exempt_if_debug
def fetch_addLatex(request):
    inData = json.loads(request.body.decode("utf-8"))
    print("POOP IN:", inData)

    dir_target = DIR_USERS / str(inData['userid']) / inData['exercise'] / inData['target']
    dir_target.mkdir(parents=True, exist_ok=True)

    file_svg = dir_target / (str(inData['latexid'])+'.svg')        

    res = gen_svg(inData['latex'], inData['latexid'], dir_target, '')
    
    if(res):
        return JsonResponse({'error':'could not compile latex'})
    
    return JsonResponse({'success':0})

@csrf_exempt_if_debug
def fetch_deleteLatex(request):
    inData = json.loads(request.body.decode("utf-8"))
    print("POOP IN:", inData)
    print("POOP USER:", request.user.id)
    print(request.user)
    return JsonResponse({'userid':request.user.id})





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
    path('fetch/home/', fetch_home),
    path('fetch/logout/', fetch_logout),
    path('fetch/register_submit/', fetch_register_submit),
    path('fetch/addLatex/', fetch_addLatex),
    path('fetch/deleteLatex/', fetch_deleteLatex)
]
