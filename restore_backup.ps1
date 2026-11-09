# PowerShell скрипт для відкату до версії v1.0 Stable
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backupDir = Join-Path $scriptDir "backups\v1.0_stable"

Clear-Host
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  EuroTrans: Логістика Європи — Відновлення бекапу" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ця дія перезапише поточні файли файлами з бекапу v1.0_stable." -ForegroundColor Gray
$response = Read-Host "Ви дійсно бажаєте відкатити гру до версії v1.0? (Y/N)"

if ($response -ne 'Y' -and $response -ne 'y') {
    Write-Host "`n[!] Відновлення скасовано." -ForegroundColor Yellow
    exit
}

Write-Host "`n[-] Відновлення файлів..." -ForegroundColor Cyan

$files = @("index.html", "style.css", "game.js", "README.md")
$allSuccess = $true

foreach ($file in $files) {
    $src = Join-Path $backupDir $file
    $dst = Join-Path $scriptDir $file
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host " [✓] Відновлено: $file" -ForegroundColor Green
    } else {
        Write-Host " [X] Не знайдено бекап для: $file" -ForegroundColor Red
        $allSuccess = $false
    }
}

if ($allSuccess) {
    Write-Host "`n[✓] Успішно! Всі файли відновлено до версії v1.0 Stable." -ForegroundColor Green
    $openGame = Read-Host "`nВідкрити гру в браузері зараз? (Y/N)"
    if ($openGame -eq 'Y' -or $openGame -eq 'y') {
        Start-Process (Join-Path $scriptDir "index.html")
    }
} else {
    Write-Host "`n[!] Деякі файли не вдалося відновити." -ForegroundColor Red
}
