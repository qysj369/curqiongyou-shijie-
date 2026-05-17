@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Roamwise 本地预览

where node >nul 2>&1
if errorlevel 1 (
  echo [错误] 未检测到 Node.js。请先安装：https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo 首次运行：正在安装依赖，请稍候…
  call npm install
  if errorlevel 1 (
    echo [错误] npm install 失败
    pause
    exit /b 1
  )
)

echo.
echo 正在启动网站，浏览器将打开： http://127.0.0.1:5173/
echo 不要关闭本窗口；按 Ctrl+C 可停止服务。
echo.

start "" "http://127.0.0.1:5173/"
call npm run dev

pause
