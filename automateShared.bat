cd %~dp0\dev
FOR /f %%G IN ('dir /b /A:D') DO ( IF [%%G] NEQ [shared] rmdir /s /q %%G\src\shared )
FOR /f %%G IN ('dir /b') DO ( IF [%%G] NEQ [shared] Xcopy /E /I /Y shared %~dp0dev\%%G\src\shared  )
cd %~dp0

