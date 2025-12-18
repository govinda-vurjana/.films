#!/bin/bash

echo "🚀 Starting Portfolio CMS..."
echo

echo "Installing dependencies..."
npm install

echo
echo "Starting server..."
echo
echo "📱 Admin Panel will open at: http://localhost:3000/admin.html"
echo "🌐 Website preview at: http://localhost:3000/index.html"
echo
echo "Press Ctrl+C to stop the server"
echo

# Try to open browser (works on most systems)
if command -v open > /dev/null; then
    open http://localhost:3000/admin.html
elif command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000/admin.html
fi

npm start