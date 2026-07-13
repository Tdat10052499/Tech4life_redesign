// Language management state
let currentLang = localStorage.getItem('app_lang') || 'vi';

// Inject CSS to hide Google Translate bar and widgets
function injectGoogleTranslateStyles() {
    const css = `
        /* Hide Google Translate top bar */
        iframe.skiptranslate, 
        .goog-te-banner-frame,
        .goog-te-banner-frame.skiptranslate,
        #goog-gt-tt {
            display: none !important;
            visibility: hidden !important;
        }
        body {
            top: 0px !important;
        }
        /* Render container offscreen, not display: none, so select initializes */
        #google_translate_element {
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
            width: 0px !important;
            height: 0px !important;
            overflow: hidden !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }
        /* Prevent highlight background */
        .goog-text-highlight {
            background-color: transparent !important;
            box-shadow: none !important;
            border: none !important;
        }
    `;
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}

// Load Google Translate script dynamically
function loadGoogleTranslate() {
    injectGoogleTranslateStyles();
    
    // Inject hidden container
    if (!document.getElementById('google_translate_element')) {
        const div = document.createElement('div');
        div.id = 'google_translate_element';
        document.body.appendChild(div);
    }
    
    // Inject Google Translate script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
}

// Define the global callback function required by Google Translate
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'vi',
        includedLanguages: 'vi,en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
    
    // Once loaded, apply active language
    setTimeout(() => {
        triggerGoogleTranslate(currentLang);
    }, 500);
};

// Function to programmatically change Google Translate language using cookie + dropdown trigger
function triggerGoogleTranslate(lang) {
    const cookieValue = `/vi/${lang}`;
    
    // Set googtrans cookie for instant load translation on all paths & subdomains
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
    
    // Fallback: also trigger select combo dropdown dynamically
    const selectEl = document.querySelector('.goog-te-combo');
    if (selectEl) {
        if (selectEl.value !== lang) {
            selectEl.value = lang;
            selectEl.dispatchEvent(new Event('change'));
        }
    } else {
        // Poll for dropdown up to 20 times (6 seconds) if not ready yet
        let attempts = 0;
        const interval = setInterval(() => {
            const selectEl = document.querySelector('.goog-te-combo');
            if (selectEl) {
                clearInterval(interval);
                if (selectEl.value !== lang) {
                    selectEl.value = lang;
                    selectEl.dispatchEvent(new Event('change'));
                }
            }
            attempts++;
            if (attempts > 20) {
                clearInterval(interval);
            }
        }, 300);
    }
}

function translatePage(lang) {
    document.querySelectorAll('[data-vi]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text;
            }
        }
    });
}

function updateLanguageButtons(lang) {
    const viBtn = document.getElementById('lang-vi-btn');
    const enBtn = document.getElementById('lang-en-btn');
    
    if (viBtn && enBtn) {
        if (lang === 'vi') {
            viBtn.className = "px-3.5 h-full bg-red-600 text-white flex items-center justify-center transition-colors duration-300";
            enBtn.className = "px-3.5 h-full bg-white text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors duration-300";
        } else {
            viBtn.className = "px-3.5 h-full bg-white text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors duration-300";
            enBtn.className = "px-3.5 h-full bg-red-600 text-white flex items-center justify-center transition-colors duration-300";
        }
    }

    const mobViBtn = document.getElementById('mob-lang-vi-btn');
    const mobEnBtn = document.getElementById('mob-lang-en-btn');
    
    if (mobViBtn && mobEnBtn) {
        if (lang === 'vi') {
            mobViBtn.className = "px-4 h-full bg-red-600 text-white flex items-center justify-center transition-colors focus:outline-none";
            mobEnBtn.className = "px-4 h-full bg-white text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors focus:outline-none";
        } else {
            mobViBtn.className = "px-4 h-full bg-white text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors focus:outline-none";
            mobEnBtn.className = "px-4 h-full bg-red-600 text-white flex items-center justify-center transition-colors focus:outline-none";
        }
    }
}

window.setLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('app_lang', lang);
    translatePage(lang);
    updateLanguageButtons(lang);
    triggerGoogleTranslate(lang);
};

// Start loading google translate immediately
loadGoogleTranslate();


