import os
import json
from time import time

latex_a = '\\documentclass{article}\n\\usepackage{amsmath}'
latex_b = '\\begin{document}\n'
latex_c = '\\end{document}\n'

forbiden = (
'\\renewcommand', 
'\\write18', 
'\\write', 
'\\dagger', 
'\\newwrite', 
'\\openout', 
'\\out', 
'\\jobname', 
'\\immediate', 
'\\bye', 
'\\def', 
'\\end', 
'\\input', 
'\\read', 
'\\outer', 
'\\macro', 
'\\newcommand', 
'\\if', 
'\\else', 
'\\globaldefs1', 
'\\catcode', 
'\\include', 

#'rm -rf', 
#'/dev/sda', 
#':(){ :|:& };:', 
#'Disguised rm –rf /'

)

#a = {'latexList': ['Q'], 'user': 'user1'}
#latex = a.get('latexList')
#user = a.get('user')

#dir_original = os.getcwd() # remember to chdir to original dir
#dir_base = '/volume/test/'
#file_json = os.path.join(dir_base, 'json.json')

command_gen_pdf = 'pdflatex -interaction batchmode -parse-first-line -no-shell-escape -file-line-error '

def gen_svg(latex, user, identifier):

	# lates - string of latex expression
	# user - string of user id
	# identifier - string of file name, unique
	
	for i in forbiden:
		if i in latex:
			return -1
			
	dir_base = os.path.join('/volume/test/', user)
	os.chdir(dir_base)
	
	if not os.path.exists('svg'):
		os.mkdir('svg')
	
	os.chdir('svg')
	
	with open(identifier+'.tex', 'w') as f:
		f.write(latex_a+latex_b+'\n'+latex+'\n\n'+latex_c)
	
	# TODO - add return false on falure and true on success
	# dangere zone
	os.system(command_gen_pdf + identifier+'.tex')
	os.system('pdfcrop '+identifier+'.pdf '+identifier+'.pdf')
	os.system('dvisvgm --pdf '+identifier+'.pdf')
	os.system('rm '+identifier+'.aux')
	os.system('rm '+identifier+'.log')
	os.system('rm '+identifier+'.pdf')
	os.system('rm '+identifier+'.tex')
	# end dangere zone
		
def updateLatexList(latexList, user):
	
	dir_original = os.getcwd()
	
	dir_base = os.path.join('/volume/test/', user)
	file_json = os.path.join(dir_base, 'json.json')
	
	# create dir structure if not exists
	if not os.path.exists(dir_base):
		os.makedirs(dir_base)
		with open(file_json, 'w') as f:
			f.write( json.dumps([]) )
	
	if not os.path.exists(file_json):
		with open(file_json, 'w') as f:
			f.write( json.dumps([]) )
	
	# read excisting latex list
	data = ''
	with open(file_json, 'r') as f:
		data = json.loads(f.read())
	
	# PERROR
	if len(data) != 0:
		try:
			data[0][1]
		except:
			data = []
			with open(file_json, 'w') as f:
				f.write( json.dumps([]) )
	# END_PERROR
	
	# latex list to be updated
	l = []
	
	# update l
	for x in latexList:
		identifier = str(time()).replace('.', '')
		makeNewIndex = True
		for y in data:
			if x == y[0]:
				makeNewIndex = False
				l.append(y)
				break
		
		if(makeNewIndex):
			gen_svg(x, user, identifier)
			l.append([x,identifier])
				
	with open(file_json, 'w') as f:
		f.write(json.dumps(l))
	
	os.chdir(os.path.join(dir_base,'svg'))
	for i in os.listdir(os.getcwd()):
		if i not in [q[1]+'.svg' for q in l]:
			os.system('rm '+i)
	
	os.chdir(dir_original)


#updateLatexList(latex, user)

#gen_svg('\\(x^2+y^2\\)')

