const fs = require('fs');

console.log('🔧 Building static version with embedded data...');

try {
    // Read the current site data
    const siteData = JSON.parse(fs.readFileSync('site-data.json', 'utf8'));
    console.log('✅ Loaded site data');

    // Read the current HTML template
    let html = fs.readFileSync('index.html', 'utf8');
    console.log('✅ Loaded HTML template');

    // Create embedded data script
    const embeddedDataScript = `    <script>
        // Embedded site data - no server required
        window.SITE_DATA = ${JSON.stringify(siteData, null, 8)};
        console.log('📊 Site data loaded from embedded source');
    </script>`;

    // Insert the embedded data before the script.js
    html = html.replace('<script src="script.js"></script>', 
        embeddedDataScript + '\n    <script src="script.js"></script>');

    // Write the static HTML file
    fs.writeFileSync('index.html', html);
    console.log('✅ Updated index.html with embedded data');

    console.log('\n🎉 Static build complete!');
    console.log('💡 Now index.html works without any server');
    console.log('🌐 Ready for GitHub Pages deployment');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}