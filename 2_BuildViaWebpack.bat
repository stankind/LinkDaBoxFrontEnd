@echo off

xcopy index.html dist\. /C /Y

call webpack -p

pause