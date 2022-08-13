# this script transforms a dev/page to a production version
# usege:
# copy this file inside a page in dev
# for example into /dev/new
# and execute with no args

import re
from os import rename, system, getcwd, path, chdir
from shutil import copytree, move, copytree

page = path.basename(getcwd())

if path.exists('build/%s/'%page):
	system('rmdir /s /q ' + path.join('build',page))		

copytree('build','build/%s'%page)

try:
	rename('build/%s/index.html'%page, 'build/%s/%s.html'%(page,page))
except:
	pass
	
data = ''
with open('build/%s/%s.html'%(page,page), 'r') as f:
	data = f.read()
with open('build/%s/%s.html'%(page,page), 'w', newline='') as f:
	res = data.replace('/static/js/','/static/pages/%s/static/js/'%page)
	res = res.replace('/static/css/','/static/pages/%s/static/css/'%page)
	data = f.write(res)


