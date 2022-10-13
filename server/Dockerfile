from ubuntu:latest
EXPOSE 80

run apt update && DEBIAN_FRONTEND=noninteractive apt install -y \ 
postgresql \ 
postgresql-contrib \ 
lsof python3 \ 
python3-dev \ 
nginx nano \ 
libpq-dev \ 
python3-pip && \

pip3 install django gunicorn django-cors-headers

cmd ["/bin/bash"]