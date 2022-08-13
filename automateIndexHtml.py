# this script transforms a dev/page to a production version
# usege:
# copy this file inside a page in dev
# for example into /dev/new
# and execute with no args

import re
from os import rename, system, getcwd, path
from shutil import copytree

page = path.basename(getcwd())
	
if path.exists(page):	
	system('rmdir /s /q %s'%page)

copytree('build', page)
	
rename('%s/index.html'%page, '%s/%s.html'%(page,page))

data = ''
with open('%s/%s.html'%(page,page), 'r') as f:
	data = f.read()
with open('%s/%s.html'%(page,page), 'w', newline='') as f:
	res = data.replace('/static/js/','/static/pages/%s/static/js/'%page)
	res = data.replace('/static/css/','/static/pages/%s/static/css/'%page)
	data = f.write(res)
		
