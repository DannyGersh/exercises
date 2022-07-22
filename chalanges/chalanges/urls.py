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
from django.contrib.auth import authenticate, logout, login

# exercise format: ['id', 'question', 'answer', 'hints', 'author', 'creationdate', 'title', 'rating', 'tags']
# user format: [id, answered, liked]

SQLDataKeys = ['id', 'question', 'answer', 'hints', 'author', 'creationdate', 'title', 'rating', 'tags']

@ensure_csrf_cookie
def Chalange(request, id):
	
	outData = {} # data for js. will be converted to secure json.
	# when no signInFailure occures, ssesion.signInFailure is undefined
	if not request.session.has_key('signInFailure'):
		request.session['signInFailure'] = False
	outData['signInFailure'] = request.session.get('signInFailure')
	outData['isSignUp'] = request.session.get('isSignUp')
	outData['isAuth'] = request.user.is_authenticated
	outData['userid'] = request.user.id
	request.session['signInFailure'] = False # not needed enimore
	request.session['isSignUp'] = False # not needed enimore
	
	cur.execute('''
	select 
			id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags
			from chalanges where id=''' + str(id)
	)
	inData = cur.fetchone()
	
	outData['chalange'] = { k:v for (k,v) in zip(SQLDataKeys, inData) }

	return render(request, 'chalange.html', context={'value': outData})

@ensure_csrf_cookie		
def Browse(request, sterm=''):

	outData = {} # data for js. will be converted to secure json.
	# when no signInFailure occures, ssesion.signInFailure is undefined, define it.
	if not request.session.has_key('signInFailure'):
		request.session['signInFailure'] = False
	outData['signInFailure'] = request.session.get('signInFailure')
	outData['isSignUp'] = request.session.get('isSignUp')
	outData['isAuth'] = request.session.get('isAuth')
	outData['userid'] = request.user.id
	request.session['signInFailure'] = False # not needed enimore
	request.session['isSignUp'] = False # not needed enimore
	
	outData["search term"] = sterm		
	
	# first get post data from react,
	# at this point sterm is empty.
	# then redirect here again,
	# but with apropriete sterm (search term)
	
	if request.method == "POST" and sterm == '':
		# if user entered search tearm in search bar
		return redirect('/browse/'+request.POST['browse']+'/')
	
	else:
		# after initial redirect, now with correct url
		cur.execute(
				'select * from chalanges where \''+sterm+'\' = any(tags) order by cardinality(rating) desc limit 10;'
		)
		inData = cur.fetchall() 
		
		outData['chalanges'] = { k:v for (k,v) in zip(range(len(inData)), inData) }
		
		return render(request, 'browse.html', context={'value': outData})

def Home(request):
		#print(request.user.is_authenticated)
		#outData = {
		#		'userName': request.user.username,
		#		'userPassword': request.user.password,
		#		'is_authenticated': request.user.is_authenticated,
		#}
		return render(request, 'Home.html')

def Poop(request):
		if request.method == "POST":
				id = request.POST['chalangeId']
				cur.execute('select rating from chalanges where id='+str(id)+';')
				inData = set(cur.fetchone()[0])
				
				print("POOOOOOOOOOP", inData)
				
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

