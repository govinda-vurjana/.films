const fs = require('fs');
const path = require('path');

console.log('🚀 Building production version...');

// Files to exclude from production
const excludeFiles = [
    'admin.html',
    'admin.js', 
    'server.js',
    'package.json',
    'package-lock.json',
    'start.bat',
    'start.sh',
    'deploy.bat', 
    'deploy.sh',
    'test-setup.js',
    'test-gallery.html',
    'simple-test.html',
    'build-production.js',
    'node_modules'
];

// Create production directory
const prodDir = 'production';
if (!fs.existsSync(prodDir)) {
    fs.mkdirSync(prodDir);
}

// Copy files (excluding admin and development files)
const files = fs.readdirSync('.');
files.forEach(file => {
    if (!excludeFiles.includes(file) && !file.startsWith('.')) {
        const stat = fs.statSync(file);
        if (stat.isFile()) {
            fs.copyFileSync(file, path.join(prodDir, file));
            console.log(`✅ Copied: ${file}`);
        } else if (stat.isDirectory() && file === 'assets') {
            // Copy assets directory
            if (!fs.existsSync(path.join(prodDir, 'assets'))) {
                fs.mkdirSync(path.join(prodDir, 'assets'));
            }
            const assetFiles = fs.readdirSync('assets');
            assetFiles.forEach(assetFile => {
                fs.copyFileSync(
                    path.join('assets', assetFile), 
                    path.join(prodDir, 'assets', assetFile)
                );
            });
            console.log(`✅ Copied: assets/ directory`);
        }
    }
});

console.log(`\n🎉 Production build complete!`);
console.log(`📁 Files are in the '${prodDir}' directory`);
console.log(`🚫 Admin panel and development files excluded for security`);