
from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
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

# chalanges database columns
SQLDataKeys = [
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

def AddTag(request):

	body = json.loads(request.body.decode("utf-8"))
	
	cur.execute('''
		insert into tags(name) values('%s')
		'''%( str(body) )
	)
	conn.commit()
	
	return HttpResponse(200)

def Delete(request):

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

	return HttpResponse('Delete')

@ensure_csrf_cookie		
def UpdateLatex(request):

	latexList =	json.loads(request.body.decode("utf-8"))
	latexList = updateLatexList(latexList[1], str(request.user.id), latexList[0])
	
	return HttpResponse('UpdateLatex')

def getChalange(id):
	
	cur.execute('''
	select 
		a.id, a.exercise, a.answer, a.hints, 
		
		a.author, 
		
		to_char(a.creationdate, 'MM/DD/YYYY - HH24:MI'), a.title, a.rating, 
		
		array(select name from tags where id in (select * from unnest(a.tags)) ), 
		
		a.explain, a.latex, b.username
		
		from chalanges as a
		inner join auth_user as b
		on a.author = b.id
		
		where a.id=''' + str(id)
	)
	inData = cur.fetchone()	
	
	if inData:
		# TODO - authid should be set in the chalanges table, for avoiding this second sql call.
		# cur.execute("select id from auth_user where username='%s'"%(inData[4]))
		# authid = cur.fetchone()[0]
		
		outData = { k:v for (k,v) in zip(SQLDataKeys, inData) }
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
	
	outData['chalange'] = getChalange(id)
	
	if outData['chalange']:
		return render(request, 'chalange.html', context={'value': outData})
	else:
		return HttpResponse("could not find this exercise")
		
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

	cur.execute('select authored, liked, username from auth_user where id='+str(userid))
	inData = cur.fetchone()
	
	# PERROR: check if exists
	frame = getframeinfo(currentframe())
	
	if not inData:
		print('ERROR: inData is undefined\nin: ', frame.filename, frame.lineno)
		inData = [[], [], request.user.username]
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
			
		user = User.objects.create_user(
			uname, '', password
		)
		if not user:
			return redirect(currentPage)
		else:
			login(request, user)
			request.session['isAuth'] = True
			request.session['signInFailure'] = False
			
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
def New(request, isSourceNav=False):
	
	if request.user.is_authenticated:
		
		outData = {} # data for js. will be converted to secure json.
		outData['isAuth'] = request.user.is_authenticated
		outData['userid'] = request.user.id

		cur.execute('select name from tags')
		outData['tags'] = [i[0] for i in cur.fetchall()] 
		
		outData['chalange'] = {}
		outData['chalange']['id'] = 'dummy_id' # id required for new chalange
		
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
			
			# get latex from .json to file in $$___latex$$ slots
			dir_user = os.path.join(dir_users, str(outData['chalange']['author']))
			dir_exercise = os.path.join(dir_user, outData['chalange']['latex'])
			file_json = os.path.join(dir_exercise, '.json')
			
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

					a = re.findall('\$\$___latex\$\$', outData['chalange'].get(target,''))
					b = [i[0] for i in dataFromFile.get(target,'')]
					
					return len(a) == len(b)
				
				for i in targets:
					if not validate(i):
						print('Exercise Corupted for some reasone ... target: %s\n'%i, outData['chalange'])
						return HttpResponse('Exercise Corupted for some reasone ...')

				# END_PERROR

			else:
				outData['EditInProgress'] = True
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
		request.session['signInFailure'] = True
		request.session['isNew'] = True
		return redirect(request.session.get('currentUrl'))

def NewSubmited(request):

	outData = {} # data for js. will be converted to secure json.
	
	if request.method == "POST":

		oldLatex = request.POST.get('oldLatex', '')
		
		# TODO - get rid of these nonsense
		tags = request.POST.get('tags', '')
		if tags == []: tags = ''
		if tags == '[]': tags = ''
		tags = tags.replace('[', '')
		tags = tags.replace(']', '')
		
		# TODO - fix weird 'true'
		if(request.POST.get('issubmit')=='true'):

			request.session['EditInProgress'] = 'none'
			
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
			
			title 	 = re.sub(reg_latex_search, reg_latex, title)
			exercise = re.sub(reg_latex_search, reg_latex, exercise)
			answer 	 = re.sub(reg_latex_search, reg_latex, answer)
			hints 	 = re.sub(reg_latex_search, reg_latex, hints)
			explain	 = re.sub(reg_latex_search, reg_latex, explain)
			
			# insert into chalanges database
			# tags must be converted to teir corresponding id's
			
			# handle white space
			tempTags = tags.split(',')
			tempTags = ['%s%s%s'%("'",i,"'") for i in tempTags]
			tempTags = ','.join(tempTags)
			
			# TODO - fix weird 'false' thing
			if request.POST.get('isEdit', '') == 'false':
				cur.execute('''
					insert into chalanges
					(exercise, answer, hints, author, title, tags, explain, rating, latex)
					values('%s', '%s', '%s', '%s', '%s', 
					array(select id from tags where name in (select * from unnest(array[%s]))),
					'%s', '%s', '%s')
				'''%(exercise, answer, hints, request.user.id, title, tempTags, explain, '{}', now)
				)
				cur.execute('''
					update auth_user 
						set authored[cardinality(authored)] = (select id from chalanges where latex='%s')::integer 
						where id = '%s'
				'''%(now, request.user.id) )
				conn.commit()
				
			else:
				exerciseId = request.POST.get('exerciseId', '')
				if(exerciseId == ''):
					return HttpResponse('Failed submiting exercise')
				
				# convert tag names to their id's
				tempTags = tags.split(',')
				# handle white space
				tempTags = ['%s%s%s'%("'",i,"'") for i in tempTags]
				tempTags = ','.join(tempTags)
				cur.execute('''
						select * from tags where name in (%s)
				'''%tempTags)
				tempInData = cur.fetchall()	
				tempInData = [str(i[0]) for i in tempInData]
				tagIds = ','.join(tempInData)
				
				cur.execute('''
					update chalanges set 
						exercise='%s', answer='%s',
						hints='%s', title='%s', 
						tags='{%s}', explain='%s', latex='%s'
					where id='%s'
				'''%(exercise, answer, hints, title, tagIds, explain, now, exerciseId)
				)
				conn.commit()
			
				dir_oldLatex = os.path.join(dir_current_user, oldLatex)
				os.system('rm -r %s'%dir_oldLatex)	
				
			os.chdir(dir_original)
			
			return redirect("../../../../user/" + str(request.user.id))
		
		else:			
			cur.execute('''select to_char(now(), 'MM/DD/YYYY - HH24:MI')''')
			timestamp = cur.fetchone()			
			
			tags = tags.split(',')
			
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
			outData['chalange'] = { k:v for (k,v) in zip(SQLDataKeys, inData) }

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
	
	path('test/', UpdateLatex),
	path('delete/', Delete),
	path('addtag/', AddTag),
]
