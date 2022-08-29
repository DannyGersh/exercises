# execute from linux_automate

import os

path = os.path.join('production','volume','static','pages')
os.chdir('../')
os.chdir(path)

for i in os.listdir():

	with open('%s/%s.html'%(i,i), 'r') as f:
		data = f.read()
	with open('%s/%s.html'%(i,i), 'w', newline='') as f:
		res = data.replace('/static/js/','/static/pages/%s/static/js/'%i)
		res = res.replace('/static/css/','/static/pages/%s/static/css/'%i)
		data = f.write(res)
