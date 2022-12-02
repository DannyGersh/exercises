import json
import psycopg2
import os
import pathlib
import subprocess
import traceback

from django.contrib import admin
from django.urls import path
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.models import User
from django.contrib.sessions.backends.db import SessionStore

from . settings import DEBUG
from . constants import *
from . compileLatex import gen_svg


conn = psycopg2.connect("dbname=exercises user=postgres")
conn.set_session(autocommit=True)
cur = conn.cursor()
cur.execute('SELECT version()')
db_version = cur.fetchone()
# print(db_version)


def csrf_exempt_if_debug(func):
    if DEBUG: 
        return csrf_exempt(func)
    else:
        return func

def getStackTrace():
    stackTrace = traceback.format_list(traceback.extract_stack(limit=10))
    return ''.join(stackTrace) + traceback.format_exc()

def printError(msg):
    print("\n-------ERROR-------\n")
    print(getStackTrace(), ' -- message:', msg)
    print('\n-------END ERROR-------\n')

def sql_post_error(message, errorType, stackTrace=None):

    if DEBUG: printError(message) # force stackTrace

    message = message.replace("'", "''")
    errorType = errorType.replace("'","''")
    
    if not stackTrace:
        stackTrace = getStackTrace()
    
    stackTrace = stackTrace.replace("'", "''")

    cur.execute("insert into errors(error, type, stackTrace) values('%s', '%s', '%s')"%(message, errorType, stackTrace))            

def genError(message, errorType, stackTrace=None):
	printError(message)
	sql_post_error(message, errorType, stackTrace)

def genJsonError(message='an error hase occurred.'):
	return JsonResponse({ERROR: message}, status=500)	
	
	
def fetch_try_except(func):

    def wraper(*args, **kwargs):
        try:

            return func(*args, **kwargs)

        except Exception as exp:
            
            if DEBUG: printError(exp)
            sql_post_error(str(exp), str(type(exp)), getStackTrace()+traceback.format_exc())
            return JsonError

    return wraper

def sql_try_except(func):

    def wraper(*args, **kwargs):
        try:

            return func(*args, **kwargs)

        except Exception as exp:
            
            if DEBUG: printError(exp)
            sql_post_error(str(exp), str(type(exp)), getStackTrace()+traceback.format_exc())
            return ERROR

    return wraper

def safe_fetch(func):
    
    @csrf_exempt_if_debug
    @fetch_try_except
    def wraper(*args, **kwargs):
        return func(*args, **kwargs)

    return wraper


@sql_try_except
def getSQL(directive, args=None):

    res = []    
    sql = None
    command = directive[0]
    protocall = directive[1]

    if args:
        command = command.format(**args)

    cur.execute(command)
    sql = cur.fetchall()

    if sql:
        for i in sql:
            res.append({k:v for (k, v) in zip(protocall, i)})

    return res

@sql_try_except
def postSQL(command, args=None):
	
	if args:
		for i in args:
			args[i] = "'%s'"%str(args[i]).replace("'", "''")
		command = command.format(**args)
			
	cur.execute(command)


@fetch_try_except
def fetch_in(request, protocall):

	protocall = protocall['in']
	
	inData = json.loads(request.body.decode("utf-8"))
	
	for i in inData:

		if i not in protocall.keys():
			errStr = '"%s" key not in protocall keys: %s'%(i, list(protocall.keys()))
			genError(errStr, 'protocall error')			
			return ERROR
			
		if type(inData[i]) != protocall[i]:
			genError(
				'{%s: %s} the value of the key "%s" is of type %s but is expected to be of type %s'%(i, inData[i], i, type(inData[i]), protocall[i]),
				'protocall error'
			)
			return ERROR
		
	return inData
	
@fetch_try_except
def fetch_out(request, protocall, data):

    protocall = protocall['out']
    
    if len(protocall) != len(data):
        genError('len(protocall) != len(data)', 'type error')
        return JsonError

    for i in data:
        if type(data[i]) != protocall[i]:
            error = "expected %s, but got %s"%( protocall[i], type(data[i]) )
            genError(error, 'type error')
            return JsonError
    
    data['userId'] = request.user.id if request.user.id else 0
 
    return JsonResponse(data)




@safe_fetch
def fetch_test(request):
    
    inData = json.loads(request.body.decode("utf-8"))
    print("inData", inData)
    print("request.user.id", request.user.id)
    print("request.user", request.user)
    return JsonResponse({'test123':'test123'})

