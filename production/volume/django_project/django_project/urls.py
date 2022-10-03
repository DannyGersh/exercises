
from django.contrib import admin
from django.urls import path
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.clickjacking import xframe_options_exempt

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
from subprocess import run as subprocessRun

conn = psycopg2.connect("dbname=exercises user=postgres")
conn.set_session(autocommit=True)
cur = conn.cursor()
cur.execute('SELECT version()')
db_version = cur.fetchone()

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
	'latex',		# varchar(30)[] not null default '{}'
	'latexp',		# varchar(400)
]
sql_auth = [
	'authored', # integer[] default '{}'
	'liked',    # integer[] default '{}'
	'answered'  # integer[] default '{}'
]
sql_tags = [
	'id',	# serial primary key not null
	'name',	# varchar(100) not null unique
]
sql_messages = [
	'id'         	# serial			primary key not null,
	'chalangeId'  	# serial 			not null 			,
	'sender'  		# serial 			not null 			,
	'receiver'    	# serial 			not null 			,
	'message'       # varchar(4000)		not null
]

# new(page) targets / tabs
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


# remove testNameUnique
def testNameUnique(request):
	
	uname = json.loads(request.body.decode("utf-8"))

	try:
		cur.execute('''
			select username from auth_user
		''')
	except err:
		return JsonResponse({"error": err})

	inData = [i[0] for i in cur.fetchall()]

	return JsonResponse({"isUnique": uname not in inData})

@ensure_csrf_cookie
def AddTag(request):

	body = json.loads(request.body.decode("utf-8"))
	
	cur.execute('''
		insert into tags(name) values('%s')
		'''%( str(body) )
	)
	conn.commit()
	
	return HttpResponse(200)

@ensure_csrf_cookie
def DeleteChalange(request):

	# body - [int (exercise id), str (latex folder name), int (caller)]
	body = json.loads(request.body.decode("utf-8"))

	cur.execute(
		"delete from chalanges where id='%s'"%(str(body[0]))
	)
	cur.execute('''
		update auth_user set 
			authored=array_remove(authored,%s),
			liked=array_remove(liked,%s)
		'''%( str(body[0]), str(body[0]) )
	)
	conn.commit()
		
	dir_base = os.path.join(dir_users, str(request.user.id))
	dir_exercise = os.path.join(dir_base, body[1])
	
	if subprocessRun(  ['rm','-r', dir_exercise]  ):
		# TODO - do something if not successfull
		pass

	# NOTE - delete all files and folders that are not assosiated with an existing exercise in database

	dir_user = os.path.join(dir_users, str(request.user.id))
	dir_svg = os.path.join(dir_user, 'svg')
	file_json = os.path.join(dir_user, '.json')
		
	cur.execute('''
	select latex from chalanges where id in (select unnest(authored) from auth_user where id=%s)
	'''%str(request.user.id))
	temp = cur.fetchall()	

	for i in os.listdir(dir_user):
		if i not in [i[0] for i in temp]:
			res = subprocessRun(['rm', '-r', os.path.join(dir_user, i)])
	
	# END_NOTE
		
	return HttpResponse('Delete')

def DeleteMessage(request):
	
	# only post request, otherwise error
	
	# POST data {'messageId' : messageId}

	# return values:
	# {'result': 0} - success
	# {'result': str} - str is the error
				
	if request.method == "POST":
		body = json.loads(request.body.decode("utf-8"))
		messageId = body['messageId']

		try:
			cur.execute("delete from messages where id='%s'"%messageId)
			return JsonResponse({'result':0})
		except err:
			return JsonResponse({'result':'ERROR - sql error\n'+err})

	# not a POST request	
	return JsonResponse({'result':'ERROR - not a POST request'})

@ensure_csrf_cookie		
def UpdateLatex(request):

	inData =	json.loads(request.body.decode("utf-8"))

	target = inData[0]
	latexList = inData[1]
	pacages = inData[2]
	
	res = updateLatexList(latexList, str(request.user.id), target, pacages)
	
	return HttpResponse('UpdateLatex')

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
	
