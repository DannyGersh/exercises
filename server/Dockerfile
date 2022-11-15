from ubuntu:latest
EXPOSE 80

run apt update && DEBIAN_FRONTEND=noninteractive apt install -y \ 
postgresql \ 
postgresql-contrib \ 
lsof python3 \ 
python3-dev \ 
nginx nano \ 
libpq-dev \ 
npm \
texlive-latex-base \
texlive-extra-utils \
python3-pip && \

pip3 install psycopg2 django gunicorn django-cors-headers

cmd ["/bin/bash"]