@safe_fetch
def fetch_submitErrorSql(request):
	
	inData = json.loads(request.body.decode("utf-8"))
	
	genError(inData['error'], inData['type'], inData['stackTrace']);
	
	return JsonResponse({'success':0})


@safe_fetch
def fetch_home(request):

	protocall = protocall_fetch_home
    
	hotest = getSQL(sql_get_hotest)
	latest = getSQL(sql_get_latest)
	if latest == ERROR: return JsonError
	if hotest == ERROR: return JsonError

	data = {
		'hotest': hotest, 
		'latest': latest,
	}

	return fetch_out(request, protocall, data)

@safe_fetch
def fetch_register_submit(request):

	protocall = protocall_fetch_register_submit
	inData = fetch_in(request, protocall)
	if inData == ERROR: return JsonError
	
	uname = inData['uname']
	password = inData['password']
	
	if isLogin:
		
		user = authenticate(username=uname, password=password)
		if user is not None:
			login(request, user)
			return fetch_out(request, protocall, {'userId': user.id})
		else:
			return genJsonError('could not log in ...')
			
	else:
		# check if username is unique
		if getSQL(sql_get_userId, {'userName': uname}):
			return genJsonError('username taken, try another one.')
			
		user = User.objects.create_user(
			uname, '', password
		)
		if not user:
			return genJsonError('could not create user ...')
		else:
			login(request, user)
			return fetch_out(request, protocall, {'userId': user.id})
   
@safe_fetch
def fetch_logout(request):
    logout(request)
    return JsonSuccess

@safe_fetch
def fetch_exercisePage(request):

	protocall = protocall_fetch_exercisePage
	inData = fetch_in(request, protocall)
	if inData == ERROR: return JsonError

	exerciseId = int(inData['exerciseId'])
	exercise = getSQL(sql_get_exercise, {'exerciseId':exerciseId})[0]
	
	if exercise:
		return fetch_out(request, protocall, exercise)
		
	else:
		genError('cant get exercise %s'%exerciseId, 'SQL')
		return JsonError

@safe_fetch
def fetch_profile(request):
	
	protocall = protocall_fetch_profile
	inData = fetch_in(request, protocall)
	if inData == ERROR: return JsonError
	
	args = {'userId': inData['userId']}
	
	rawUname = getSQL(sql_get_user_name, args)
	if rawUname == ERROR or not rawUname: 
		genError('cant find user name', 'SQL')
		return JsonError
		
	userName = rawUname[0]['userName']
	liked = getSQL(sql_get_profile_liked, args)
	authored = getSQL(sql_get_profile_authored, args)

	if liked == ERROR: return JsonError
	if authored == ERROR: return JsonError
	
	data = {
		'liked': liked,
		'authored': authored,
	}
	
	return fetch_out(request, protocall, data)



@safe_fetch
def fetch_addLatex(request):
    
	protocall = protocall_fetch_addLatex
	inData = fetch_in(request, protocall)
	if inData == ERROR: return JsonError

	if not inData['userId']:
		inData['userId'] = 0

	dir_target = DIR_USERS / str(inData['userId']) / inData['exercise'] / inData['target']
	dir_target.mkdir(parents=True, exist_ok=True)
	
	file_svg = dir_target / (str(inData['latexId'])+'.svg')        
	res = gen_svg(inData['latex'], inData['latexId'], dir_target, inData['packages'])
	
	if(res):
		return genJsonError('could not compile latex')
    
	return JsonSuccess

@safe_fetch
def fetch_deleteLatex(request):

	protocall = protocall_fetch_deleteLatex
	inData = fetch_in(request, protocall)
	if inData == ERROR: return JsonError
	
	if not inData['userId']: inData['userId'] = 0
	
	dir_target = DIR_USERS / str(inData['userId']) / inData['exercise'] / inData['target']
	file_svg = dir_target / (str(inData['latexId'])+'.svg')        
	
	try:
		subprocess.Popen(['rm', file_svg])
	except Exception as exp:
		# TODO - add to errors database
		return genJsonError('could not compile latex')
	
	return JsonSuccess

