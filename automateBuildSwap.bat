
cd %~dp0\chalanges\pages
rmdir /s /q chalange
rmdir /s /q browse
rmdir /s /q user
rmdir /s /q new
rmdir /s /q home

cd ..\..\dev\chalange
Xcopy /E /I /Y %~dp0\dev\chalange\build %~dp0\chalanges\pages\chalange
Xcopy /E /I /Y %~dp0\dev\browse\build %~dp0\chalanges\pages\browse
Xcopy /E /I /Y %~dp0\dev\user\build %~dp0\chalanges\pages\user
Xcopy /E /I /Y %~dp0\dev\new\build %~dp0\chalanges\pages\new
Xcopy /E /I /Y %~dp0\dev\home\build %~dp0\chalanges\pages\home

rename  %~dp0\chalanges\pages\chalange\index.html  chalange.html
rename  %~dp0\chalanges\pages\browse\index.html  browse.html
rename  %~dp0\chalanges\pages\user\index.html  user.html
rename  %~dp0\chalanges\pages\new\index.html  new.html
rename  %~dp0\chalanges\pages\home\index.html  home.html

cd %~dp0

