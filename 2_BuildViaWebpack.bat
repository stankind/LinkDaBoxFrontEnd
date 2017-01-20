@echo off

xcopy index.html dist\. /C /Y

call npm run build

pause