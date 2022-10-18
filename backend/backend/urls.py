from django.contrib import admin
from django.urls import path
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
import json

import json
import psycopg2
import os

from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

from . settings import DEBUG

conn = psycopg2.connect("dbname=exercises user=postgres")
conn.set_session(autocommit=True)
cur = conn.cursor()
cur.execute('SELECT version()')
db_version = cur.fetchone()
print(db_version)

sql_chalange = [
    'id',           # serial primary key not null 
    'exercise',     # varchar(4000) not null
    'answer',       # varchar(4000) not null
    'hints',        # varchar(4000)
    'author',       # varchar(100)
    'creationdate', # timestamp default current_timestamp
    'title',        # varchar(400) not null
    'rating',       # integer[] not null default '{}'
    'tags',         # varchar(100)[] not null default '{}'
    'explain',      # varchar(4000)
    'latex',        # varchar(30)[] not null default '{}'
    'latexp',       # varchar(400)
]
sql_auth = [
    'authored', # integer[] default '{}'
    'liked',    # integer[] default '{}'
    'answered'  # integer[] default '{}'
]
sql_tags = [
    'id',   # serial primary key not null
    'name', # varchar(100) not null unique
]
sql_messages = [
    'id'            # serial            primary key not null,
    'chalangeId'    # serial            not null            ,
    'sender'        # serial            not null            ,
    'receiver'      # serial            not null            ,
    'message'       # varchar(4000)     not null
]

dir_users = os.path.join('/','volume','static','users')

reg_latex = r'$$___latex$$'
reg_latex_search = r'\$\$(.+?)\$\$'

def csrf_exempt_if_debug(func):
    if DEBUG: 
        return csrf_exempt(func)
    else:
        return func


#@ensure_csrf_cookie
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
        outData['authorName'] = inData[-1]
        
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
    
    # TODO - make one SQL quary insted of many
    cur.execute("select id from chalanges order by creationdate desc limit 10")
    in_latest = cur.fetchall()  
    for i in range(len(in_latest)):
        in_latest[i] = getChalange(in_latest[i][0])
        
    # TODO - make one SQL quary insted of many
    cur.execute("select id from chalanges order by cardinality(rating) desc limit 10")
    in_hotest = cur.fetchall()  
    for i in range(len(in_hotest)):
        in_hotest[i] = getChalange(in_hotest[i][0])
        
    outData['latest'] = in_latest
    outData['hotest'] = in_hotest
    q = getChalange(53)
    
    output = {
        "userid": request.user.id,
        "latest": in_latest,
        "hotest": in_hotest
    } 

    return JsonResponse(output)

@csrf_exempt_if_debug
def fetch_register_debug(request):

    #inData = json.loads(request.body.decode("utf-8"))
    #print("AAAAAAAAAAAAAAAAAAAA", inData)

    outData = {
        'isLogIn': True,
        'userid': str(request.user.id),
    }
    
    return JsonResponse(outData)

def fetch_register_submit(request):

    inData = json.loads(request.body.decode("utf-8"))
    print("AAAAAAAAAAAAAAAAAAAA", inData)

    outData = {
        'isLogIn': True,
        'userid': str(request.user.id),
    }
    
    return JsonResponse(outData)



def conditional_decorator(dec, condition):
    def decorator(func):
        if not condition:
            # Return the function unchanged, not decorated.
            return func
        return dec(func)
    return decorator

@csrf_exempt_if_debug
def fetch_test(request):
    inData = json.loads(request.body.decode("utf-8"))
    print("AAAAAAAAAAAAAAAAAAAA", inData)
    return JsonResponse({'bbb':'bbb'})


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
    path('fetch/register/', fetch_register_submit),

    path('fetch/register_debug/', fetch_register_debug),

]
