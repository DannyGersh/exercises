
cd %~dp0\chalanges\pages
rmdir /s /q chalange
rmdir /s /q browse

cd ..\..\dev\chalange
Xcopy /E /I /Y %~dp0\dev\chalange\build %~dp0\chalanges\pages\chalange
Xcopy /E /I /Y %~dp0\dev\browse\build %~dp0\chalanges\pages\browse

rename  %~dp0\chalanges\pages\chalange\index.html  chalange.html
rename  %~dp0\chalanges\pages\browse\index.html  browse.html

cd %~dp0