@ensure_csrf_cookie	
def Chalange(request, id):
	
	outData = {} # data for js. will be converted to secure json.
	outData['isAuth'] = request.user.is_authenticated
	outData['userid'] = request.user.id
	request.session['currentUrl'] = '/'+str(id)
	
	outData['chalange'] = getChalange(id)
	
	if outData['chalange']:
		return render(request, 'chalange.html', context={'value': outData})
	else:
		return HttpResponse("could not find this exercise")
		
@ensure_csrf_cookie	
def Browse(request, sterm=''):
	
	outData = {} # data for js. will be converted to secure json.
	outData['isAuth'] = request.session.get('isAuth')
	outData['userid'] = request.user.id
	request.session['currentUrl'] = '/browse/'+sterm

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
		
		cur.execute('''
			select id, title, rating from chalanges
			where title like '%{}%'
			order by cardinality(rating) 
			desc limit 10
		'''.format(sterm))
		inData_title = cur.fetchall()
		
		cur.execute('''
			select id, exercise, rating from chalanges
			where exercise like '%{}%'
			order by cardinality(rating) 
			desc limit 10
		'''.format(sterm))
		inData_exercise = cur.fetchall()
			
		cur.execute('''
			select id,rating,tags 
			from chalanges
			where (select id from tags where name='%s') = any(tags)
			order by cardinality(rating) 
			desc limit 10
		'''%sterm)
		inData_tags = cur.fetchall()
		
		fin = []
		inData = inData_title + inData_tags + inData_exercise
		for i in inData:
			if i[0] not in [x[0] for x in fin]:
				fin.append(i)
		
		for i in range(len(fin)):
			fin[i] = getChalange(fin[i][0])
			
		outData['chalanges'] = fin
		
		return render(request, 'browse.html', context={'value': outData})

@ensure_csrf_cookie
def Home(request):
	
	outData = {} # data for js. will be converted to secure json.
	# when no signInFailure occures, ssesion.signInFailure is undefined, define it.
	outData['isAuth'] = request.session.get('isAuth')
	outData['userid'] = request.user.id
	request.session['currentUrl'] = '/'

	# TODO - this takes 22 SQL quaries, could be onley 2 !
	
	# TODO - make one SQL quary insted of 10
	cur.execute("select id from chalanges order by creationdate desc limit 10")
	in_latest = cur.fetchall()	
	for i in range(len(in_latest)):
		in_latest[i] = getChalange(in_latest[i][0])
	
	# TODO - make one SQL quary insted of 10
	cur.execute("select id from chalanges order by cardinality(rating) desc limit 10")
	in_hotest = cur.fetchall()	
	for i in range(len(in_hotest)):
		in_hotest[i] = getChalange(in_hotest[i][0])
	
	outData['latest'] = in_latest
	outData['hotest'] = in_hotest
	
	return render(request, 'home.html', context={'value': outData})

@ensure_csrf_cookie	
def Profile(request, userid):

	outData = {} # data for js. will be converted to secure json.
	outData['isAuth'] = request.session.get('isAuth')
	outData['userid'] = request.user.id
	request.session['currentUrl'] = '/user/'+str(request.user.id)

	cur.execute('select authored, liked, username from auth_user where id='+str(userid))
	inData = cur.fetchone()
	
	# PERROR: check if exists
	frame = getframeinfo(currentframe())
	
	if not inData:
		# inData not defined
		err = 'ERROR\n: file: %s\n line: %s'%(frame.filename, frame.lineno)
		return HttpResponse(err)
	# END_PERROR
	
	inData = list(inData)
	
	# PERROR: handle missing information
	try:
		inData[0]
	except:
		print('ERROR: inData[0] is undefined\nin: ', frame.filename, frame.lineno)
		inData.append([])
	try:
		inData[1]
	except:
		print('ERROR: inData[1] is undefined\nin: ', frame.filename, frame.lineno)
		inData.append([])	
	try:
		inData[2]
	except:
		print('ERROR: inData[2] is undefined\nin: ', frame.filename, frame.lineno)
		inData.append([])	
	# END_PERROR
	
	# SQL
	# get - [chalangeId, message_creation_date, sender_name, message_text] 
	try:
		cur.execute('''
		select
			a.id, 
			b.id, 
			to_char(a.creationDate, 'HH24:MI MM/DD/YYYY'), 
			c.username, 
			a.message 

		from messages as a 
		inner join chalanges as b on a.chalangeId=b.id 
		inner join auth_user as c on a.sender=c.id

		where a.receiver = '%s'
		'''%request.user.id)
		
		messages = cur.fetchall()
		outData['messages'] = messages
	
	except err:
		print(err)

	if request.user.is_authenticated and request.user.id == userid:		

		authored = []
		liked = []
			
		for i in inData[0]:
			data = getChalange(i)
			if data:
				authored.append(data)
					
		for i in inData[1]:
			data = getChalange(i)
			if data:
				liked.append(data)
				
		outData['data'] = [authored, liked, request.user.username]

		return render(request, 'user.html', context={'value': outData})
	
	else:
		return HttpResponse("nop")

