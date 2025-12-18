# 🚀 Quick Setup Guide

## Step-by-Step Instructions

### 1. Initial Setup
1. Open `admin.html` in your web browser
2. Fill in all your information:
   - **Profile**: Name, role, bio, height, languages, location, experience, skills
   - **Contact**: Email, phone, social media links
   - **Gallery**: Upload your portfolio images

### 2. Save Your Data
1. Click **"Save All Changes"** button
2. Two files will download:
   - `site-data.json` 
   - `gallery.json`
3. **IMPORTANT**: Save both files to your project root folder (same folder as `index.html`)

### 3. Save Your Images
1. In the admin panel, click the 💾 button on each gallery image to download it
2. Save all downloaded images to the `assets/` folder
3. Make sure your profile image is saved as `assets/profile.jpg`

### 4. Test Your Site
1. Open `index.html` in your browser
2. Check the bottom of the page for status:
   - ✅ Green = Data loaded successfully
   - ❌ Red = Files missing, check step 2

### 5. Deploy to GitHub Pages
1. Run the deployment script:
   ```bash
   # Windows
   deploy.bat
   
   # Mac/Linux
   ./deploy.sh
   ```
2. Or manually:
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

## Troubleshooting

### ❌ "site-data.json not found"
- Make sure you saved the downloaded `site-data.json` file to your project root
- The file should be in the same folder as `index.html`

### 🖼️ Images not showing
- Check that images are saved in the `assets/` folder
- Make sure filenames match exactly (case-sensitive)
- Profile image should be named `profile.jpg`

### 🔄 Changes not appearing
- Click the "Refresh" button at the bottom of the page
- Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)
- Make sure you saved the files in the correct locations

## File Structure
```
your-project/
├── index.html          ← Main website
├── admin.html          ← Admin panel (local use only)
├── site-data.json      ← Your content data (save here!)
├── gallery.json        ← Gallery data (save here!)
├── assets/
│   ├── profile.jpg     ← Your profile photo
│   ├── image1.jpg      ← Gallery images
│   └── image2.jpg
└── ...
```

## Need Help?
- Check the debug info at the bottom of `index.html`
- Use the "Check Files" button in the admin panel
- Make sure all files are in the correct locations