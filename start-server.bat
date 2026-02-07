@echo off
echo ========================================
echo   SERVER APLIKASI ABSEN STAFF
echo ========================================
echo.
echo Memulai server...
echo.

cd /d "%~dp0"
python -m http.server 8080

pause
