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

// DomContentLoaded main initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load components (Header / Footer)
    loadComponent('app-header', 'components/navbar.html');
    loadComponent('app-footer', 'components/footer.html');

    // 2. Initialize observer components
    initGlobalScrollReveal();
    initCounterObserver();
    initDiaiemSlideshow();
});
