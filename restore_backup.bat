@echo off
chcp 65001 > nul
title Відновлення початкової версії (v1.0 Stable)
cls

echo ========================================================
echo   EuroTrans: Логістика Європи — Відновлення бекапу
echo ========================================================
echo.
echo УВАГА: Ця дія перезапише поточні файли (index.html, style.css, game.js)
echo файлами з безпечного бекапу v1.0_stable.
echo.
set /p choice="Ви дійсно бажаєте відкатити гру до версії v1.0? (Y/N): "

if /i "%choice%" neq "Y" (
    echo.
    echo [!] Відновлення скасовано користувачем.
    goto end
)

echo.
echo [-] Відновлення файлів...

copy /y "%~dp0backups\v1.0_stable\index.html" "%~dp0index.html" > nul
copy /y "%~dp0backups\v1.0_stable\style.css" "%~dp0style.css" > nul
copy /y "%~dp0backups\v1.0_stable\game.js" "%~dp0game.js" > nul
copy /y "%~dp0backups\v1.0_stable\README.md" "%~dp0README.md" > nul

if %errorlevel% equ 0 (
    echo [✓] Успішно! Всі файли гри відкатано до робочої версії v1.0.
    echo.
    set /p opennow="Відкрити гру в браузері зараз? (Y/N): "
    if /i "%opennow%" equ "Y" (
        start "" "%~dp0index.html"
    )
) else (
    echo [X] Виникла помилка при копіюванні файлів. Перевірте наявність папки backups\v1.0_stable.
)

:end
echo.
pause
