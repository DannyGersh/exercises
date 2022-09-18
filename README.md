# codebase for [www.ididthisforu.com](https://www.ididthisforu.com)

this website is meant for people to upload and solved exercises in math, physics, chemistry or any field of study really.

## currently supported functionality:

* log in & sign up
* create\edit\delete exercises on your profile
* view & like exercises others have created
* latex supported - everything that comes with the "texlive-latex-extra" installation
* usage of latex packages

## technical overvie:

the following graph represents the general project structure:

![main.svg](https://github.com/DannyGersh/exercises/blob/main/misc/main.svg)

### backend

the website lives in a docker container (see the [docker file](https://github.com/DannyGersh/exercises/blob/main/production/Dockerfile)), from which it serves it's contents to the web. this container shares a volume directory with the host os(ubuntu server) in which everything is stored, including the django, nginx, react files and directories. the only thing the volume directory does not contain is the database, it onley contains daily bacups of it. this makes development easy, and prevents loss of data. also because the container has only permission to access the volume, than the host os remains clean and secure.

requests are handled the following way: nginx -> gunicorn -> django.

the exercises are made up of simple text and svg images that are compiled from latex on the server. everything (that is exercise related) is stored in PostgreSql except the images which are stored in the volume dir.

in the event of container failure, there is the daily db backup and the images(svg) are in the volume on disk, so restoring to the previous working distribution is easy.

for authentication, the project uses the standard auth model provided by django, except that there are 3 aditional columns added to the auth_user table (the sql table django provides): authored, liked and answered.

see [this folder](https://github.com/DannyGersh/exercises/tree/main/production/volume/temp) that contains the instructions for the creation of the database. in it you'll find the instructions and the structure of the 3 tables used in this project: chalanges, tags and the altered auth_user table. the bootstrap script automatically sets everything up.

the server is responsible for the creation of latex images (svg). when a user is editing an exercise, there is a fetch request being sent to the server containing only the necessary latex to compile, this happens every time the front end js detects there is latex in need of compilation. when the user clicks submit, all the pre generated and ready images are moved from the temporary directory they are edited in, into their permanent location on disk, and all the textual information is saved in the database. the system is also responsible for kiping track of the images and removing what isn't used.

every page of the website is a separate react application. when requested a page, the server sends the index.html of the compiled react app. this file contains all of the contents of the page. each "index.html" file is named after the page it represent.

when requested a page, the server sends dynamic content in json format in a secure manner, as stated in the django documentation.

### frontend - react
every page (except the "contact" page) is a completely separate react project created via react-create-app. see [this folder](https://github.com/DannyGersh/exercises/tree/main/production/volume/static/pages) for the pages in production of the project (except "contact" page which lives [here](https://github.com/DannyGersh/exercises/tree/main/production/volume/static)). every one of them is developed separately in the [dev](https://github.com/DannyGersh/exercises/tree/main/dev) folder using the good old "npm start" methode. they all share the same packages so you dont need to "npm install" multiple tymes. when development is finished there are automated scripts to put them in production, that is changing directories and slightly manipulating their content.  

all that is shared between the pages lives in the "shared" directory inside the pages folder. it is not a react app, rather a folder that is copied to all the react apps via an automated script in [this directory for linux](https://github.com/DannyGersh/exercises/tree/main/linux_automate) via the shared.sh script or the automateShared.bat script (windows) in th root directory of the project.

in the "new" page (for editing exercises), the js is responsible for scanning the text input of the user for latex changes. when detected, a fetch request is sent to the server for further processing.

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
docker build -t ididthisforu .
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

