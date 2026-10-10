@echo off
title CareGuide AI - MongoDB Admin Backend Server
echo ========================================================
echo   CareGuide AI - MongoDB Admin Backend Launcher
echo ========================================================
echo.
echo [1/3] Checking Python dependencies...
python -m pip install -q pymongo mongomock flask flask-cors python-dotenv

echo [2/3] Launching MongoDB Backend Server on port 8080...
start "" http://localhost:8080/admin

echo [3/3] Server starting... (Press Ctrl+C to stop)
python server.py
pause
