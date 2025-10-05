@echo off
echo ========================================
echo Exoplanet Detection System Setup
echo ========================================
echo.

echo [1/4] Setting up Python backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
echo.

echo [2/4] Training initial ML model...
python model.py
echo.

echo [3/4] Setting up React frontend...
cd ..\frontend
call npm install
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo To start the application:
echo.
echo 1. Backend (in one terminal):
echo    cd backend
echo    venv\Scripts\activate
echo    python app.py
echo.
echo 2. Frontend (in another terminal):
echo    cd frontend
echo    npm run dev
echo.
echo Then open http://localhost:5173 in your browser
echo ========================================
pause
