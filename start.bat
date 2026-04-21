@echo off
echo ====================================
echo   Kisaan Bandhu - Setup ^& Launch
echo ====================================
echo.
echo [1/2] Installing dependencies...
call npm install
echo.
echo [2/2] Starting dev server...
echo.
echo Open http://localhost:5173 in your browser
echo.
call npm run dev
pause
