// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Load site data and gallery images
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Page loaded, starting to load data...');

    // Check if we have embedded data (static version)
    if (window.SITE_DATA) {
        console.log('📊 Using embedded site data (static version)');
        updateSiteContent(window.SITE_DATA);
        if (window.SITE_DATA.gallery && window.SITE_DATA.gallery.images) {
            displayGalleryImages(window.SITE_DATA.gallery.images);
        } else {
            showGalleryPlaceholder();
        }
    } else {
        console.log('🌐 Loading data from JSON files (server version)');
        loadSiteData();
        loadGalleryImages();
    }

    // Debug: Check if gallery grid exists
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        console.log('✅ Gallery grid element found');
    } else {
        console.error('❌ Gallery grid element NOT found!');
    }
});

function loadSiteData() {
    const debugInfo = document.getElementById('debugInfo');

    fetch('site-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Site data file not found');
            }
            return response.json();
        })
        .then(data => {
            updateSiteContent(data);
            debugInfo.textContent = `✅ Site data loaded (${new Date().toLocaleTimeString()})`;
            debugInfo.style.color = '#28a745';
        })
        .catch(error => {
            console.log('Site data not found, using defaults');
            debugInfo.textContent = `❌ site-data.json not found - using defaults`;
            debugInfo.style.color = '#dc3545';
        });
}

function updateSiteContent(data) {
    if (data.profile) {
        // Update hero section
        if (data.profile.name) {
            document.querySelector('.hero-title').textContent = data.profile.name;
            document.querySelector('.nav-logo').textContent = data.profile.name;
            document.getElementById('footerName').textContent = data.profile.name;
            // Update page title
            document.title = data.profile.name + ' - Film Portfolio';
        }
        if (data.profile.role) {
            document.querySelector('.hero-role').textContent = data.profile.role;
        }
        if (data.profile.bio) {
            document.querySelector('.hero-subtitle').textContent = data.profile.bio;
        }

        // Update profile details
        if (data.profile.height) {
            document.querySelector('.detail-item:nth-child(1) .detail-value').textContent = data.profile.height;
        }
        if (data.profile.languages) {
            document.querySelector('.detail-item:nth-child(2) .detail-value').textContent = data.profile.languages;
        }
        if (data.profile.location) {
            document.querySelector('.detail-item:nth-child(3) .detail-value').textContent = data.profile.location;
        }
        if (data.profile.experience) {
            document.querySelector('.detail-item:nth-child(4) .detail-value').textContent = data.profile.experience;
        }
        if (data.profile.age) {
            document.querySelector('.detail-item:nth-child(5) .detail-value').textContent = data.profile.age;
        }

        // Apply image settings if they exist
        if (data.profile.imageSettings) {
            applyImageSettings(data.profile.imageSettings);
        }
    }

    if (data.about) {
        // Update about section content
        if (data.about.paragraph1) {
            document.getElementById('aboutParagraph1').textContent = data.about.paragraph1;
        }
        if (data.about.paragraph2) {
            document.getElementById('aboutParagraph2').textContent = data.about.paragraph2;
        }
        if (data.about.skills) {
            const skillsContainer = document.getElementById('aboutSkillsContainer');
            const skills = data.about.skills.split(',').map(s => s.trim()).filter(s => s);
            skillsContainer.innerHTML = skills.map(skill =>
                `<span class="skill-tag">${skill}</span>`
            ).join('');
        }
    }

    if (data.contact) {
        // Update contact information
        if (data.contact.email) {
            const emailLink = document.querySelector('a[href^="mailto:"]');
            if (emailLink) {
                emailLink.href = `mailto:${data.contact.email}`;
                emailLink.textContent = data.contact.email;
            }
        }
        if (data.contact.phone) {
            const phoneLink = document.querySelector('a[href^="tel:"]');
            if (phoneLink) {
                phoneLink.href = `tel:${data.contact.phone}`;
                phoneLink.textContent = data.contact.phone;
            }
        }

        // Update social links
        const socialLinks = document.querySelectorAll('.social-link');
        if (data.contact.instagram && socialLinks[0]) {
            socialLinks[0].href = data.contact.instagram;
        }
        if (data.contact.vimeo && socialLinks[1]) {
            socialLinks[1].href = data.contact.vimeo;
        }
        if (data.contact.linkedin && socialLinks[2]) {
            socialLinks[2].href = data.contact.linkedin;
        }
    }
}

