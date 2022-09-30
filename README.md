# codebase for [www.ididthisforu.com](https://www.ididthisforu.com)

this website is meant for people to upload and solved exercises in math, physics, chemistry or any field of study really.

## currently supported functionality:

- login / sign up.
- profile:
  - view liked and authored exercises.
  - view messages from other users.
  - edit, delete own exercises.
  - delete own messages.
- exercises:
  - create, preview and display mode.
  - navigation tabs: main body, solution, hints and explanation.
  - additional menu: author name, date of creation, message author, report.
- latex:
  - all latex in the" texlive-latex-extra" installation is supported.
  - usage of packages.
  - latex, normal text combination.
  - content wrapping - the same exercise looks good on all monitor sizes, even with latex.
- browse by - latest, hottest.
- search bar - matching text for all elements of an exercises.
- tags:
  - clickable tags. click to view exercise with the same tag.
  - creation of new tags.

## technical overvie:

the following graph represents the general project structure:

![main.svg](https://github.com/DannyGersh/exercises/blob/main/misc/main.svg)

### backend

the website lives in a docker container (see the [docker file](https://github.com/DannyGersh/exercises/blob/main/production/Dockerfile)), from which it serves it's contents to the web. this container shares a volume directory with the host os(ubuntu server) in which everything is stored, including the django, nginx, react files and directories. the only thing the volume directory does not contain is the database, it onley contains daily bacups of it.

for django development, there are no apps. all views are inside the main urls.py file.
requests are handled the following way: nginx -> gunicorn -> django.

the exercises are made up of simple text and svg images that are compiled from latex on the server. everything (that is exercise related) is stored in PostgreSql except the images which are stored in the volume dir.

in the event of container failure, there is the daily db backup and the images(svg) are in the volume on disk, so restoring to the previous working distribution is easy.

for authentication, the project uses the standard auth model provided by django, except that there are 3 aditional columns added to the auth_user table (the sql table django provides): authored, liked and answered.

see [this folder](https://github.com/DannyGersh/exercises/tree/main/production/volume/temp) that contains the instructions for the creation of the database. in it you'll find the instructions and the structure of the 3 tables used in this project: chalanges, tags and the altered auth_user table. the bootstrap script automatically sets everything up.

the server is responsible for the creation of latex images (svg) from raw latex text that is fetched from the client side js. when a user is editing an exercise, there is a fetch request being sent to the server containing only the necessary latex to compile, this happens every time the front end js detects there is latex in need of compilation. when the user clicks submit, all the pre generated and ready images are moved from the temporary directory they are edited in, into their permanent location on disk, and all the textual information is saved in the database. the system is also responsible for kiping track of the images and removing what isn't used.

the latex compilation process is as follows:
raw text -> pdf -> svg -> cropped svg. 
this ensures the user while have access to all latex capabilities and the most accurate results.
although it is a slightly slow process, it is handled in a new proccess on the server in the background so when the user clicks submit, everything is ready. there are banned latex keywords and a time limit for compilation as a security measure, for avoiding un proper latex. also there are strict permissions on the server file system, and the docker container only have access to the shared volume dir, so if there is a problem, it is easy to restore the system.

every page of the website is a separate react application. when requested a page, the server sends the index.html of the compiled react app. this file contains all of the static contents of the page. each "index.html" file is named after the page it represent. the dynamic content is passed in json format via the django api (not directly, as a mesure of defence from Cross-Site Scripting).

### frontend - react
every page (except the "contact" page) is a completely separate react project created via react-create-app. see [this folder](https://github.com/DannyGersh/exercises/tree/main/production/volume/static/pages) for the pages in production of the project (except "contact" page which lives [here](https://github.com/DannyGersh/exercises/tree/main/production/volume/static)). every one of them is developed separately in the [dev](https://github.com/DannyGersh/exercises/tree/main/dev) folder using the good old "npm start" methode. they all share the same packages so you dont need to "npm install" multiple tymes. when development is finished there are automated scripts to put them in production, that is changing directories and slightly manipulating their content.  

all that is shared between the pages lives in the [shared](https://github.com/DannyGersh/exercises/tree/main/dev/shared) directory. it is not a react app, rather a folder that is copied to all the react apps via an automated script in [this directory for linux](https://github.com/DannyGersh/exercises/tree/main/linux_automate) via the "shared.sh" script or the "automateShared.bat" script (windows) in th root directory of the project.

in the "new" page (for editing exercises), the js is responsible for scanning the text input of the user for latex changes. when detected, a fetch request is sent to the server for further processing.

when an exercise is requested, the js inserts the svg images as image tags in their proper locations inside the textual data of the exercise which is displayed as paragraphs. the result is a paragraph containing images of compiled latex.

## get started on localhost
```console
git clone https://github.com/DannyGersh/exercises.git
```
building and runing the docker image:
```console
cd exercises/production && \
docker build -t ididthisforu . && \
docker run -v $PWD/volume:/volume -p 80:80 --name ididthisforu -it ididthisforu /bin/bash
```
from inside docker:
```console
echo "DJANGO_SECRET_KEY = 'fake sekret key'" > /volume/django_project/django_project/django_secret_key.py && \
cd /volume/temp && \
./bootstrap
```
make sure that postgresql and nginx services are running:
```console
service postgresql status
```
```console
service nginx status
```
make sure that gunicorn is running:
```console
lsof -i :8000
```

now the docker container is up and running, you can check if everything is working by typing localhost at the address bar.

for development of the server side, the django "runserver" method isn't used. instead, the project is run as if it was on the server by restarting gunicorn after changes. here is an example of compiling all the react apps and seting the server to its most current state (on linux, for windows, use the corresponding batch scripts).

$\color{red}{IMPORTANT}$: make sure "window.isdebug" is set to "true" when developing. this variable is set in [here](https://github.com/DannyGersh/exercises/blob/main/dev/shared/Functions.js).

install [react pacages](https://github.com/DannyGersh/exercises/blob/main/README.md#react-development), then from root dir(not in docker container), type:
```console
cd linux_automate && \
. shared.sh # place the shared dir inside all of the react apps && \
. buildAll.sh && \
. buildSwap.sh # swapping the old builds with the new ones && \
. production.sh # slightly adjust files for production
 ```
 on a new clone of the repo, run the previous command twice.
 
to restart the server, from the docker container, search for the process id running on port 8000:
```console
lsof -i :8000
```
and restart any one of the results via:
```console
kill -HUP <pid>
```
if for some reason gunicorn is not running, type:
```console
. /volume/venv/bin/activate # make sure virtualenv activated && \
cd /volume/conf && \
gunicorn -c gunicorn_config.py django_project.wsgi &
```

### react development:
$\color{red}{IMPORTANT}$: make sure "window.isdebug" is set to "true" when developing. this variable is set in [here](https://github.com/DannyGersh/exercises/blob/main/dev/shared/Functions.js).

from root directory of the project (not inside the Docker container) type:
```console
cd dev && \
npm install
```
now you are ready to develop the react projects, using "npm start" separately from each page directory.

