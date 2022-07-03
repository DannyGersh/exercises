
cd %~dp0\chalanges\pages
rmdir /s /q chalange

cd ..\..\dev\chalange
Xcopy /E /I /Y %~dp0\dev\chalange\build %~dp0\chalanges\pages\chalange

rename  %~dp0\chalanges\pages\chalange\index.html  chalange.html