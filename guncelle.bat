@echo off
title Wihyfe - Canli Siteyi Guncelle
echo ========================================================
echo          WIHYFE SITE GUNCELLEMESI YAYINLANIYOR
echo ========================================================
echo.

set "GIT=C:\Users\gumus\AppData\Local\MinGit\cmd\git.exe"
set "GH=C:\Users\gumus\AppData\Local\gh\bin\gh.exe"

echo 1. Degisiklikler toplaniyor...
"%GIT%" add .

echo 2. Kayit olusturuluyor...
set /p commit_msg="Guncelleme notu girin (Enter'a basip gecebilirsiniz): "
if "%commit_msg%"=="" set commit_msg=Site guncellemesi - %date% %time%

"%GIT%" commit -m "%commit_msg%"

echo 3. Canliya (GitHub ve Vercel'e) yukleniyor...
for /f "tokens=*" %%i in ('"%GH%" auth token') do set GHTOKEN=%%i
"%GIT%" push https://%GHTOKEN%@github.com/gumuslina18-blip/Wihyfe.git main

echo.
echo ========================================================
echo   TEBRIKLER! Guncelleme gonderildi.
echo   Vercel yaklasik 30 saniye icinde wihyfe.com'u
echo   otomatik olarak yenileyecektir.
echo ========================================================
echo.
pause
