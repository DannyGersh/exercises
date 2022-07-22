
:: opens up 4 windows to multitask all builds

cd %~dp0\dev\browse
start cmd /c npm run build
cd %~dp0\dev\chalange
start cmd /c npm run build
cd %~dp0\dev\new
start cmd /c npm run build
cd %~dp0\dev\user
start cmd /c npm run build