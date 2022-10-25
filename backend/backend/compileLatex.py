import os
import subprocess

latex_a = '\\documentclass{article}\n'
latex_b = '\\begin{document}\n\\begin{LARGE}\n'
latex_c = '\\thispagestyle{empty}\n'
latex_d = '\\end{LARGE}\n\\end{document}\n'

targets = [
	'title',
	'exercise',
	'answer',
	'hints',
	'explain'
]

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
#	'\\end', 
)

command_gen_pdf = 'pdflatex -interaction batchmode -parse-first-line -no-shell-escape -file-line-error '

def gen_svg(latex, latexid, dir_svg, pacages):

	# PERROR - validate input
	# TODO - add to error database
	for i in forbiden:
		if i in latex:
			return -1

	dir_original = os.getcwd()
	os.chdir(dir_svg)

	file_name = str(latexid)

	with open(file_name + '.tex', 'w') as f:
		# print(latex_a + pacages + latex_b+latex_c+'\n'+latex+'\n\n'+latex_d)
		f.write(latex_a + pacages + latex_b+latex_c+'\n'+latex+'\n\n'+latex_d)

	res = 0
	try:
		subprocess.Popen([
			'/volume/backend/backend/compileLatex.sh', 
			dir_svg,
			file_name,
		])
	except Exception as exp:
		# TODO - add to errors database
		print(exp)

	os.chdir(dir_original)
	
	return res