@ensure_csrf_cookie
def Login(request):
	outData = {
		'isNew': False,
		'isAuth': request.user.is_authenticated,
      	'isLogIn': True,
      	'currentUrl': request.session['currentUrl'],
		'userid': str(request.user.id),
	}
	return render(request, 'login.html', context={'value': outData} )

def SignUp(request):
	outData = {
		'isNew': False,
		'isAuth': request.user.is_authenticated,
      	'isLogIn': False,
      	'currentUrl': request.session['currentUrl'],
		'userid': str(request.user.id),
	}
	return render(request, 'login.html', context={'value': outData} )

def submitLogIn(request):
	
	# input: {'uname': str, 'password': str}
	# output: {'url': str - wher to send user after login}

	body = json.loads(request.body.decode("utf-8"))

	uname = body.get('uname')
	password = body.get('password')
	currentUrl = request.session.get('currentUrl', '/')

	user = authenticate(username=uname, password=password)
	if user is not None:
		login(request, user)
		request.session['isAuth'] = True
		return JsonResponse({'url': currentUrl})
	else:
		return JsonResponse({'error': "could not log in ..."})

def submitSignUp(request):
	
	# input: {'uname': str, 'password': str}
	# output: {'url': str - wher to send user after login}

	body = json.loads(request.body.decode("utf-8"))
	
	uname = body.get('uname')
	password = body.get('password')
	currentUrl = request.session.get('currentUrl', '/')
	
	# SQL - is uname unique
	
	try:
		cur.execute('''
			select username from auth_user
		''')
	except err:
		return JsonResponse({"error": "could not create user ..."})

	inData = [i[0] for i in cur.fetchall()]

	if uname in inData:
		return JsonResponse({"error": 'user name taken, try another one.'})

	# END_SQL

	try:
		user = User.objects.create_user(
			uname, '', password
		)
		if not user:
			return JsonResponse({'error': "could not create user ..."})
		else:
			login(request, user)
			request.session['isAuth'] = True
	except:
		return JsonResponse({'error': "could not create user ..."})
	
	return JsonResponse({'success': 0})

@ensure_csrf_cookie
def LogOut(request):
	
	logout(request)	
	# this is ok
	return redirect("/")

@ensure_csrf_cookie
def Like(request):
	
	# only post request, otherwise error
	
	# POST data (key : value)
	# chalangeId: chalange id (int),
	# like: 'True' or 'False' (str), // this is a string for debbuging purposes
	# user: user id (int)

	# return values:
	# {'result': 0} - success
	# {'result': str} - str is the error
				
	if request.method == "POST":

		body = json.loads(request.body.decode("utf-8"))
		
		chalangeId = body.get('chalangeId', None)
		like = body.get('like', None) # string for debbuging purposes
		user = body.get('user', None)
		
		# PERROR
		if not chalangeId or not like or not user:
			return JsonResponse({'result':'ERROR - missing information'})

		# SQL
		try:

			if like == 'True':
				cur.execute('update auth_user set liked=array_append(liked, \''+str(chalangeId)+'\') where id=\''+str(request.user.id)+'\'')
				cur.execute('update chalanges set rating=array_append(rating, \''+str(request.user.id)+'\') where id=\''+str(chalangeId)+'\'')#
			
			else:
				cur.execute('update auth_user set liked=array_remove(liked, \''+str(chalangeId)+'\') where id=\''+str(request.user.id)+'\'')
				cur.execute('update chalanges set rating=array_remove(rating, \''+str(request.user.id)+'\') where id=\''+str(chalangeId)+'\'')#
		
		except err:
			return JsonResponse({'result':'ERROR - sql error\n'+err})
	
		conn.commit()
		return JsonResponse({'result':0}) # success
	
	# not a POST request	
	return JsonResponse({'result':'ERROR - not a POST request'})

