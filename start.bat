@echo off
echo 🚀 Starting Portfolio CMS...
echo.

echo Installing dependencies...
npm install

echo.
echo Starting server...
echo.
echo 📱 Admin Panel will open at: http://localhost:3000/admin.html
echo 🌐 Website preview at: http://localhost:3000/index.html
echo.
echo Press Ctrl+C to stop the server
echo.

start http://localhost:3000/admin.html
npm start