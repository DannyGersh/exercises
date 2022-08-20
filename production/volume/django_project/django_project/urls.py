"""django_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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
from django.http import HttpResponse
from django.shortcuts import render, redirect

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import requires_csrf_token
from django.template.context_processors import csrf
from django.middleware.csrf import get_token

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout, login

from inspect import currentframe, getframeinfo

import json
import psycopg2
from . compileLatex import updateLatexList
import re
import os
from time import time

conn = psycopg2.connect("dbname=exercises user=postgres")
cur = conn.cursor()
cur.execute('SELECT version();')
db_version = cur.fetchone()

# chalanges database columns
SQLDataKeys = [
	'id',           # serial primary key not null 
	'question',     # varchar(4000) not null
	'answer',       # varchar(4000) not null
	'hints',        # varchar(4000)
	'author',       # varchar(100)
	'creationdate', # timestamp default current_timestamp
	'title',        # varchar(400) not null
	'rating',       # integer[] not null default '{}'
	'tags',         # varchar(100)[] not null default '{}'
	'explain',      # varchar(4000)
	'latex',				# varchar(30)[] not null default '{}'
]
# auth_user database extra columns
auth_user_extra = [
	'authored', # integer[] default '{}'
	'liked',    # integer[] default '{}'
	'answered'  # integer[] default '{}'
]
# tags database
database_tags = [
	'id',		# serial primary key not null
	'name',	# varchar(100) not null unique
]
# new(page) targets
targets = [
	'title',
	'exercise',
	'answer',
	'hints',
	'explain'
]


dir_users = os.path.join('/','volume','static','users')

reg_latex = r'$$___latex$$'
reg_latex_search = r'\$\$(.+?)\$\$'

@ensure_csrf_cookie		
def test(request):

	latexList =	json.loads(request.body.decode("utf-8"))
	latexList = updateLatexList(latexList[1], str(request.user.id), latexList[0])
	#request.session['latexList'] = latexList
	
	return HttpResponse('test')

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
	request.session['currentUrl'] = '../../../../../'+str(id)
	
	cur.execute('''
	select 
		id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags, explain, latex
		from chalanges where id=''' + str(id)
	)
	inData = cur.fetchone()	
	
	# TODO - authid should be set in the chalanges table, for avoiding this second sql call.
	cur.execute("select id from auth_user where username='"+inData[4]+"'")
	authid = cur.fetchone()[0]
	
	outData['chalange'] = { k:v for (k,v) in zip(SQLDataKeys, inData) }
	
	dir_exercise = os.path.join(dir_users, str(request.user.id), outData['chalange']['latex'])
	file_json = os.path.join(dir_exercise, '.json')
	with open(file_json, 'r') as f:
		identifiers = json.loads(f.read())
	
	outData['chalange']['list_latex'] = identifiers
	outData['chalange']['authid'] = authid
	
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
	request.session['currentUrl'] = '../../../../../browse/'+sterm

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
				'select id,question,answer,hints,author,creationdate,title,rating,tags,explain from chalanges where \''+sterm+'\' = any(tags) order by cardinality(rating) desc limit 10;'
		)
		inData = cur.fetchall()
		for i in range(len(inData)):
			inData[i] = {k:v for (k,v) in zip(SQLDataKeys, inData[i])}
			
		outData['chalanges'] = inData
		
		return render(request, 'browse.html', context={'value': outData})

def Home(request):
		
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
	request.session['currentUrl'] = '../../../../../'

	cur.execute('''
	select 
			id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags, explain
			from chalanges order by creationdate desc limit 10'''
	)
	in_latest = cur.fetchall()	
	for i in range(len(in_latest)):
		in_latest[i] = {k:v for (k,v) in zip(SQLDataKeys, in_latest[i]) }
	
	cur.execute('''
	select 
			id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags, explain
			from chalanges order by cardinality(rating) desc limit 10'''
	)
	in_hotest = cur.fetchall()	
	for i in range(len(in_hotest)):
		in_hotest[i] = {k:v for (k,v) in zip(SQLDataKeys, in_hotest[i]) }
	
	outData['latest'] = in_latest
	outData['hotest'] = in_hotest
	
	return render(request, 'home.html', context={'value': outData})

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
	request.session['currentUrl'] = '../../../../../'+str(request.user.id)

	cur.execute('select authored, liked, answered, username from auth_user where id='+str(userid))
	inData = cur.fetchone()
	
	# PERROR: check if exists
	frame = getframeinfo(currentframe())
	if not inData:
		print('ERROR: inData is undefined\nin: ', frame.filename, frame.lineno)
		inData = [[], [], [], userid]
	# END_PERROR
	
	inData = list(inData)
	
	# PERROR: handle missing information
	try:
		inData[0]
	except:
		print('ERROR: inData[1] is undefined\nin: ', frame.filename, frame.lineno)
		inData.append([])
	try:
		inData[1]
	except:
		print('ERROR: inData[2] is undefined\nin: ', frame.filename, frame.lineno)
		inData.append([])	
	try:
		inData[2]
	except:
		print('ERROR: inData[3] is undefined\nin: ', frame.filename, frame.lineno)
		inData.append([])	
	# END_PERROR
		
	if request.user.is_authenticated and request.user.id == userid:		

			authored = []
			liked = []
			answered = []
			
			def populate(_inData, _outData):

				for i in _inData:
						cur.execute('''
						select 
								id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags
								from chalanges where id=''' + str(i) + ' order by cardinality(rating) desc'
						)
						q = list(cur.fetchone())
						
						if q:
							_outData.append({k:v for (k,v) in zip(SQLDataKeys, q)})
			
			cur.execute('''
			select 
					id, question, answer, hints, author, to_char(creationdate, 'MM/DD/YYYY - HH24:MI'), title, rating, tags
					from chalanges where author=''' + '\'' + str(request.user.username) + '\' order by cardinality(rating) desc'
			)
			q = cur.fetchall()
			if q:
				authored = q
				for i in range(len(authored)):
					authored[i] = { k:v for (k,v) in zip(SQLDataKeys, authored[i]) }

				
			populate(inData[1], liked)	
			populate(inData[2], answered)	

			outData['data'] = [authored, liked, answered, request.user.username]
						
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
		
		# after unauth user clicks new and registers
		if request.session.get('isNew') and request.user.is_authenticated:
			request.session['isNew'] = False
			request.session['signInFailure'] = False
			return redirect('../../../../../../new')
		
		return redirect(currentPage)

	# this should never happen
	frame = getframeinfo(currentframe())
	print('ERROR: this should never happen\nin: ', frame.filename, frame.lineno)
	return redirect('./../../../../../../../')

def LogOut(request):
	
	logout(request)	
	# this is ok
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
	frame = getframeinfo(currentframe())
	print('ERROR: this should never happen\nin: ', frame.filename, frame.lineno)
	return redirect('./../../../../../../../')

@xframe_options_exempt
def Like(request):
		
		if request.method == "POST":
				id = request.POST['chalangeId']

				if request.POST['like'] in ('true', True, 1):
					cur.execute('update auth_user set liked=array_append(liked, \''+str(id)+'\') where id=\''+str(request.user.id)+'\'')
					cur.execute('update chalanges set rating=array_append(rating, \''+str(request.user.id)+'\') where id=\''+str(id)+'\'')

				else:
					cur.execute('update auth_user set liked=array_remove(liked, \''+str(id)+'\') where id=\''+str(request.user.id)+'\'')
					cur.execute('update chalanges set rating=array_remove(rating, \''+str(request.user.id)+'\') where id=\''+str(id)+'\'')

				conn.commit()
				
				return(HttpResponse('all good'))
		else:
				return(HttpResponse('this should never happen'))

@ensure_csrf_cookie		
def New(request):
	
	if request.user.is_authenticated:
		
		outData = {} # data for js. will be converted to secure json.
		outData['isAuth'] = request.user.is_authenticated
		outData['userid'] = request.user.id

		cur.execute('select name from tags')
		outData['tags'] = [i[0] for i in cur.fetchall()] 
		
		return render(request, 'new.html', context={'value': outData})
	
	else:
		request.session['signInFailure'] = True
		request.session['isNew'] = True
		return redirect(request.session.get('currentUrl'))

def NewSubmited(request):

	outData = {} # data for js. will be converted to secure json.
	
	if request.method == "POST":
		
		tags = request.POST.get('tags', '')
		if tags == []: tags = ''
		if tags == '[]': tags = ''
		tags = tags.replace('[', '')
		tags = tags.replace(']', '')
				
		if(request.POST.get('issubmit')=='true'):

			dir_original = os.getcwd()
			dir_current_user = os.path.join(dir_users, str(request.user.id))
			dir_current_svg = os.path.join(dir_current_user, 'svg')
			file_json = os.path.join(dir_current_user, '.json')
			
			now = str(time()).replace('.','')
			
			os.chdir(dir_current_user)
			os.mkdir(now)
			for i in os.listdir(dir_current_svg):
				os.system('mv ' + os.path.join('svg',i) + ' ' + os.path.join(now, i))
			
			os.system('mv .json ' + os.path.join(now, '.json'))

			title 	 = request.POST.get('title', '')
			exercise = request.POST.get('exercise', '')
			answer 	 = request.POST.get('answer', '')
			hints 	 = request.POST.get('hints', '')
			explain  = request.POST.get('explain', '')
			
			title 	 = re.sub(reg_latex_search, reg_latex, title)
			exercise = re.sub(reg_latex_search, reg_latex, exercise)
			answer 	 = re.sub(reg_latex_search, reg_latex, answer)
			hints 	 = re.sub(reg_latex_search, reg_latex, hints)
			explain	 = re.sub(reg_latex_search, reg_latex, explain)

			print(answer)
			
			cur.execute('''insert into chalanges
			(question, answer, hints, author, title, tags, explain, rating, latex)
			values( ''' + 
				"\'"  + exercise							+ "\', " + 
				"\'"  + answer 								+ "\', " + 
				"\'"  + hints 								+ "\', " + 
				"\'"  + request.user.username	+ "\', " + 
				"\'"  + title									+ "\', " + 
				"\'{" + tags 									+ "}\'," +
				"\'"  + explain 							+ "\'," +
				"\'{}\',"	 					+	
				"\'" + now + "\'" 	+
			')'
			)
			cur.execute("update auth_user set authored[cardinality(authored)] = (select count(*) from chalanges)::integer where id = "+str(request.user.id))
			conn.commit()
			
			os.chdir(dir_original)
			
			return redirect("../../../../user/" + str(request.user.id))
		
		else:			
			cur.execute('''select to_char(now(), 'MM/DD/YYYY - HH24:MI')''')
			timestamp = cur.fetchone()			
			
			tags = tags.split(',')
			
			title = request.POST.get('title', '').replace(r'','')		
			titleLatex = request.session.get('latexList', [])

			a = (re.sub(r'\$\$(.+?)\$\$', reg_latex, title))
			a = re.split(r'(\$\$___latex\$\$)', a)
			
			try:
				a.remove('')
			except:
				pass
			
			index = 0
			for i in range(len(a)):
				if(a[i] == reg_latex):
					# convert to html
					a[i] = "<img class='latex' src='/static/users/%s/svg/%s.svg'/>"%(str(request.user.id),titleLatex[index][1])
					index += 1
			
			title = '<p>%s</p>'%''.join(a)
			
			inData = [
				request.user.id									 ,
				request.POST.get('exercise', '') ,
				request.POST.get('answer', '') 	 ,
				request.POST.get('hints', '') 	 ,
				request.user.username						 ,
				timestamp 											 ,
				title														 ,
				[]															 ,
				tags														 ,
				request.POST.get('explain', '')  ,
				'ignored'												 ,
			]
			outData['chalange'] = { k:v for (k,v) in zip(SQLDataKeys, inData) }
			
			return render(request, 'chalange.html', context={'value': outData})
	
	# this should never happen
	frame = getframeinfo(currentframe())
	print('ERROR: this should never happen\nin: ', frame.filename, frame.lineno)
	return redirect('./../../../../../../../')



urlpatterns = [
  path('admin/', admin.site.urls),
	
	path('', Home),
	path('new/', New),
	path('<int:id>/', Chalange),
	path('browse/<str:sterm>/', Browse),
	
	path('like/', Like),
	path('login/', Login),
	path('browse/', Browse),
	path('logout/', LogOut),
	path('signup/', SignUp),
	path('newSubmit/', NewSubmited),
	path('user/<int:userid>/', Profile),
	
	path('test/', test),
]
