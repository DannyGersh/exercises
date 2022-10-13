from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def nonHome(request, id):
    return render(request, 'index.html')

# routing is done in react - see App.js
# home() is the home page
# nonHome() is anything but the home page

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home), # see (1) in App.js
    path(r'<slug:id>/', nonHome), # see (2) in App.js
    path(r'slug/<slug:id>/', nonHome), # see (3) in App.js
]