def Message2user(request):

	# only post request, otherwise error
	
	# POST data (key : value)
	# chalangeId: chalange id (int),
	# sender: user sending id (int),
	# receiver: user receiving id (int),
	# message: message (str)

	# return values:
	# {'result': 0} - success
	# {'result': str} - str is the error
				
	if request.method == "POST":

		body = json.loads(request.body.decode("utf-8"))

		chalangeId = body.get('chalangeId', None)
		sender = body.get('sender', None)
		receiver = body.get('receiver', None)
		message = body.get('message', None)

		# PERROR
		if (not chalangeId 
			or not sender
			or not receiver
			or not message):
			return JsonResponse({'result':'ERROR - missing information'})
		
		message = message.replace("'", "''")

		# SQL
		try:
			cur.execute('''
				insert into messages(
					chalangeId, 
					sender, 
					receiver, 
					message
				)
				values('%s','%s','%s','%s')
			'''%(chalangeId, sender, receiver, message))
		except err:
			return JsonResponse({'result':'ERROR - sql error\n'+err})

		return JsonResponse({'result':0}) # success
	
	# not a POST request	
	return JsonResponse({'result':'ERROR - not a POST request'})

@ensure_csrf_cookie		
def New(request, isSourceNav=False):

	request.session['currentUrl'] = '/new'

	if request.user.is_authenticated:

		outData = {} # data for js. will be converted to secure json.
		outData['isAuth'] = request.user.is_authenticated
		outData['userid'] = request.user.id

		cur.execute('select name from tags')
		outData['tags'] = [i[0] for i in cur.fetchall()] 
		
		outData['chalange'] = {}
		outData['chalange']['id'] = 'dummy_id' # id required for new chalange
		
		dir_user = os.path.join(dir_users, str(request.user.id))
		dir_svg_delete = os.path.join(dir_user, 'svg')
		file_json_delete = os.path.join(dir_user, '.json')

		os.system('rm -r %s'%dir_svg_delete)
		os.system('rm -r %s'%file_json_delete)

		if request.method == "POST":
			
			# user clicked edit - onley way to get here except reload
			
			outData['isEdit'] = True

			id_exercise = request.POST.get('id_exercise', -1)
			if id_exercise == -1:
				return HttpResponse('Could not get specified exercise')
			
			outData['chalange'] = getChalange(id_exercise)
						
			if not outData['chalange']:
				# TODO - understand why empty dict 
				outData['chalange'] = {}
			
			#print(outData['chalange'])
			
			
			dir_exercise = os.path.join(dir_user, outData['chalange']['latex'])
			dir_svg = os.path.join(dir_user, 'svg')
			file_json = os.path.join(dir_exercise, '.json')
			
			os.system('cp -R %s %s'%(dir_exercise, dir_svg))
			os.system('cp -R %s %s'%(file_json, os.path.join(dir_user,'.json')) )
			
			# get latex from .json to file in $$___latex$$ slots
			with open(file_json, 'r') as f:
				dataFromFile = json.loads(f.read())
					
			def reverseLatex(target):

				res = re.split('(\$\$___latex\$\$)', outData['chalange'][target])
				if '' in res:
					res.remove('')
				resFromFile = [i[0] for i in dataFromFile[target]]
				
				index = 0
				for i in range(len(res)):
					if res[i] == '$$___latex$$':
						res[i] = '$$'+resFromFile[index]+'$$'
						index += 1

				return ''.join(res)
						
			''' NOTE - request.session.get('EditInProgress')
				we denote request.session.get('EditInProgress') as "var" for this explanation
				
				if var is false - 
					user clicked edit and the page loads for the first time,
					then js loads the data from inData
				if var is true - 
					js hase already loaded inData,
					so it goes back to normal behaviour

				var is should be set to the exercise id,
				to differentiate what exercise is being edited.

				var is stored in session because the behaviour
				in js is different at first load and what goes after
			'''
			if request.session.get('EditInProgress','') != id_exercise:

				# edit is in progress

				outData['EditInProgress'] = False
				request.session['EditInProgress'] = id_exercise
				
				for i in os.listdir(dir_exercise):
					res = subprocessRun([
						'cp', '-r', 
						os.path.join(dir_exercise, i), 
						os.path.join(dir_user, 'svg', i),
					])
				
				res = subprocessRun([
					'cp', '-r', 
					os.path.join(dir_exercise, '.json'), 
					os.path.join(dir_user, '.json'),
				])
				
				# PERROR
				
				def validate(target):

					a = re.findall('\$\$___latex\$\$', outData['chalange'].get(target,''), flags = re.M | re.S)
					b = [i[0] for i in dataFromFile.get(target,'')]

					return len(a) == len(b)
				
				for i in targets:
					if not validate(i):
						pass
						#print('Exercise Corupted for some reasone ... target: %s\n'%i, outData['chalange'])
						#return HttpResponse('Exercise Corupted for some reasone ...')

				# END_PERROR

			else:
				outData['EditInProgress'] = False
				outData['chalange']['id'] = id_exercise
				
			outData['chalange']['title'] = reverseLatex('title')		
			outData['chalange']['exercise'] = reverseLatex('exercise')
			outData['chalange']['answer'] = reverseLatex('answer')
			outData['chalange']['hints'] = reverseLatex('hints')
			outData['chalange']['explain'] = reverseLatex('explain')

		else:
			# user clicked New in navbar - onley way to get here except reload

			request.session['EditInProgress'] = False
			outData['EditInProgress'] = False
			outData['isEdit'] = False
		
		return render(request, 'new.html', context={'value': outData})
	
	else:
		# user is not authenticated
		outData = {
			'isNew': True,
			'isAuth': False,
      		'isLogIn': True,
			'userid': str(request.user.id),
		}
		return render(request, 'login.html', context={'value': outData} )

