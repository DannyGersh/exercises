```console
git clone https://github.com/DannyGersh/django-react-nginx-docker
```
```console
cd django-react-nginx-docker
```
```console
cd frontend && npm install && npm run build && cd ../
```
```console
cd server && docker build -t drnd . && cd ../
```
```console
docker run -v $PWD:/volume -p 80:80 --name drnd -it drnd /bin/bash
```
```console
cd /volume/server && ./bootstrap && cd ../
```
press ctrl+D
```console
docker exec -it drnd /bin/bash
```
```console
lsof -i :8000
```
from docker - restart pid
```console
kill -HUP <pid>
```
