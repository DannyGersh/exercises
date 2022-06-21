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

import psycopg2 as pg
from . __init__ import cur

def Chalange(request, id):
    cur.execute('select * from chalanges where id='+str(id)+';')
    inData = cur.fetchone()
    outData = {'id': inData[0], 'question': inData[1], 'answer': inData[2]}
    return render(request, 'chalange.html', context={'value': outData })

def New(request):
    return render(request, 'new.html')
    
def Browse(request):
    return render(request, 'browse.html')

def Home(request):
    return render(request, 'home.html')
        
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Home),
    path('new/', New),
    path('browse/', Browse),
    path('<int:id>/', Chalange),
]
