# 🚀 Deployment Guide

## GitHub Pages Setup

### 1. Create GitHub Repository

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Film portfolio with CMS"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy your site

### 3. Repository Settings

**Important**: Make sure your repository is **public** for GitHub Pages to work (unless you have GitHub Pro).

## 🔒 Security Notes

### Admin Panel Security
- The admin panel (`admin.html`) is **excluded** from the GitHub Pages deployment
- Admin files are only for local development use
- Your live site will NOT include admin functionality for security

### What Gets Deployed
✅ **Included in live site:**
- `index.html` - Main website
- `styles.css` - Styling
- `script.js` - Website functionality  
- `site-data.json` - Your content data
- `gallery.json` - Gallery data
- `assets/` - All your images
- `README.md` - Documentation

❌ **Excluded from live site:**
- `admin.html` - Admin panel
- `admin.js` - Admin functionality
- `server.js` - Development server
- `package.json` - Node.js dependencies
- All test files and development scripts

## 🛠️ Development Workflow

### Local Development
```bash
# Start the CMS server for editing
npm start

# Open admin panel
# http://localhost:3000/admin.html

# Edit content, save changes
# Files automatically update locally
```

### Deploy Changes
```bash
# After making changes in admin panel
git add .
git commit -m "Update portfolio content"
git push origin main

# GitHub Actions will automatically deploy
# Site will be live at: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
```

## 📁 File Structure

```
your-portfolio/
├── 🌐 PUBLIC SITE (deployed to GitHub Pages)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── site-data.json
│   ├── gallery.json
│   └── assets/
│
├── 🔒 ADMIN/DEV (local only)
│   ├── admin.html
│   ├── admin.js
│   ├── server.js
│   ├── package.json
│   └── development scripts
│
└── 🚀 DEPLOYMENT
    ├── .github/workflows/deploy.yml
    ├── .gitignore
    └── DEPLOYMENT.md
```

## 🌍 Custom Domain (Optional)

1. **Buy a domain** (e.g., yourname.com)
2. **Add CNAME file** to your repository:
   ```bash
   echo "yourname.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push origin main
   ```
3. **Configure DNS** with your domain provider:
   - Add CNAME record: `www` → `YOUR_USERNAME.github.io`
   - Add A records for apex domain:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

## 🔧 Troubleshooting

### Site Not Updating
1. Check **Actions** tab in GitHub for deployment status
2. Ensure `site-data.json` is committed and pushed
3. Clear browser cache (Ctrl+F5)

### Images Not Loading
1. Ensure images are in `assets/` folder
2. Check file names match exactly (case-sensitive)
3. Verify images are committed to git

### Admin Panel Not Working
- Admin panel only works locally with `npm start`
- It's intentionally excluded from the live site for security

## 📞 Support

If you encounter issues:
1. Check the **Actions** tab for deployment errors
2. Verify all files are committed and pushed
3. Ensure repository is public (for free GitHub Pages)

Your live site will be available at:
**https://YOUR_USERNAME.github.io/YOUR_REPO_NAME**