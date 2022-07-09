"""chalanges URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect

import json
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse

import psycopg2 as pg
from . __init__ import cur, conn

#SQLDataKeys = ['id', 'question', 'answer', 'hints', 'tags', 'rating', 'author', 'creationdate']
SQLDataKeys = ['id', 'question', 'answer', 'hints', 'author', 'creationdate', 'title', 'rating', 'tags']

@ensure_csrf_cookie
def Chalange(request, id):
    cur.execute('''
    select 
        id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags
        from chalanges where id=''' + str(id)
    )
    inData = cur.fetchone()
    outData = { k:v for (k,v) in zip(SQLDataKeys, inData)}
    print('poop', inData)
    return render(request, 'chalange.html', context={'value': outData})

def New(request):
    return render(request, 'new.html')

@ensure_csrf_cookie    
def Browse(request, sterm=''):
    if request.method == "POST":
    
        return redirect('/browse/'+request.POST['browse']+'/')
    
    else:
        cur.execute(
            'select * from chalanges where \''+sterm+'\' = any(tags) order by cardinality(rating) desc limit 10;'
        )
        inData = cur.fetchall() 
        
        outData = { k:v for (k,v) in zip(range(len(inData)), inData)}
        outData.update({"search term": sterm})        
        
        return render(request, 'browse.html', context={'value': outData})
    
def Home(request):
    return render(request, 'home.html')

def poop(request):
    if request.method == "POST":
        id = request.POST['chalangeId']
        cur.execute('select rating from chalanges where id='+str(id)+';')
        inData = set(cur.fetchone()[0])
        
        if request.POST['like'] in ('true', True, 1):
            if request.POST['user'] not in inData:
                inData.add(request.POST['user'])
        else:
            if request.POST['user'] in inData:
                inData.remove(request.POST['user'])
        
        inDataStr = '{' + ''.join(str+',' for str in inData)[0:-1] + '}'
        cur.execute('update chalanges set rating=\''+inDataStr+'\' where id='+str(id)+';')
        conn.commit()
        
        return(HttpResponse('all good'))
    else:
        return(HttpResponse('this should never happen'))

def User(request, user):

    # inData - user from db users
    # inData[0] - id
    # inData[1] - name
    # inData[2] - answered
    # inData[3] - liked
    
    cur.execute('select * from users where name=\''+user+'\'')
    inData = cur.fetchone()
    
    answered = []
    liked = []
    for i in inData[2]:
        cur.execute('''
        select 
            id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags
            from chalanges where id=''' + str(i)
        )
        q = cur.fetchone()
        if q:
            answered.append(q)
            
    for i in inData[3]:
        cur.execute('''
        select 
            id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags
            from chalanges where id=''' + str(i)
        )
        q = cur.fetchone()
        if q:
            liked.append(q)
    
    print(inData)
    
    def myFunc(e):
        return len(e)
        
    liked.sort(key=lambda e: len(e[8]))
    liked.reverse()
    answered.sort(key=lambda e: len(e[8]))
    answered.reverse()
    
    return render(request, 'user.html', context={'value': [answered, liked, inData[1]]})
    
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Home),
    path('new/', New),
    path('browse/', Browse),
    path('browse/<str:sterm>/', Browse),
    path('<int:id>/', Chalange),
    path('poop/', poop),
    path('user/<str:user>/', User),
]
