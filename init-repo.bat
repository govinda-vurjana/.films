@echo off
echo 🚀 Initializing Film Portfolio Repository...
echo.

echo Enter your GitHub username:
set /p username="Username: "

echo Enter your repository name (e.g., film-portfolio):
set /p reponame="Repository name: "

echo.
echo 📁 Initializing git repository...
git init

echo 📝 Adding all files...
git add .

echo 💾 Creating initial commit...
git commit -m "Initial commit: Film portfolio with CMS"

echo 🔗 Adding GitHub remote...
git remote add origin https://github.com/%username%/%reponame%.git

echo 🚀 Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Repository setup complete!
echo.
echo 🌐 Your site will be available at:
echo https://%username%.github.io/%reponame%
echo.
echo 📋 Next steps:
echo 1. Go to GitHub.com and enable Pages in repository settings
echo 2. Select "GitHub Actions" as the source
echo 3. Wait for deployment to complete
echo.
pause