function loadGalleryImages() {
    console.log('Loading gallery images...');

    // Try to load from site-data.json first, then fallback to gallery.json
    fetch('site-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('site-data.json not found');
            }
            return response.json();
        })
        .then(data => {
            console.log('Site data loaded:', data);
            if (data.gallery && data.gallery.images && data.gallery.images.length > 0) {
                console.log('Found gallery images in site-data.json:', data.gallery.images);
                displayGalleryImages(data.gallery.images);
            } else {
                console.log('No gallery in site-data.json, trying gallery.json');
                return loadFromGalleryJson();
            }
        })
        .catch(error => {
            console.log('Error loading site-data.json:', error);
            return loadFromGalleryJson();
        });
}

function loadFromGalleryJson() {
    return fetch('gallery.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('gallery.json not found');
            }
            return response.json();
        })
        .then(data => {
            console.log('Gallery data loaded:', data);
            if (data && data.images && data.images.length > 0) {
                console.log('Found gallery images in gallery.json:', data.images);
                displayGalleryImages(data.images);
            } else {
                console.log('No images in gallery.json');
                showGalleryPlaceholder();
            }
        })
        .catch(error => {
            console.log('Error loading gallery.json:', error);
            showGalleryPlaceholder();
        });
}

function displayGalleryImages(images) {
    console.log('Displaying gallery images:', images);
    const galleryGrid = document.getElementById('galleryGrid');

    if (!galleryGrid) {
        console.error('Gallery grid element not found!');
        return;
    }

    if (images && images.length > 0) {
        galleryGrid.innerHTML = '';
        images.forEach((imageInfo, index) => {
            console.log(`Creating gallery item ${index + 1}:`, imageInfo);
            const galleryItem = createGalleryItem(imageInfo.path, imageInfo.name);
            galleryGrid.appendChild(galleryItem);
        });
        console.log(`✅ Displayed ${images.length} gallery images`);
    } else {
        console.log('No images to display, showing placeholder');
        showGalleryPlaceholder();
    }
}

