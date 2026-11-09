@echo off
chcp 65001 > nul
title Створення нового бекапу
cls

echo ========================================================
echo   EuroTrans: Логістика Європи — Створення бекапу
echo ========================================================
echo.
set /p tag="Введіть назву або номер версії (наприклад: v1.1_my_changes): "

if "%tag%"=="" (
    set tag=backup_%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%
    set tag=%tag: =0%
)

set targetDir=%~dp0backups\%tag%

echo.
echo [-] Створення бекапу в папку: backups\%tag%
mkdir "%targetDir%" 2> nul

copy /y "%~dp0index.html" "%targetDir%\index.html" > nul
copy /y "%~dp0style.css" "%targetDir%\style.css" > nul
copy /y "%~dp0game.js" "%targetDir%\game.js" > nul
copy /y "%~dp0README.md" "%targetDir%\README.md" > nul

echo [✓] Бекап успішно збережено в: backups\%tag%
echo.
pause