@login_required
@ensure_csrf_cookie	
def Profile(request, userid):

	outData = {} # data for js. will be converted to secure json.
	# when no signInFailure occures, ssesion.signInFailure is undefined
	if not request.session.has_key('signInFailure'):
		request.session['signInFailure'] = False
	outData['signInFailure'] = request.session.get('signInFailure')
	outData['isSignUp'] = request.session.get('isSignUp')
	outData['isAuth'] = request.session.get('isAuth')
	outData['userid'] = request.user.id
	request.session['signInFailure'] = False # not needed enimore
	request.session['isSignUp'] = False # not needed enimore
	
	# SQL: fetch user information from "users1" table and store in inData.
	# columns are:
	# 1) id - user id: integer, foreigen key refrences serial primary key of table "auth_user" wich is the default(postgres version) django table of users 
	# 2) answered - answered questions: array of integer
	# 3) liked - liked questions: array of integer
	
	# non SQL version:
	# inData[0] - user id
	# inData[1] - list of ids of answered questions
	# inData[2] - list of ids of liked questions
		
	cur.execute('select username,answered,liked,authored from auth_user where id='+str(userid))
	inData = cur.fetchone()
		
	# PERROR: check if exists
	if not inData:
		print('ERROR: inData is undefined')
		inData = [userid, [], []]
	# END_PERROR
	
	inData = list(inData)
	
	# PERROR: handle missing information
	try:
		inData[1]
		print('ERROR: inData[1] is undefined')
	except:
		inData.append([])
	try:
		inData[2]
		print('ERROR: inData[2] is undefined')
	except:
		inData.append([])	
	# END_PERROR
	
		
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
			outData['data'] = [answered, liked, request.user.username]
			
			return render(request, 'user.html', context={'value': outData})
	
	else:
			return HttpResponse("trying to peek at other acounts ar ya ?")
				
def Login(request):
	
	if request.method == "POST":
		
		uname = request.POST.get('uname')
		password = request.POST.get('password')
		currentPage = request.POST.get('currentPage')
		verPassword = request.POST.get('Verify password')
		validated = request.POST.get('validated')	
								
		request.session['isSignUp'] = False
		user = authenticate(username=uname, password=password)
		
		if not user:
			request.session['isAuth'] = False
			request.session['signInFailure'] = True
		else:
			login(request, user)
			request.session['isAuth'] = True
			request.session['signInFailure'] = False
			
		return redirect(currentPage)

	# this should never happen
	return redirect('./../../../../../../../')

def LogOut(request):
	
	logout(request)	
	return redirect("./../../../../")

def SignUp(request):
	
	if request.method == "POST":
		
		uname = request.POST.get('uname')
		password = request.POST.get('password')
		currentPage = request.POST.get('currentPage')
		verPassword = request.POST.get('Verify password')
		validated = request.POST.get('validated')	
		
		request.session['signInFailure'] = True
		request.session['isSignUp'] = True
		request.session['isAuth'] = False
		
		if validated == 'false':
			return redirect(currentPage)
			
		elif password != verPassword:
			return redirect(currentPage)
			
		try:
			user = User.objects.create_user(
				uname, '', password
			)
			request.session['isAuth'] = True
			request.session['signInFailure'] = False
			return redirect(currentPage)
		
		except:
			return redirect(currentPage)

	# this should never happen
	return redirect('./../../../../../../../home')

def New(request):
	outData = {} # data for js. will be converted to secure json.
	outData['isAuth'] = request.user.is_authenticated
	outData['userid'] = request.user.id
	
	cur.execute('select * from tags')
	outData['tags'] = cur.fetchall()
	
	return render(request, 'New.html', context={'value': outData})

def NewSubmited(request):

	if request.method == "POST":
		print("POOP", request.POST)
		cur.execute('''insert into chalanges
		(question, answer, hints, author, title, tags, rating)
		values( ''' + 
			"\'" + request.POST.get('exercise', '') 	+ "\', " + 
			"\'" + request.POST.get('answere', '') 		+ "\', " + 
			"\'" + request.POST.get('hints', '') 			+ "\', " + 
			"\'" + request.user.username							+ "\', " + 
			"\'" + request.POST.get('title', '') 			+ "\', " + 
			"\'{" + request.POST.get('tags', '') 			+ "}\'," +
			"\'{}\'"	 +
		')'
		)
		conn.commit()

	return HttpResponse("POOP")
		
urlpatterns = [
		path('', Home),
		path('admin/', admin.site.urls),
		
		path('<int:id>/', Chalange),
		path('browse/<str:sterm>/', Browse),
		path('user/<int:userid>/', Profile),
		path('new/', New),
		
		path('browse/', Browse),
		path('poop/', Poop),
		path('login/', Login),
		path('logout/', LogOut),
		path('signup/', SignUp),
		path('newSubmited/', NewSubmited),
]