@safe_fetch
def fetch_submit_exercise(request):
	
	protocall = protocall_fetch_submit_exercise
	inData = fetch_in(request, protocall)
	if inData == ERROR: return JsonError
	
	# when user is undefined, then this is debug
	# in that case userid must be 0
	if not inData['userId']:
		inData['userId'] = 0

	# define relevant directories
	dir_user = DIR_USERS / str(inData['userId']) 
	dir_temp = dir_user / 'temp' 
	dir_temp.mkdir(parents=True, exist_ok=True)

	# delete all directories that are
	# not 'temp' or numeric
	for i in os.listdir(dir_user):
		if i != 'temp' and not os.path.basename(i).isnumeric():
			subprocess.run(['rm', '-r', dir_user / i,])

    # BEGIN validation

	temp_inData = inData.copy()

	'''
		filter input to
		only contain the
		target keys and their values
	'''
	for i in inData:
		if i not in latex_targets:
			temp_inData.pop(i)
    
	'''
		per each target,
		check if the latex directory
		has the exact same latex
		as in the inputs in the html
		'texput.log' is a latex compilation thing
		and is ignored
	'''
	for i in latex_targets:
		dir_target = dir_temp / i
		dir_target.mkdir(parents=True, exist_ok=True)
		
		ready = [i.split('.')[0] for i in os.listdir(dir_target) if i != 'texput.log']
		expected = list(temp_inData[i][1].keys())
		
		if expected != ready:
			for j in ready:
				if j not in expected:
					subprocess.run(['rm', dir_target/ (j+'.svg')])
					
			genError('js sais there should be different latex files in the server then there are', 'latex paths & files')

    # END validation

	'''
		create new unique 
		exercise directory
		it is unique per user
		
		all exercise dirs hase
		numeric names except 
		'temp' dir, so we 
		get the max dir name and
		the new exercise 
		is this number + 1
	'''
	new_exercise_dir = 0
	listDir = os.listdir(dir_user)
	if 'temp' in listDir:
		listDir.remove('temp')
	listDir = [int(os.path.basename(i)) for i in listDir]
    
	if listDir:
		new_exercise_dir = max(listDir) + 1

	dir_new_exercise = dir_user / str(new_exercise_dir)

	'''
		copy temp to its permenant 
		location with its new name
	'''
	subprocess.run(['cp', '-r', dir_temp, dir_new_exercise])

    # SQL
	sql_args = {
		'author' : inData['userId'],          
		'latex_dir' : new_exercise_dir,       
		'latex_pkg' : inData['latexp'],        
		
		'title' : inData['title'][0],          
		'exercise' : inData['exercise'][0],        
		'answer' : inData['answer'][0],          
		'hints' : inData['hints'][0],            
		'explain' : inData['explain'][0],          
		
		'latex_title' : (json.dumps(inData['title'][1])),     
		'latex_exercise' : (json.dumps(inData['exercise'][1])),  
		'latex_answer' : (json.dumps(inData['answer'][1])),    
		'latex_hints' : (json.dumps(inData['hints'][1])),     
		'latex_explain' : (json.dumps(inData['explain'][1])),   
	}
	res = postSQL(sql_post_exercise, sql_args)
	if res == ERROR: return JsonError

	return JsonSuccess

@safe_fetch
def fetch_addTag(request):

    inData = json.loads(request.body.decode("utf-8"))
    
    return JsonResponse({'success': True})

@safe_fetch
def fetch_sendMsg(request):
	
	inData = json.loads(request.body.decode("utf-8"))

	command = sql_post_sendMSG
	args = {
		'exerciseId': inData['exerciseId'],
		'sender':     inData['sender'],
		'receiver':   inData['receiver'],
		'message':    inData['message'],
	}
	postSQL(command, args) 
	
	return JsonResponse({'success': True})
	
@safe_fetch
def fetch_like(request):

	inData = json.loads(request.body.decode("utf-8"))
	
	command = sql_post_like
	args = {
		'exerciseId': inData['exerciseId'],
		'userId': inData['userId'],	
	}
	postSQL(command, args) 
	
	return JsonResponse({'success': True})
	
	
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
    path('fetch/submitErrorSql/', fetch_submitErrorSql),
    
    path('fetch/home/', fetch_home),
    path('fetch/exercisePage/', fetch_exercisePage),
    path('fetch/profile/', fetch_profile),

    path('fetch/logout/', fetch_logout),
    path('fetch/register_submit/', fetch_register_submit),
    path('fetch/submitExercise/', fetch_submit_exercise),
    path('fetch/sendMsg/', fetch_sendMsg),
    path('fetch/like/', fetch_like),

    path('fetch/addLatex/', fetch_addLatex),
    path('fetch/deleteLatex/', fetch_deleteLatex),

    path('fetch/addTag/', fetch_addTag),
]
