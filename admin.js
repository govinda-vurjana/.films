// Admin panel functionality for managing portfolio content

let galleryImages = [];
let profileData = {};

// Load existing data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadExistingImages();
    loadCurrentData();
    setupProfileUpload();
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

// Profile image upload handling
function setupProfileUpload() {
    document.getElementById('profileUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profilePreview').src = e.target.result;
                profileData.profileImage = {
                    name: file.name,
                    data: e.target.result
                };
                showStatus('Profile image updated! Adjust position and zoom below.', 'success');
                setupImageEditor();
            };
            reader.readAsDataURL(file);
        }
    });
    
    setupImageEditor();
}

// Image editor functionality
function setupImageEditor() {
    const img = document.getElementById('profilePreview');
    const zoomSlider = document.getElementById('zoomSlider');
    const positionX = document.getElementById('positionX');
    const positionY = document.getElementById('positionY');
    const zoomValue = document.getElementById('zoomValue');
    const positionXValue = document.getElementById('positionXValue');
    const positionYValue = document.getElementById('positionYValue');
    
    // Load saved settings if they exist
    if (profileData.imageSettings) {
        zoomSlider.value = profileData.imageSettings.zoom || 1.2;
        positionX.value = profileData.imageSettings.positionX || 50;
        positionY.value = profileData.imageSettings.positionY || 20;
    }
    
    function updateImage() {
        const zoom = parseFloat(zoomSlider.value);
        const x = parseInt(positionX.value);
        const y = parseInt(positionY.value);
        
        console.log(`Updating image - Zoom: ${zoom}, X: ${x}%, Y: ${y}%`); // Debug log
        
        // Update display values
        zoomValue.textContent = zoom.toFixed(1) + 'x';
        positionXValue.textContent = x + '%';
        positionYValue.textContent = y + '%';
        
        // Calculate transform origin and position
        const originX = x;
        const originY = y;
        
        // Apply both transform and object-position for better control
        img.style.transform = `scale(${zoom})`;
        img.style.transformOrigin = `${originX}% ${originY}%`;
        img.style.objectPosition = `${x}% ${y}%`;
        
        console.log(`Applied styles - transform: scale(${zoom}), transformOrigin: ${originX}% ${originY}%, objectPosition: ${x}% ${y}%`); // Debug log
        
        // Save settings
        profileData.imageSettings = {
            zoom: zoom,
            positionX: x,
            positionY: y
        };
    }
    
    // Event listeners for sliders
    zoomSlider.addEventListener('input', updateImage);
    positionX.addEventListener('input', updateImage);
    positionY.addEventListener('input', updateImage);
    
    // Drag functionality for the image
    let isDragging = false;
    let startX, startY;
    
    img.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        img.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaX = (e.clientX - startX) * 0.2; // Reduced sensitivity
        const deltaY = (e.clientY - startY) * 0.2; // Reduced sensitivity
        
        const currentX = parseInt(positionX.value);
        const currentY = parseInt(positionY.value);
        
        const newX = Math.max(0, Math.min(100, currentX + deltaX));
        const newY = Math.max(0, Math.min(100, currentY + deltaY));
        
        positionX.value = newX;
        positionY.value = newY;
        
        console.log(`Drag update - X: ${newX}%, Y: ${newY}%`); // Debug log
        
        updateImage();
        
        startX = e.clientX;
        startY = e.clientY;
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        img.style.cursor = 'move';
    });
    
    // Initial update
    updateImage();
}

function resetImagePosition() {
    document.getElementById('zoomSlider').value = 1.2;
    document.getElementById('positionX').value = 50;
    document.getElementById('positionY').value = 20;
    
    const img = document.getElementById('profilePreview');
    img.style.transform = 'scale(1.2)';
    img.style.objectPosition = '50% 20%';
    
    // Update display values
    document.getElementById('zoomValue').textContent = '1.2x';
    document.getElementById('positionXValue').textContent = '50%';
    document.getElementById('positionYValue').textContent = '20%';
    
    // Save settings
    profileData.imageSettings = {
        zoom: 1.2,
        positionX: 50,
        positionY: 20
    };
    
    showStatus('Image position reset to default', 'success');
}

function testVerticalPosition() {
    const img = document.getElementById('profilePreview');
    const positionY = document.getElementById('positionY');
    const zoomSlider = document.getElementById('zoomSlider');
    
    // Set zoom to 2.0 for more visible effect
    zoomSlider.value = 2.0;
    
    // Test different vertical positions with more extreme values
    const testPositions = [0, 30, 50, 70, 100];
    let currentTest = 0;
    
    showStatus('Starting vertical position test with 2x zoom...', 'success');
    
    const testInterval = setInterval(() => {
        if (currentTest >= testPositions.length) {
            clearInterval(testInterval);
            // Reset to default
            positionY.value = 20;
            zoomSlider.value = 1.2;
            
            // Force update
            img.style.transform = 'scale(1.2)';
            img.style.objectPosition = '50% 20%';
            img.style.transformOrigin = '50% 20%';
            
            document.getElementById('positionYValue').textContent = '20%';
            document.getElementById('zoomValue').textContent = '1.2x';
            
            showStatus('Test completed - reset to defaults', 'success');
            return;
        }
        
        const testPos = testPositions[currentTest];
        positionY.value = testPos;
        
        // Force apply all styles
        img.style.transform = 'scale(2.0)';
        img.style.objectPosition = `50% ${testPos}%`;
        img.style.transformOrigin = `50% ${testPos}%`;
        
        // Force reflow
        img.offsetHeight;
        
        document.getElementById('positionYValue').textContent = testPos + '%';
        document.getElementById('zoomValue').textContent = '2.0x';
        
        console.log(`Testing vertical position: ${testPos}% with 2x zoom`);
        showStatus(`Testing Y: ${testPos}% (should see image move up/down)`, 'success');
        
        currentTest++;
    }, 1500);
}

