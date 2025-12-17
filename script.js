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

// Load gallery images from JSON file
document.addEventListener('DOMContentLoaded', function() {
    loadGalleryImages();
});

function loadGalleryImages() {
    fetch('gallery.json')
        .then(response => response.json())
        .then(data => {
            const galleryGrid = document.getElementById('galleryGrid');
            
            if (data.images && data.images.length > 0) {
                data.images.forEach(imageInfo => {
                    const galleryItem = createGalleryItem(imageInfo.path, imageInfo.name);
                    galleryGrid.appendChild(galleryItem);
                });
            } else {
                // Show placeholder if no images
                galleryGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                        <p>No images in gallery yet.</p>
                        <p>Use the admin panel to add images.</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.log('Gallery data not found, showing placeholder');
            const galleryGrid = document.getElementById('galleryGrid');
            galleryGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                    <p>Gallery loading...</p>
                    <p>Use the admin panel to add images.</p>
                </div>
            `;
        });
}

function createGalleryItem(src, alt) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    item.innerHTML = `
        <img src="${src}" alt="${alt}" loading="lazy">
    `;
    
    return item;
}

// Gallery item click for fullscreen view
document.addEventListener('click', function(e) {
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

// Mobile menu toggle (if you want to add mobile menu later)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

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