async function loadComponent(id, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not fetch ${url}`);
        const html = await response.text();
        document.getElementById(id).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Function to format numbers with dots as thousands separator (e.g. 5.000)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Counter animation logic
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime >= duration) {
            el.innerText = formatNumber(target) + suffix;
        } else {
            const progress = elapsedTime / duration;
            // Ease out quad progression
            const easeProgress = progress * (2 - progress);
            const currentVal = Math.floor(easeProgress * target);
            el.innerText = formatNumber(currentVal) + suffix;
            requestAnimationFrame(updateCounter);
        }
    }
    requestAnimationFrame(updateCounter);
}

// Global scroll reveal initialization
function initGlobalScrollReveal() {
    // 1. Target selectors for elements we want to reveal automatically
    const targetSelectors = [
        'main h1',                                 // Main titles
        'main h2',                                 // Section headings
        'main h3',                                 // Subheadings
        'main p:not(.counter-container p)',        // Paragraphs (excluding statistics captions if desired)
        '.grid > div',                             // All grid items (cards, logo grids, etc.)
        'main img:not(#app-header img):not(#app-footer img)' // Images (excluding headers/footers)
    ];

    const elementsToReveal = [];

    // Query and initialize elements
    document.querySelectorAll(targetSelectors.join(',')).forEach(el => {
        // Exclude specific elements like headers, footers, watermark backgrounds, countdown spans, or items marked with 'no-reveal'
        if (
            el.closest('#app-header') ||
            el.closest('#app-footer') ||
            el.closest('#countdown-days') ||
            el.closest('#countdown-hours') ||
            el.closest('#countdown-minutes') ||
            el.closest('#countdown-seconds') ||
            el.closest('#diaiem-slideshow') ||
            el.classList.contains('no-reveal') ||
            el.classList.contains('counter') ||
            el.alt === 'Tech4life Watermark'
        ) {
            return;
        }

        el.classList.add('scroll-reveal');
        elementsToReveal.push(el);
    });

    // 2. Intersection Observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        // Group entries that are intersecting at the same time to apply stagger delays
        const visibleElements = [];

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visibleElements.push(entry.target);
                observer.unobserve(entry.target);
            }
        });

        if (visibleElements.length > 0) {
            // Group visible elements by parent to stagger siblings together
            const parentGroups = new Map();
            visibleElements.forEach(el => {
                const parent = el.parentElement;
                if (!parentGroups.has(parent)) {
                    parentGroups.set(parent, []);
                }
                parentGroups.get(parent).push(el);
            });

            // Apply staggered animation per parent group
            parentGroups.forEach((children) => {
                children.forEach((child, index) => {
                    const delay = child.getAttribute('data-delay') 
                        ? parseInt(child.getAttribute('data-delay'), 10) 
                        : index * 60; // Default 60ms stagger delay for siblings

                    setTimeout(() => {
                        child.classList.add('reveal-active');
                    }, delay);
                });
            });
        }
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px' // Trigger slightly before entering viewport
    });

    // Observe all selected elements
    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });
}

// Intersection Observer for number counters
function initCounterObserver() {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                animateCounter(el);
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.counter').forEach(el => {
        counterObserver.observe(el);
    });
}

// Slideshow for Section 4: Địa điểm tổ chức
function initDiaiemSlideshow() {
    const slides = document.querySelectorAll('#diaiem-slideshow .slide-img');
    const dots = document.querySelectorAll('.slide-dot');
    const progress = document.getElementById('slideshow-progress');
    if (slides.length === 0 || !progress) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds
    let timer;

    function resetProgressBar() {
        progress.style.transition = 'none';
        progress.style.width = '0%';
        progress.offsetHeight; // Force reflow
        progress.style.transition = `width ${slideInterval}ms linear`;
        progress.style.width = '100%';
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('opacity-0');
                slide.classList.add('opacity-100');
            } else {
                slide.classList.remove('opacity-100');
                slide.classList.add('opacity-0');
            }
        });

        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('bg-white', 'scale-125');
                dot.classList.remove('bg-white/50');
            } else {
                dot.classList.remove('bg-white', 'scale-125');
                dot.classList.add('bg-white/50');
            }
        });

        currentSlide = index;
        resetProgressBar();
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startTimer() {
        resetProgressBar();
        timer = setInterval(nextSlide, slideInterval);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopTimer();
            showSlide(index);
            timer = setInterval(nextSlide, slideInterval);
        });
    });

    startTimer();
}

// Map Modal Lightbox with Zoom and Pan
function initMapModal() {
    const trigger = document.getElementById('map-trigger');
    const modal = document.getElementById('map-modal');
    const closeBtn = document.getElementById('close-map-modal');
    const modalImg = document.getElementById('modal-map-img');
    const container = document.getElementById('modal-container');

    if (!trigger || !modal || !closeBtn || !modalImg || !container) return;

    let scale = 1;
    let isDragging = false;
    let startX = 0, startY = 0;
    let translateX = 0, translateY = 0;

    // Open Modal
    trigger.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
        document.body.style.overflow = 'hidden';
        resetZoom();
    });

    // Close Modal
    function closeModal() {
        modal.classList.add('opacity-0');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, 300);
    }

    closeBtn.addEventListener('click', closeModal);

    // Close on click outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === container) {
            closeModal();
        }
    });

    // Reset Zoom and Pan
    function resetZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }

    function updateTransform() {
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        if (scale > 1) {
            modalImg.classList.remove('cursor-zoom-in');
            modalImg.classList.add('cursor-zoom-out');
        } else {
            modalImg.classList.remove('cursor-zoom-out');
            modalImg.classList.add('cursor-zoom-in');
        }
    }

    // Zoom on wheel scroll
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.15;
        if (e.deltaY < 0) {
            scale = Math.min(scale + zoomSpeed, 4);
        } else {
            scale = Math.max(scale - zoomSpeed, 1);
            if (scale === 1) {
                translateX = 0;
                translateY = 0;
            }
        }
        updateTransform();
    }, { passive: false });

    // Double click to toggle zoom
    modalImg.addEventListener('dblclick', () => {
        if (scale > 1) {
            resetZoom();
        } else {
            scale = 2.5;
            updateTransform();
        }
    });

    // Drag to pan image when zoomed in
    container.addEventListener('mousedown', (e) => {
        if (scale <= 1) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support for mobile pinch and drag
    let initialDist = 0;
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        } else if (e.touches.length === 1 && scale > 1) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = dist / initialDist;
            scale = Math.max(1, Math.min(scale * factor, 4));
            initialDist = dist;
            updateTransform();
        } else if (e.touches.length === 1 && isDragging) {
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateTransform();
        }
    }, { passive: false });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Carousel for Section 10: Truyền thông quảng bá
function initMediaCarousel() {
    const slides = document.querySelectorAll('#media-carousel .media-slide');
    const dots = document.querySelectorAll('#media-carousel .media-dot');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds
    let timer;

    function showSlide(index) {
        // Remove active states
        slides.forEach(slide => {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0');
        });
        dots.forEach(dot => {
            dot.classList.remove('bg-white', 'w-4');
            dot.classList.add('bg-white/50', 'w-2');
        });

        // Set active states
        slides[index].classList.remove('opacity-0');
        slides[index].classList.add('opacity-100');
        if (dots[index]) {
            dots[index].classList.remove('bg-white/50', 'w-2');
            dots[index].classList.add('bg-white', 'w-4');
        }
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startTimer() {
        timer = setInterval(nextSlide, slideInterval);
    }

    function resetTimer() {
        clearInterval(timer);
        startTimer();
    }

    // Set first slide active
    showSlide(0);
    startTimer();

    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });
}

// Gallery Lightbox & Toggle for Section 11
function initGallery() {
    const btnToggle = document.getElementById('btn-toggle-gallery');
    const hiddenItems = document.querySelectorAll('.hidden-gallery-item');
    if (!btnToggle) return;

    let isExpanded = false;
    btnToggle.addEventListener('click', () => {
        isExpanded = !isExpanded;
        hiddenItems.forEach(item => {
            if (isExpanded) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        const spanText = btnToggle.querySelector('span');
        const svgIcon = btnToggle.querySelector('svg');
        if (isExpanded) {
            spanText.innerText = "Thu gọn";
            svgIcon.classList.add('rotate-180');
        } else {
            spanText.innerText = "Xem thêm hình ảnh (26 ảnh)";
            svgIcon.classList.remove('rotate-180');
            // Scroll back to gallery top smoothly so the user doesn't get lost
            document.getElementById('gallery-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Lightbox Logic
    const galleryItems = document.querySelectorAll('#gallery-grid > div');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const modalCaption = document.getElementById('gallery-modal-caption');
    const btnClose = document.getElementById('close-gallery-modal');
    const btnPrev = document.getElementById('prev-gallery-modal');
    const btnNext = document.getElementById('next-gallery-modal');

    if (!modal || !modalImg || !modalCaption) return;

    let currentImgIndex = 0;
    const imagesList = Array.from(galleryItems).map(item => item.querySelector('img').src);

    function openLightbox(index) {
        currentImgIndex = index;
        modalImg.src = imagesList[index];
        modalCaption.innerText = `${index + 1} / ${imagesList.length}`;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
    }

    function closeLightbox() {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, 300);
    }

    function nextImage() {
        currentImgIndex = (currentImgIndex + 1) % imagesList.length;
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.src = imagesList[currentImgIndex];
            modalCaption.innerText = `${currentImgIndex + 1} / ${imagesList.length}`;
            modalImg.style.opacity = '1';
        }, 150);
    }

    function prevImage() {
        currentImgIndex = (currentImgIndex - 1 + imagesList.length) % imagesList.length;
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.src = imagesList[currentImgIndex];
            modalCaption.innerText = `${currentImgIndex + 1} / ${imagesList.length}`;
            modalImg.style.opacity = '1';
        }, 150);
    }

    // Attach click events
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    if (btnNext) btnNext.addEventListener('click', nextImage);
    if (btnPrev) btnPrev.addEventListener('click', prevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Close on click outside image
    modal.addEventListener('click', (e) => {
        if (e.target === modal || (e.target.closest('.max-w-\\[90\\%\\]') === null && e.target !== btnPrev && e.target !== btnNext && !btnPrev.contains(e.target) && !btnNext.contains(e.target))) {
            closeLightbox();
        }
    });
}

// Navbar scroll transition logic (Glassmorphism past Hero)
function initNavbarScrollEffect() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    window.handleNavbarScroll = function() {
        const isMobileOpen = nav.classList.contains('mobile-menu-open');
        
        if (window.scrollY > 80 || isMobileOpen) {
            // Glassmorphic styling
            nav.classList.remove('bg-transparent', 'border-transparent', 'shadow-none');
            nav.classList.add('bg-white/80', 'backdrop-blur-md', 'shadow-md', 'border-gray-200/40');
        } else {
            // Transparent styling
            nav.classList.remove('bg-white/80', 'backdrop-blur-md', 'shadow-md', 'border-gray-200/40');
            nav.classList.add('bg-transparent', 'border-transparent', 'shadow-none');
        }
    };

    // Run once on load
    window.handleNavbarScroll();
    
    // Listen to scroll events
    window.addEventListener('scroll', window.handleNavbarScroll, { passive: true });
}

// Mobile sidebar initialization
function initMobileSidebar() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-sidebar-btn');
    const overlay = document.getElementById('mobile-sidebar-overlay');
    const sidebar = document.getElementById('mobile-sidebar');
    const nav = document.getElementById('main-nav');

    if (!menuBtn || !sidebar) return;

    function openSidebar() {
        sidebar.classList.remove('translate-x-full');
        if (overlay) {
            overlay.classList.remove('pointer-events-none', 'opacity-0');
            overlay.classList.add('opacity-100');
        }
        document.body.classList.add('overflow-hidden');
        if (nav) {
            nav.classList.add('mobile-menu-open');
            if (typeof window.handleNavbarScroll === 'function') {
                window.handleNavbarScroll();
            }
        }
    }

    function closeSidebar() {
        sidebar.classList.add('translate-x-full');
        if (overlay) {
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0', 'pointer-events-none');
        }
        document.body.classList.remove('overflow-hidden');
        if (nav) {
            nav.classList.remove('mobile-menu-open');
            if (typeof window.handleNavbarScroll === 'function') {
                window.handleNavbarScroll();
            }
        }
    }

    menuBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Dropdown accordion toggler
    window.toggleMobileDropdown = function(id) {
        const dropdown = document.getElementById(id);
        const arrow = document.getElementById('arrow-' + id);
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            if (arrow) {
                arrow.classList.toggle('rotate-180');
            }
        }
    };
}

// DomContentLoaded main initialization
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load components (Header / Footer / Sidebar Mobile)
    await loadComponent('app-header', 'components/navbar.html');
    await loadComponent('app-footer', 'components/footer.html');

    // Dynamically inject mobile sidebar wrapper to body if not present
    let sidebarContainer = document.getElementById('app-sidebar-mobile');
    if (!sidebarContainer) {
        sidebarContainer = document.createElement('div');
        sidebarContainer.id = 'app-sidebar-mobile';
        document.body.appendChild(sidebarContainer);
    }
    await loadComponent('app-sidebar-mobile', 'components/sidebar-mobile.html');

    // Initialize Mobile Sidebar right after header loading
    initMobileSidebar();

    // 2. Initialize observer components
    initGlobalScrollReveal();
    initCounterObserver();
    initDiaiemSlideshow();
    initMapModal();
    initMediaCarousel();
    initGallery();
    initNavbarScrollEffect();

    // Apply active language to loaded components
    window.setLanguage(currentLang);
});
