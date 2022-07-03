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
from django.shortcuts import render

import json
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse

import psycopg2 as pg
from . __init__ import cur, conn

SQLDataKeys = ['id', 'question', 'answer', 'hints', 'tags', 'rating', 'author', 'creationdate']

@ensure_csrf_cookie
def Chalange(request, id):
    cur.execute('''
    select 
        id, question, answer, hints, tags, rating, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI')
        from chalanges where id=''' + str(id)
    )
    inData = cur.fetchone()
    outData = { k:v for (k,v) in zip(SQLDataKeys, inData)}
    print('poop', inData)
    return render(request, 'chalange.html', context={'value': outData})

def New(request):
    return render(request, 'new.html')
    
def Browse(request):
    return render(request, 'browse.html')

def Home(request):
    return render(request, 'home.html')

def Endpoint(request):
    if request.method == "POST":
        print(request.POST)
        return render(request, 'home.html')
    else:
        return render(request, 'home.html')

def poop(request):
    if request.method == "POST":
        id = request.POST['chalangeId']
        cur.execute('select rating from chalanges where id='+str(id)+';')
        inData = set(cur.fetchone()[0].split(','))
        inData.remove('')

        if request.POST['like'] in ('true', True, 1):
            if request.POST['user'] not in inData:
                inData.add(request.POST['user'])
        else:
            if request.POST['user'] in inData:
                inData.remove(request.POST['user'])

        inDataStr = ''.join(str+',' for str in inData)

        cur.execute('update chalanges set rating=\''+inDataStr+'\' where id='+str(id)+';')
        conn.commit()
        
        return(HttpResponse('all good'))
    else:
        return(HttpResponse('this should never happen'))

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Home),
    path('new/', New),
    path('browse/', Browse),
    path('<int:id>/', Chalange),
    path('endpoint/', Endpoint),
    path('poop/', poop),
]
