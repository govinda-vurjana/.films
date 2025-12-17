@echo off
echo Deploying Portfolio to GitHub Pages...
echo.

echo Adding all changes...
git add .

echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update portfolio gallery

echo Committing changes...
git commit -m "%commit_msg%"

echo Pushing to GitHub...
git push origin main

echo.
echo Deployment complete!
echo Your site will be available at: https://yourusername.github.io/repository-name
echo.
pause