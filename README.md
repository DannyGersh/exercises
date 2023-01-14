# Welcome to the www.ididthisforu.com project.

This is a website that contains exercises for students of all fields of study. the goal is to give all students the tools to easily create professional exercises for the world to solve.

An exercise could be any thing from solving a linear set of equations to solving complex differential equations to chemical formulas and compounds memorization exercises. every exercise must contain a title and an answer, but can also contain hints, an exercise body (might be the title) and an explanation. 

the site fully supports latex (with small exceptions for security reasons), hence any field of study of any level can be expressed in any way. 

* frontend - React
* backend - Django
* server - Nginx
* database - PostgreSQL

## latex 

the real challenge was the implementation of latex. basically when the user types for example "$$latex$$", then "latex" is compiled by the standard latex-live compiler to pdf, then the pdf is cropped and converted to an svg image. this approach ensures the most professional and standardized result as the latex compiler is the de-facto standard for technical and scientific literature.

when the user creates an exercise, the user input text is parsed, converting the latex expressions to their corresponding id's so for example:

-- this is a "$$latex$$" example --

would be converted to:

-- this is a "$$0$$" example -- 

(without the quotation mark) and 0.svg while be stored in the server's file system.
the database stores the parser output text together with a json string as follows:

* "... example "$$0$$" yadayada "$$1$$" more yadayada ..."
* {"0": "latex1", 1: "latex2"}

so when an exercise is requested, the parser replaces the ids with the appropriate <img> tag:

* "... example <_img src="/../0.svg"> yadayada <_img src="/../1.svg"> more yadayada ..."

and when a user updates an exercise, the editor loads the raw text as it was when created.

this approach was chosen to keep the information ordered and concise, so to prevent for example the normal text "0" to be formatted, and in general prevent unwanted behavior that was not forseen.

as the user edits an exercise, the parser detekts latex and sends this latex in the background to the server for compilation. this is because latex compilation is time consuming, so it is better that the latex is compiled before the user submits or clicks "preview". this whole process happens in the background and each latex compilation happens on a new thread so that the server is free to process requests as usual. linux has a mechanism for managing overwhelming amounts of threads, so the site can handle large traffic.

note that latex is a scripting language, that can access the computer file systems, execute bash commands, get root access and perform all sorts of operations that can be abused, hence som latex commands are banned and there is a time limit on each latex thread.

## frontend

the frontend is handled by react with the standard react-router for url routing and navigation. every page is its own element in its own directory inside the pages dir. there is a shared directory for elements, functions and constants that are global and shared by all the pages.

there is a custom hook in the shared dir called "useController" that returns an array containing 4 elements:

0) a getter function .
1) a setter function.
2) a function that adds a callback function to an array that belongs to the hook.
3) the array of callbacks.

this hook is like useRef but in addition, any time the ref changes, an array of functions are executed, for example a function to rerender some element and a function to calculate some value.

a simple example (that is not worth the effort in a real world app) would be as follows:

a react element (call it the root element) contains a set of 100 elements. all elements have props from the root. when props change all elements are re rendered, even though only one needs to. we can define a useController hook in the root element that controls what elements render, when they render and in what condition.

example usage:
```javascript
const ctr = useController('default');
ctr[2]( 'func_name', ()=>{console.log('custom function executed')} );

console.log( ctr[0]() ); // 'default'
ctr[1]( 'not default' ); // 'custom function executed'
console.log( ctr[0]() ); // 'not default'
```


## clone and run the project for development

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

