const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// API Routes
app.post('/api/save-data', async (req, res) => {
    try {
        const { siteData, galleryData } = req.body;
        
        // Save site-data.json
        await fs.writeFile('site-data.json', JSON.stringify(siteData, null, 2));
        
        // Save gallery.json
        await fs.writeFile('gallery.json', JSON.stringify(galleryData, null, 2));
        
        console.log('✅ Data saved successfully');
        res.json({ success: true, message: 'Data saved successfully!' });
    } catch (error) {
        console.error('❌ Error saving data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload profile image
app.post('/api/upload-profile', upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        
        // Rename to profile.jpg
        const oldPath = req.file.path;
        const newPath = path.join('assets', 'profile.jpg');
        await fs.rename(oldPath, newPath);
        
        console.log('✅ Profile image saved');
        res.json({ success: true, message: 'Profile image saved!', path: newPath });
    } catch (error) {
        console.error('❌ Error uploading profile:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload gallery images
app.post('/api/upload-gallery', upload.array('galleryImages'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'No files uploaded' });
        }
        
        const uploadedFiles = req.files.map(file => ({
            name: file.filename,
            path: `assets/${file.filename}`,
            size: file.size
        }));
        
        console.log(`✅ ${uploadedFiles.length} gallery images saved`);
        res.json({ success: true, message: 'Gallery images saved!', files: uploadedFiles });
    } catch (error) {
        console.error('❌ Error uploading gallery:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// Git deployment endpoint
app.post('/api/deploy', async (req, res) => {
    try {
        const { exec } = require('child_process');
        const { commitMessage } = req.body;
        
        const message = commitMessage || `Update portfolio - ${new Date().toLocaleString()}`;
        
        // Execute git commands
        const commands = [
            'git add .',
            `git commit -m "${message}"`,
            'git push origin main'
        ];
        
        for (const command of commands) {
            await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`❌ Git error: ${error}`);
                        reject(error);
                    } else {
                        console.log(`✅ ${command}: ${stdout}`);
                        resolve(stdout);
                    }
                });
            });
        }
        
        console.log('🚀 Deployment successful!');
        res.json({ success: true, message: 'Deployed to GitHub successfully!' });
    } catch (error) {
        console.error('❌ Deployment error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check git status
app.get('/api/git-status', async (req, res) => {
    try {
        const { exec } = require('child_process');
        
        exec('git status --porcelain', (error, stdout, stderr) => {
            if (error) {
                res.json({ hasChanges: false, error: error.message });
            } else {
                const hasChanges = stdout.trim().length > 0;
                res.json({ hasChanges, changes: stdout.trim() });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Portfolio CMS Server Running!

📱 Admin Panel: http://localhost:${PORT}/admin.html
🌐 Website: http://localhost:${PORT}/index.html

✨ Features:
- Auto-save files when you click save
- Auto-upload images to assets folder
- One-click Git deployment
- Live preview of changes

Press Ctrl+C to stop the server
    `);
});