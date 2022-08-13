cd %~dp0

copy automateIndexHtml.py dev\browse
copy automateIndexHtml.py dev\chalange
copy automateIndexHtml.py dev\home
copy automateIndexHtml.py dev\new
copy automateIndexHtml.py dev\user

cd %~dp0dev\browse
py automateIndexHtml.py
cd %~dp0dev\chalange
py automateIndexHtml.py
cd %~dp0dev\home
py automateIndexHtml.py
cd %~dp0dev\new
py automateIndexHtml.py
cd %~dp0dev\user
py automateIndexHtml.py

cd %~dp0
xcopy /y /e dev\browse\build\browse      %~dp0production\volume\static\pages\browse
xcopy /y /e dev\chalange\build\chalange  %~dp0production\volume\static\pages\chalange
xcopy /y /e dev\home\build\home          %~dp0production\volume\static\pages\home
xcopy /y /e dev\new\build\new            %~dp0production\volume\static\pages\new
xcopy /y /e dev\user\build\user          %~dp0production\volume\static\pages\user

pause