// Load current data from existing files
function loadCurrentData() {
    // Try to load existing site-data.json
    fetch('site-data.json')
        .then(response => response.json())
        .then(data => {
            if (data.profile) {
                document.getElementById('fullName').value = data.profile.name || '';
                document.getElementById('role').value = data.profile.role || '';
                document.getElementById('bio').value = data.profile.bio || '';
                document.getElementById('height').value = data.profile.height || '';
                document.getElementById('languages').value = data.profile.languages || '';
                document.getElementById('location').value = data.profile.location || '';
                document.getElementById('experience').value = data.profile.experience || '';
                document.getElementById('age').value = data.profile.age || '';
            }
            
            if (data.about) {
                document.getElementById('aboutParagraph1').value = data.about.paragraph1 || '';
                document.getElementById('aboutParagraph2').value = data.about.paragraph2 || '';
                document.getElementById('aboutSkills').value = data.about.skills || '';
            }
            
            if (data.contact) {
                document.getElementById('email').value = data.contact.email || '';
                document.getElementById('phone').value = data.contact.phone || '';
                document.getElementById('instagram').value = data.contact.instagram || '';
                document.getElementById('vimeo').value = data.contact.vimeo || '';
                document.getElementById('linkedin').value = data.contact.linkedin || '';
            }
            
            profileData = data;
            
            // Load image settings if they exist
            if (data.profile && data.profile.imageSettings) {
                profileData.imageSettings = data.profile.imageSettings;
                // Apply settings to the editor
                setTimeout(() => {
                    if (document.getElementById('zoomSlider')) {
                        document.getElementById('zoomSlider').value = data.profile.imageSettings.zoom || 1.2;
                        document.getElementById('positionX').value = data.profile.imageSettings.positionX || 50;
                        document.getElementById('positionY').value = data.profile.imageSettings.positionY || 20;
                        setupImageEditor(); // Refresh the editor
                    }
                }, 100);
            }
        })
        .catch(err => {
            console.log('No existing site data found, starting fresh.');
        });
}

// Save all data (profile, contact, gallery) - AUTOMATED VERSION
async function saveAllData() {
    try {
        showStatus('💾 Saving data...', 'success');
        
        // Collect profile data
        const profile = {
            name: document.getElementById('fullName').value,
            role: document.getElementById('role').value,
            bio: document.getElementById('bio').value,
            height: document.getElementById('height').value,
            languages: document.getElementById('languages').value,
            location: document.getElementById('location').value,
            experience: document.getElementById('experience').value,
            age: document.getElementById('age').value
        };
        
        // Collect about data
        const about = {
            paragraph1: document.getElementById('aboutParagraph1').value,
            paragraph2: document.getElementById('aboutParagraph2').value,
            skills: document.getElementById('aboutSkills').value
        };
        
        // Collect contact data
        const contact = {
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            instagram: document.getElementById('instagram').value,
            vimeo: document.getElementById('vimeo').value,
            linkedin: document.getElementById('linkedin').value
        };
        
        // Combine all data
        const siteData = {
            profile: profile,
            about: about,
            contact: contact,
            gallery: {
                images: galleryImages.map(img => ({
                    name: img.name,
                    path: `assets/${img.name}`,
                    timestamp: img.timestamp
                }))
            },
            lastUpdated: new Date().toISOString()
        };
        
        // Add image settings if they exist
        if (profileData.imageSettings) {
            siteData.profile.imageSettings = profileData.imageSettings;
        }
        
        // Gallery data for backward compatibility
        const galleryData = {
            images: galleryImages.map(img => ({
                name: img.name,
                path: `assets/${img.name}`,
                timestamp: img.timestamp
            })),
            lastUpdated: new Date().toISOString()
        };
        
        // Save profile image if updated
        if (profileData.profileImage) {
            await saveProfileImage();
        }
        
        // Save gallery images
        await saveGalleryImages();
        
        // Save JSON data via API
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ siteData, galleryData })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showStatus('✅ All data saved automatically! Building static version...', 'success');
        
        // Build static version
        await buildStaticVersion(siteData);
            
            // Refresh the main site preview
            setTimeout(() => {
                const iframe = document.getElementById('sitePreview');
                if (iframe) {
                    iframe.src = iframe.src; // Refresh iframe
                }
            }, 500);
            
            // Check git status
            checkGitStatus();
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Save error:', error);
        showStatus(`❌ Error saving: ${error.message}`, 'error');
    }
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

