#!/bin/bash

echo "Deploying Portfolio to GitHub Pages..."
echo

echo "Adding all changes..."
git add .

echo
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update portfolio gallery"
fi

echo "Committing changes..."
git commit -m "$commit_msg"

echo "Pushing to GitHub..."
git push origin main

echo
echo "Deployment complete!"
echo "Your site will be available at: https://yourusername.github.io/repository-name"
echo