@ensure_csrf_cookie
def NewSubmited(request):

	outData = {} # data for js. will be converted to secure json.
	
	if request.method == "POST":

		oldLatex = request.POST.get('oldLatex', '')
		
		try:
			tags = ["'"+i+"'" for i in json.loads(request.POST.get('tags', ''))]
			tags = ','.join(tags)
		except:
			tags = ''

		# TODO - fix weird 'true'

		if(request.POST.get('isSubmit')=='true'):

			# user ckliked submit on an exercise that does not yet exist

			request.session['EditInProgress'] = False
			
			dir_original = os.getcwd()
			dir_current_user = os.path.join(dir_users, str(request.user.id))
			dir_current_svg = os.path.join(dir_current_user, 'svg')
			file_json = os.path.join(dir_current_user, '.json')
			
			now = str(time()).replace('.','')
			
			if not os.path.exists(dir_current_user):
				os.makedirs(dir_current_user)
			if not os.path.exists(dir_current_svg):
				os.makedirs(dir_current_svg)
				
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
			
			title 	 = re.sub(reg_latex_search, reg_latex, title, flags = re.M | re.S)
			exercise = re.sub(reg_latex_search, reg_latex, exercise, flags = re.M | re.S)
			answer 	 = re.sub(reg_latex_search, reg_latex, answer, flags = re.M | re.S)
			hints 	 = re.sub(reg_latex_search, reg_latex, hints, flags = re.M | re.S)
			explain	 = re.sub(reg_latex_search, reg_latex, explain, flags = re.M | re.S)
			
			title 	 = title.replace("'","''")	 
			exercise = exercise.replace("'","''")
			answer 	 = answer.replace("'","''") 	
			hints 	 = hints.replace("'","''") 	
			explain	 = explain.replace("'","''")	
	
			latexp = request.POST.get('latexp', '')
			
			# insert into chalanges database
			# tags must be converted to teir corresponding id's

			# TODO - fix weird 'false' thing
			if request.POST.get('isEdit', '') == 'false':

				if not tags:
					tags = "'this is a non existing tag that while never exsist hopefully, prevents sql problems'"

				# user clicked submit on new exercise
				cur.execute('''
					insert into chalanges
					(exercise, answer, hints, author, title, tags, explain, rating, latex, latexp)
					values('%s', '%s', '%s', '%s', '%s', 
					array(select id from tags where name in (%s)),
					'%s', '%s', '%s', '%s')
				'''%(exercise, answer, hints, request.user.id, title, tags, explain, '{}', now, latexp)
				)

				cur.execute('''
					update auth_user 
						set authored[cardinality(authored)] = (select id from chalanges where latex='%s')::integer 
						where id = '%s'
				'''%(now, request.user.id) )
				conn.commit()
				
			else: 

				# user clicked submit when editing existing exercise

				exerciseId = request.POST.get('exerciseId', '')
				if(exerciseId == ''):
					return HttpResponse('Failed submiting exercise')

				if tags:	
					cur.execute('''
							select * from tags where name in (%s)
					'''%tags)
					tempInData = cur.fetchall()	
					tempInData = [str(i[0]) for i in tempInData]
					tagIds = ','.join(tempInData)
				else:
					tagIds=''

				try:
					cur.execute('''
					update chalanges set 
						exercise='%s', answer='%s',
						hints='%s', title='%s', 
						tags='{%s}', explain='%s', 
						latex='%s', latexp='%s'
					where id='%s'
					'''%(exercise, answer, hints, title, tagIds, explain, now, latexp, exerciseId)
					)
				except Exception as err:
					print(err)

				conn.commit()

				dir_oldLatex = os.path.join(dir_current_user, oldLatex)
				os.system('rm -r %s'%dir_oldLatex)	
				
			os.chdir(dir_original)
			
			return redirect("../../../../user/" + str(request.user.id))
		
		else:	
			
			# user clicked preview

			cur.execute('''select to_char(now(), 'MM/DD/YYYY - HH24:MI')''')
			timestamp = cur.fetchone()			
			
			tags = [ i[1:-1] for i in tags.split(',') ]
			try:
				tags.remove("")
			except:
				pass

			title 	 = request.POST.get('title', '')
			exercise = request.POST.get('exercise', '')
			answer 	 = request.POST.get('answer', '')
			hints 	 = request.POST.get('hints', '')
			explain  = request.POST.get('explain', '')
			
			title 	 = re.sub(reg_latex_search, reg_latex, title, flags = re.M | re.S)
			exercise = re.sub(reg_latex_search, reg_latex, exercise, flags = re.M | re.S)
			answer 	 = re.sub(reg_latex_search, reg_latex, answer, flags = re.M | re.S)
			hints 	 = re.sub(reg_latex_search, reg_latex, hints, flags = re.M | re.S)
			explain	 = re.sub(reg_latex_search, reg_latex, explain, flags = re.M | re.S)
			
			inData = [
				0, 
				exercise, 
				answer, 
				hints, 
				request.user.username, 
				timestamp,
				title, 
				[], 
				tags, 
				explain, 
				'svg',
			]
			outData['chalange'] = { k:v for (k,v) in zip(sql_chalange, inData) }

			file_json = os.path.join(dir_users, str(request.user.id), '.json')
			
			if not os.path.exists(file_json):
				identifiers = {"title": [], "exercise": [], "answer": [], "hints": [], "explain": []}
			else:	
				with open(file_json, 'r') as f:
					identifiers = json.loads(f.read())
	
			outData['chalange']['list_latex'] = identifiers
			outData['chalange']['author'] = str(request.user.id)
	
			return render(request, 'chalange.html', context={'value': outData})
	

	# this should never happen
	frame = getframeinfo(currentframe())
	print('ERROR: this should never happen\nin: ', frame.filename, frame.lineno)
	return redirect('/')


def Test(request):
	body = json.loads(request.body.decode("utf-8"))
	print(body)
	return JsonResponse({"test":0})


urlpatterns = [
  path('admin/', admin.site.urls),
	
	path('', Home),
	path('new/', New),
	path('<int:id>/', Chalange),
	path('browse/<str:sterm>/', Browse),
	
	path('browse/', Browse),
	path('login/', Login),
	path('logout/', LogOut),
	path('signup/', SignUp),
	path('newSubmit/', NewSubmited),
	path('user/<int:userid>/', Profile),
	
	# fetch request
	path('like/', Like),
	path('test/', UpdateLatex),
	path('delete/', DeleteChalange),
	path('addtag/', AddTag),
	path('message2user/',Message2user),
	path('deleteMessage/', DeleteMessage),
	path('submitLogIn/', submitLogIn),
	path('submitSignUp/', submitSignUp),
	path('testNameUnique/', testNameUnique),
]