function showGalleryPlaceholder() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
            <p>No images in gallery yet.</p>
            <p>Use the admin panel to add images.</p>
        </div>
    `;
}

function createGalleryItem(src, alt) {
    console.log('Creating gallery item with src:', src);
    const item = document.createElement('div');
    item.className = 'gallery-item';

    item.innerHTML = `
        <img src="${src}" alt="${alt}" loading="lazy" 
             onerror="console.error('Failed to load image:', '${src}'); this.style.display='none';"
             onload="console.log('Image loaded successfully:', '${src}');">
    `;

    return item;
}

// Gallery item click for fullscreen view
document.addEventListener('click', function (e) {
    if (e.target.matches('.gallery-item img')) {
        openImageModal(e.target.src);
    }
});

function openImageModal(src) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeImageModal()">
            <img src="${src}" alt="Full size image">
            <button class="modal-close" onclick="closeImageModal()">×</button>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.gallery-item, .about-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileBtn = document.querySelector('.mobile-menu-btn');

    navMenu.classList.toggle('mobile-active');
    mobileBtn.textContent = navMenu.classList.contains('mobile-active') ? '✕' : '☰';
}

// Show mobile menu button on small screens
function updateMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (window.innerWidth <= 768) {
        mobileBtn.style.display = 'block';
    } else {
        mobileBtn.style.display = 'none';
        navMenu.classList.remove('mobile-active');
        mobileBtn.textContent = '☰';
    }
}

// Update on resize
window.addEventListener('resize', updateMobileMenu);
document.addEventListener('DOMContentLoaded', updateMobileMenu);

// Video play/pause on scroll (optional enhancement)
window.addEventListener('scroll', () => {
    const video = document.querySelector('.hero-video video');
    if (video) {
        const rect = video.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isVisible && !video.paused) {
            video.pause();
        }
    }
});

// Apply custom image positioning and zoom (only to hero image)
function applyImageSettings(settings) {
    console.log('Applying image settings:', settings);

    // Only apply to hero profile image, not about section
    const heroProfileImage = document.querySelector('.profile-image img');

    if (heroProfileImage) {
        if (settings.zoom) {
            heroProfileImage.style.transform = `scale(${settings.zoom})`;
        }
        if (settings.positionX !== undefined && settings.positionY !== undefined) {
            heroProfileImage.style.objectPosition = `${settings.positionX}% ${settings.positionY}%`;
            heroProfileImage.style.transformOrigin = `${settings.positionX}% ${settings.positionY}%`;
        }
        console.log('✅ Applied custom image settings to hero image');
    }

    // About section image remains natural (no custom settings applied)
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) {
        console.log('✅ About section image kept natural (no zoom/positioning)');
    }
}

// Add floating clouds to about section
function createFloatingClouds() {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;

    // Create cloud container
    const cloudContainer = document.createElement('div');
    cloudContainer.className = 'cloud-container';
    cloudContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

    // Create multiple clouds
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'floating-cloud';
        cloud.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50px;
            opacity: 0.6;
            animation: floatCloud ${15 + i * 5}s ease-in-out infinite;
            animation-delay: ${i * 3}s;
        `;

        // Random cloud sizes and positions
        const size = 60 + Math.random() * 40;
        const top = 20 + Math.random() * 60;
        const left = -10 + Math.random() * 120;

        cloud.style.width = size + 'px';
        cloud.style.height = size * 0.6 + 'px';
        cloud.style.top = top + '%';
        cloud.style.left = left + '%';

        // Add cloud parts for realistic shape
        cloud.innerHTML = `
            <div style="position: absolute; background: rgba(255,255,255,0.9); border-radius: 50%; 
                        width: 50%; height: 80%; top: 10%; left: 10%;"></div>
            <div style="position: absolute; background: rgba(255,255,255,0.7); border-radius: 50%; 
                        width: 60%; height: 60%; top: 20%; right: 10%;"></div>
        `;

        cloudContainer.appendChild(cloud);
    }

    aboutSection.appendChild(cloudContainer);

    // Add CSS animation for clouds
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatCloud {
            0% { transform: translateX(-100px) translateY(0px); }
            50% { transform: translateX(50px) translateY(-20px); }
            100% { transform: translateX(calc(100vw + 100px)) translateY(0px); }
        }
    `;
    document.head.appendChild(style);
}

// Add shooting stars effect
function createShootingStars() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    setInterval(() => {
        const shootingStar = document.createElement('div');
        shootingStar.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff;
            top: ${Math.random() * 50}%;
            left: ${Math.random() * 100}%;
            animation: shootingStar 3s linear forwards;
            z-index: 3;
        `;

        heroSection.appendChild(shootingStar);

        // Remove after animation
        setTimeout(() => {
            if (shootingStar.parentNode) {
                shootingStar.parentNode.removeChild(shootingStar);
            }
        }, 3000);

    }, 8000); // Create shooting star every 8 seconds

    // Add CSS animation for shooting stars
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shootingStar {
            0% { 
                transform: translateX(0) translateY(0) scale(0);
                opacity: 1;
            }
            10% { 
                transform: translateX(50px) translateY(50px) scale(1);
                opacity: 1;
            }
            100% { 
                transform: translateX(300px) translateY(300px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize cinematic effects
document.addEventListener('DOMContentLoaded', function () {
    // Existing code...

    // Add cinematic effects after a short delay
    setTimeout(() => {
        createFloatingClouds();
        createShootingStars();
        console.log('🎬 Cinematic effects initialized');
    }, 1000);
});
// Fallback for GitHub Pages - ensure effects are visible
function ensureEffectsVisible() {
    // Check if CSS animations are working
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Test if CSS animations are supported
    const testElement = document.createElement('div');
    testElement.style.animation = 'test 1s';
    const animationSupported = testElement.style.animation !== '';

    if (!animationSupported) {
        console.log('CSS animations not supported, using JavaScript fallback');
        createJavaScriptStars();
    } else {
        // Force CSS animations to start
        const heroStyles = window.getComputedStyle(heroSection, '::before');
        if (heroStyles.animation === 'none' || heroStyles.animation === '') {
            console.log('CSS animations not loading, using JavaScript fallback');
            createJavaScriptStars();
        }
    }
}

// JavaScript fallback for star effects
function createJavaScriptStars() {
    const heroSection = document.querySelector('.hero');
    const contactSection = document.querySelector('.contact');

    [heroSection, contactSection].forEach(section => {
        if (!section) return;

        const starContainer = document.createElement('div');
        starContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;

        // Create multiple stars
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: white;
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.8 + 0.2};
                box-shadow: 0 0 ${Math.random() * 10 + 5}px rgba(255,255,255,0.5);
            `;

            starContainer.appendChild(star);

            // Animate star
            animateStar(star);
        }

        section.appendChild(starContainer);
    });
}

function animateStar(star) {
    let opacity = parseFloat(star.style.opacity);
    let direction = Math.random() > 0.5 ? 1 : -1;

    setInterval(() => {
        opacity += direction * 0.02;
        if (opacity >= 1) {
            opacity = 1;
            direction = -1;
        } else if (opacity <= 0.2) {
            opacity = 0.2;
            direction = 1;
        }
        star.style.opacity = opacity;
    }, 100);
}

// Initialize fallback after page load
document.addEventListener('DOMContentLoaded', function () {
    // Existing code...

    // Check effects after a delay
    setTimeout(() => {
        ensureEffectsVisible();
    }, 2000);
});