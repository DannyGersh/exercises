# codebase for [www.ididthisforu.com](www.ididthisforu.com)

this website is meant for people to upload and solved exercises in math, physics, chemistry or any field of study really.

## currently supported functionality:

* log in & sign up
* create\edit\delete exercises on your profile
* view & like exercises others have created
* latex supported - everything that comes with the "texlive-latex-extra" installation
* usage of latex packages

## technical overvie:

the website lives in a docker container (see the [docker file](https://github.com/DannyGersh/exercises/blob/main/production/Dockerfile)), from which it serves it's contents to the web. this container shares a volume directory with the host os(ubuntu server).

![main.svg](https://github.com/DannyGersh/exercises/blob/main/misc/main.svg)

### backend
the exercises are made up of simple text and svg images that are compiled from latex on the server. everything is stored in PostgreSql except the images which are stored on disk.

the database is backed up daily, the images are stored on the shared folder (volume) so they while not disappear if something happens to the docker container

for authentication, the project uses the standard auth model provided by django, except that there are 3 aditional columns added to the auth_user table (the sql table django provides): authored, liked and answered.

see [this folder](https://github.com/DannyGersh/exercises/tree/main/production/volume/temp) that contains the instructions for the creation of the database. in it you'll find the instructions and the structure of the 3 tables used in this project: chalanges, tags and the altered auth_user table. the bootstrap script automatically sets everything up.

the server is responsible for the creation of latex images (svg). when a user is editing an exercise, there is a fetch request being sent to the server containing only the necessary latex to compile, this happens every time the front end js detects there is latex in need of compilation. when the user clicks submit, all the pre generated and ready images are moved from the temporary directory they are edited in, into their permanent location on disk.

### frontend - react
every page (except "contact" page) is a completely separate react project created via react-create-app. see [this folder](https://github.com/DannyGersh/exercises/tree/main/production/volume/static/pages) for the pages of the project. every one of them is developed separately using the good old "npm start" methode. they all share the same packages so you dont need to "npm install" multiple tymes.


## get started on localhost
firstly, participating in the ididthisforu project requires you to be accepted as an official developer. for further information send an email to ididthisforu.contact@gmail.com with the title "participate".

### for project members:
```console
git clone https://github.com/DannyGersh/exercises.git
```
building and runing the docker image:
```console
cd production
```
```console
docker build -t ididthisforu 
```
```console
docker run -v $PWD/volume:/volume -p 80:80 --name ididthisforu -it ididthisforu /bin/bash
```
```console
cd /volume/temp
```
```console
./bootstrap
```
now the docker container is up and running, you can check if everything is working by typing localhost at the address bar.

### installing npm pacages:
from root directory of the project (inside the Docker container) type:
```console
cd /volume/dev
```
```console
npm install
```
now you are ready to develop the react projects, with the good old npm start, at any one of the /volume/dev/ directorie

