// Admin panel functionality for managing portfolio images

let galleryImages = [];

// Load existing images on page load
document.addEventListener('DOMContentLoaded', function() {
    loadExistingImages();
});

// Handle image upload
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            processImage(file);
        }
    });
});

function processImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = {
            name: file.name,
            src: e.target.result,
            size: file.size,
            type: file.type,
            timestamp: Date.now()
        };
        
        galleryImages.push(imageData);
        displayImage(imageData);
        saveImageToAssets(file);
    };
    reader.readAsDataURL(file);
}

function saveImageToAssets(file) {
    // Create a download link for the image to save to assets folder
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = `assets/${file.name}`;
    
    // Show status message
    showStatus(`Image "${file.name}" ready for download. Save it to your assets folder.`, 'success');
}

function displayImage(imageData) {
    const imageGrid = document.getElementById('imageGrid');
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.dataset.name = imageData.name;
    
    imageItem.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.name}">
        <div class="image-actions">
            <button class="action-btn" onclick="downloadImage('${imageData.name}')" title="Download">↓</button>
            <button class="action-btn" onclick="removeImage('${imageData.name}')" title="Remove">×</button>
        </div>
    `;
    
    imageGrid.appendChild(imageItem);
}

function removeImage(imageName) {
    // Remove from array
    galleryImages = galleryImages.filter(img => img.name !== imageName);
    
    // Remove from display
    const imageItem = document.querySelector(`[data-name="${imageName}"]`);
    if (imageItem) {
        imageItem.remove();
    }
    
    showStatus(`Image "${imageName}" removed from gallery.`, 'success');
}

function downloadImage(imageName) {
    const image = galleryImages.find(img => img.name === imageName);
    if (image) {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `assets/${imageName}`;
        link.click();
    }
}

function generateGalleryData() {
    // Generate gallery.json file with image data
    const galleryData = {
        images: galleryImages.map(img => ({
            name: img.name,
            path: `assets/${img.name}`,
            timestamp: img.timestamp
        })),
        lastUpdated: new Date().toISOString()
    };
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(galleryData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'gallery.json';
    link.click();
    
    showStatus('Gallery data generated! Download the gallery.json file and place it in your project root.', 'success');
    
    // Update git commands with current timestamp
    updateGitCommands();
}

function loadExistingImages() {
    // Try to load existing gallery.json if it exists
    fetch('gallery.json')
        .then(response => response.json())
        .then(data => {
            if (data.images) {
                data.images.forEach(imageInfo => {
                    // Try to load the actual image
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        
                        const imageData = {
                            name: imageInfo.name,
                            src: canvas.toDataURL(),
                            timestamp: imageInfo.timestamp
                        };
                        
                        galleryImages.push(imageData);
                        displayImage(imageData);
                    };
                    img.src = imageInfo.path;
                });
            }
        })
        .catch(err => {
            console.log('No existing gallery.json found, starting fresh.');
        });
}

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    setTimeout(() => {
        status.style.display = 'none';
    }, 5000);
}

function updateGitCommands() {
    const timestamp = new Date().toLocaleString();
    const commands = `git add .
git commit -m "Update portfolio gallery - ${timestamp}"
git push origin main`;
    
    document.getElementById('gitCommands').textContent = commands;
}

function copyGitCommands() {
    const commands = document.getElementById('gitCommands').textContent;
    navigator.clipboard.writeText(commands).then(() => {
        showStatus('Git commands copied to clipboard!', 'success');
    }).catch(() => {
        showStatus('Failed to copy commands. Please copy manually.', 'error');
    });
}

// Drag and drop functionality
const uploadSection = document.querySelector('.upload-section');

uploadSection.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadSection.style.borderColor = '#007bff';
});

uploadSection.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadSection.style.borderColor = '#ddd';
});

uploadSection.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadSection.style.borderColor = '#ddd';
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            processImage(file);
        }
    });
});