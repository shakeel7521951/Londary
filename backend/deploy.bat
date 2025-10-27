@echo off
REM AKOYA Laundry - Quick Deployment Script for Windows

echo ========================================
echo AKOYA Laundry - AWS Lambda Deployment
echo ========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo Error: .env file not found!
    echo Please create a .env file with required environment variables.
    echo See .env.example for reference.
    exit /b 1
)

echo Environment file found
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Dependencies installed
echo.

REM Ask for deployment stage
echo Select deployment stage:
echo 1. Development (dev)
echo 2. Production (prod)
echo 3. Custom stage
set /p stage_choice="Enter choice (1-3): "

if "%stage_choice%"=="1" (
    set STAGE=dev
) else if "%stage_choice%"=="2" (
    set STAGE=prod
) else if "%stage_choice%"=="3" (
    set /p STAGE="Enter custom stage name: "
) else (
    echo Invalid choice. Defaulting to dev.
    set STAGE=dev
)

echo.
echo Deploying to stage: %STAGE%
echo.

REM Deploy
call serverless deploy --stage %STAGE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Deployment successful!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Note the API endpoint URL above
    echo 2. Update your frontend VITE_API_URL with this endpoint
    echo 3. Test the API health endpoint
    echo.
    echo View logs: serverless logs -f api -t --stage %STAGE%
) else (
    echo.
    echo Deployment failed!
    echo Check the error messages above for details.
    exit /b 1
)

pause
