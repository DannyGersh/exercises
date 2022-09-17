# codebase for [www.ididthisforu.com](www.ididthisforu.com)

this website is meant for people to upload and solved exercises in math, physics, chemistry or any field of study really.

## currently supported functionality:

* log in & sign up
* create\edit\delete exercises on your profile
* view & like exercises others have created
* latex supported - everything that comes with the "texlive-latex-extra" installation
* usage of latex packages

## get started on localhost

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

## technical description:

the website lives in a docker container (see the [docker file](https://github.com/DannyGersh/exercises/blob/main/production/Dockerfile)), from which it serves it's contents to the web. this container shares a volume directory with the host os(ubuntu server).

![main.svg](https://github.com/DannyGersh/exercises/blob/main/misc/main.svg)
