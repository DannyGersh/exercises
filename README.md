```console
git clone https://github.com/DannyGersh/exercises.git && cd exercises
```
build docker image and create container:
```console
docker built -t server/img_ididthisforu
```
the following command creates a container of the image that shares the root dir and ports 80, 8000, 3000. the entire project is contained within "/volume" dir (inside docker).
make sure you are at the root directorie and type:
```console
docker run -v $PWD:/volume -p 80:80 -p 8000:8000 -p 3000:3000 --name ididthisforu -it img_ididthisforu /bin/bash
```
from inside docker:
```console
cd /volume/server && ./bootstrap
```

I prefer to install npm on the docker container so that everithing is developed within one framework, you can use an existing npm installation outside docker. npm is not installed by default. 

the root react folder is named frontend, the root of django is backend.

start development (docker):
```console
cd /volume/frontend && npm start &
```
```console
cd /volume/backend && python3 manage.py runserver &
```

