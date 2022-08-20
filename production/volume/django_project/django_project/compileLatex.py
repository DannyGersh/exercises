import os
import json
from time import time
targets = [
	'title',
	'exercise',
	'answer',
	'hints',
	'explain'
]

latex_a = '\\documentclass{article}\n\\usepackage{amsmath}'
latex_b = '\\begin{document}\n\\begin{LARGE}'
latex_c = '\\thispagestyle{empty}\n'
latex_d = '\\end{LARGE}\n\\end{document}\n'

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
#	'\\end', 
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

command_gen_pdf = 'pdflatex -interaction batchmode -parse-first-line -no-shell-escape -file-line-error '
dir_static = r'/volume/static/users/'

def gen_svg(latex, user, identifier):

	# lates - string of latex expression
	# user - string of user id
	# identifier - string of file name, unique
	
	dir_original = os.getcwd()
	os.chdir( os.path.join(dir_static, str(user)) )
	
	# PERROR - validate input
	# TODO - add to error database
	for i in forbiden:
		if i in latex:
			return -1
			
	dir_base = os.path.join(dir_static, user)
	os.chdir(dir_base)
	
	if not os.path.exists('svg'):
		os.mkdir('svg')
	
	os.chdir('svg')
	
	with open(identifier+'.tex', 'w') as f:
		f.write(latex_a+latex_b+latex_c+'\n'+latex+'\n\n'+latex_d)
	
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
	
	os.chdir(dir_original)
	
def updateLatexList(latexList, user, target):
	
	dir_original = os.getcwd()
	
	dir_base = os.path.join(dir_static, user)
	dir_svg = os.path.join(dir_base, 'svg')
	file_json = os.path.join(dir_base, '.json')
		
	# create dir structure if not exists
	if not os.path.exists(dir_base):
		os.makedirs(dir_base)
		with open(file_json, 'w') as f:
			f.write( json.dumps(
				{i:[] for i in targets}
			))
	
	# create json file if not exists
	if not os.path.exists(file_json):
		with open(file_json, 'w') as f:
			f.write( json.dumps({i:[] for i in targets}) )
		
	# read excisting latex list
	with open(file_json, 'r') as f:
		data_file = json.loads(f.read())
		data_target = data_file[target]
	
	# PERROR - test if json information is proper, else default to empty list
	# TODO - add database of errors and add this error if acures
	if len(data_target) != 0:
		try:
			data_target[0][1]
		except:
			data_target = []
			with open(file_json, 'w') as f:
				f.write( json.dumps({i:[] for i in targets}) )
	# END_PERROR
	
	# latex list to be updated
	l = []
	
	# update l and generate svgs
	for x in latexList:
		identifier = str(time()).replace('.', '')
		makeNewIndex = True
		for y in data_target:
			if x == y[0]:
				makeNewIndex = False
				l.append(y)
				break
		
		if(makeNewIndex):
			gen_svg(x, user, identifier)
			l.append([x,identifier])
				
	with open(file_json, 'w') as f:
		data_file[target] = l
		f.write(json.dumps(data_file))
	
	# get all nesessery files by name(no extension)
	temp= []
	with open(file_json, 'r') as f:
		data = json.loads(f.read())
		for x in data.values():
			for y in x:
				temp.append(y[1]+'.svg')

	# remove all files that are not in main .json
	os.chdir(dir_svg)
	for i in os.listdir():
		if i not in temp:
			os.system('rm '+i)
				
	os.chdir(dir_original)

	return l

#updateLatexList(latex, user)

#gen_svg('\\(x^2+y^2\\)')