// Check if required files exist in the project
function checkFiles() {
    checkFileExists('site-data.json', 'siteDataCheck');
    checkFileExists('gallery.json', 'galleryDataCheck');
}

function checkFileExists(filename, elementId) {
    fetch(filename)
        .then(response => {
            const element = document.getElementById(elementId);
            if (response.ok) {
                element.innerHTML = `✅ ${filename} - <span style="color: #28a745;">Found</span>`;
                element.className = 'file-check found';
            } else {
                element.innerHTML = `❌ ${filename} - <span style="color: #dc3545;">Missing - Save the downloaded file to your project root</span>`;
                element.className = 'file-check missing';
            }
        })
        .catch(() => {
            const element = document.getElementById(elementId);
            element.innerHTML = `❌ ${filename} - <span style="color: #dc3545;">Missing - Save the downloaded file to your project root</span>`;
            element.className = 'file-check missing';
        });
}

// Add download buttons for individual images
function displayImage(imageData) {
    const imageGrid = document.getElementById('imageGrid');
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.dataset.name = imageData.name;
    
    imageItem.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.name}">
        <div class="image-actions">
            <button class="action-btn" onclick="downloadImage('${imageData.name}')" title="Download to assets/">💾</button>
            <button class="action-btn" onclick="removeImage('${imageData.name}')" title="Remove">×</button>
        </div>
        <div class="image-name">${imageData.name}</div>
    `;
    
    imageGrid.appendChild(imageItem);
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

// Save profile image via API
async function saveProfileImage() {
    if (!profileData.profileImage) return;
    
    // Convert base64 to blob
    const response = await fetch(profileData.profileImage.data);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('profileImage', blob, 'profile.jpg');
    
    const uploadResponse = await fetch('/api/upload-profile', {
        method: 'POST',
        body: formData
    });
    
    const result = await uploadResponse.json();
    if (!result.success) {
        throw new Error(result.error);
    }
}

// Save gallery images via API
async function saveGalleryImages() {
    const newImages = galleryImages.filter(img => img.isNew);
    if (newImages.length === 0) return;
    
    const formData = new FormData();
    
    for (const img of newImages) {
        const response = await fetch(img.src);
        const blob = await response.blob();
        formData.append('galleryImages', blob, img.name);
    }
    
    const uploadResponse = await fetch('/api/upload-gallery', {
        method: 'POST',
        body: formData
    });
    
    const result = await uploadResponse.json();
    if (!result.success) {
        throw new Error(result.error);
    }
    
    // Mark images as saved
    galleryImages.forEach(img => img.isNew = false);
}

// Deploy to Git
async function deployToGit() {
    try {
        showStatus('🚀 Deploying to GitHub...', 'success');
        
        const commitMessage = prompt('Enter commit message (optional):') || 
                             `Update portfolio - ${new Date().toLocaleString()}`;
        
        const response = await fetch('/api/deploy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commitMessage })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showStatus('🎉 Successfully deployed to GitHub Pages!', 'success');
            checkGitStatus();
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Deploy error:', error);
        showStatus(`❌ Deployment failed: ${error.message}`, 'error');
    }
}

// Check Git status
async function checkGitStatus() {
    try {
        const response = await fetch('/api/git-status');
        const result = await response.json();
        
        const deployBtn = document.getElementById('deployBtn');
        if (result.hasChanges) {
            deployBtn.style.display = 'inline-block';
            deployBtn.textContent = '🚀 Deploy to GitHub';
        } else {
            deployBtn.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Git status error:', error);
    }
}

// Update processImage to mark new images
function processImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = {
            name: file.name,
            src: e.target.result,
            size: file.size,
            type: file.type,
            timestamp: Date.now(),
            isNew: true // Mark as new for upload
        };
        
        galleryImages.push(imageData);
        displayImage(imageData);
    };
    reader.readAsDataURL(file);
}

// Preview functions
function openPreview() {
    window.open('http://localhost:3000/index.html', '_blank');
}

function refreshPreview() {
    // If there's an open preview window, refresh it
    showStatus('🔄 Preview refreshed! Check your preview window.', 'success');
}

// Auto-check git status on load
document.addEventListener('DOMContentLoaded', function() {
    loadExistingImages();
    loadCurrentData();
    setupProfileUpload();
    
    // Check if server is running
    fetch('/api/git-status')
        .then(() => {
            showStatus('✅ CMS Server connected! Auto-save enabled.', 'success');
            checkGitStatus();
        })
        .catch(() => {
            showStatus('⚠️ Server not running. Start with: npm start', 'error');
        });
});
// Buil
d static version with embedded data
async function buildStaticVersion(siteData) {
    try {
        const response = await fetch('/api/build-static', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ siteData })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showStatus('🎉 Static version built! Site ready for GitHub Pages.', 'success');
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Build static error:', error);
        showStatus('⚠️ Static build failed, but data was saved.', 'error');
    }
}