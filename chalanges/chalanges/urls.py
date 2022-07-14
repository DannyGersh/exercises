"""chalanges URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
		https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
		1. Add an import:	from my_app import views
		2. Add a URL to urlpatterns:	path('', views.home, name='home')
Class-based views
		1. Add an import:	from other_app.views import Home
		2. Add a URL to urlpatterns:	path('', Home.as_view(), name='home')
Including another URLconf
		1. Import the include() function: from django.urls import include, path
		2. Add a URL to urlpatterns:	path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render, redirect

import json
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse

import psycopg2 as pg
from . __init__ import cur, conn

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout

# exercise format: ['id', 'question', 'answer', 'hints', 'author', 'creationdate', 'title', 'rating', 'tags']
# user format: [id, answered, liked]

SQLDataKeys = ['id', 'question', 'answer', 'hints', 'author', 'creationdate', 'title', 'rating', 'tags']

@ensure_csrf_cookie
def Chalange(request, id):

	# normalView - Boolean:
	#		if False: a signup faild, return the page but with login form shown
	#		if True: return the normal page
	if not request.session.has_key('signInFailure'):
		print("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")
		request.session['signInFailure'] = True
	
	print(request.session['signInFailure'])
		
	cur.execute('''
	select 
			id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags
			from chalanges where id=''' + str(id)
	)
	inData = cur.fetchone()
	outData = { k:v for (k,v) in zip(SQLDataKeys, inData)}
	outData['signInFailure'] = request.session['signInFailure']
	
	return render(request, 'chalange.html', context={'value': outData})

@ensure_csrf_cookie		
def Browse(request, sterm=''):
		
		# first get post data from react,
		# at this point sterm is empty.
		# then redirect here again,
		# but with apropriete sterm (search term)
		
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
		#print(request.user.is_authenticated)
		#outData = {
		#		'userName': request.user.username,
		#		'userPassword': request.user.password,
		#		'is_authenticated': request.user.is_authenticated,
		#}
		return render(request, 'Home.html')

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

#@login_required
@ensure_csrf_cookie	
def profile(request, userid):

		# inData will hold all information of the user
		
		# SQL: fetch user information from "users1" table and store in inData.
		# columns are:
		# 1) id - user id: integer, foreigen key refrences serial primary key of table "auth_user" wich is the default(postgres version) django table of users 
		# 2) answered - answered questions: array of integer
		# 3) liked - liked questions: array of integer
		
		# non SQL version:
		# inData[0] - user id
		# inData[1] - list of ids of answered questions
		# inData[2] - list of ids of liked questions
			
		cur.execute('select * from users1 where id='+str(userid))
		inData = cur.fetchone()
		
		if request.user.is_authenticated and request.user.id == userid:		
				# convert answered list of ids to
				# a list that holds exercises(list)
				# same for liked
				answered = []
				liked = []
				for i in inData[1]:
						cur.execute('''
						select 
								id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags
								from chalanges where id=''' + str(i)
						)
						q = cur.fetchone()
						if q:
								answered.append(q)
								
				for i in inData[2]:
						cur.execute('''
						select 
								id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags
								from chalanges where id=''' + str(i)
						)
						q = cur.fetchone()
						if q:
								liked.append(q)
				
				
				# make sure everithing is sorted by likes descending
				liked.sort(key=lambda e: len(e[8]))
				liked.reverse()
				answered.sort(key=lambda e: len(e[8]))
				answered.reverse()
		
				return render(request, 'user.html', context={'value': [answered, liked, request.user.username]})
		
		else:
				return HttpResponse("trying to peek at other acounts ar ya ?")
				
def login(request):
	
	if request.method == "POST":
		# ls - 'login' or 'signup'
		# currentPage - string of the current page
		ls = request.POST['login_signup']
		uname = request.POST['uname']
		password = request.POST['password']
		currentPage = request.POST['currentPage']
		
		request.session['signInFailure'] = True
		
		if ls == 'login':
			user = authenticate(username=uname, password=password)
			if not user:
				request.session['signInFailure'] = True
			else:
				request.session['signInFailure'] = False
				
			return redirect(currentPage)

		elif ls == 'signup':
			try:
				user = User.objects.create_user(
					uname, '', password
				)
				request.session['signInFailure'] = False
					
			except:
				request.session['signInFailure'] = True
								
		return redirect(currentPage)

	# this should never happen
	return redirect('./../../../../../../../home')
				
urlpatterns = [
		path('', Home),
		path('admin/', admin.site.urls),
		
		path('<int:id>/', Chalange),
		path('browse/<str:sterm>/', Browse),
		path('user/<int:userid>/', profile),
		
		path('browse/', Browse),
		path('poop/', poop),
		path('login/', login),
		path('signup/', login),
]
