document.addEventListener('DOMContentLoaded', () => {

    initializeAnimations();
    initializeNavigation();
    initializeTypewriter();
    initializeSkillsCarousel();
    initializeInteractions();
    initializeAOS();

    window.addEventListener('resize', adjustMainContentPadding);
});


function initializeAnimations() {
    const header = document.querySelector(".main-header");
    if (header) {
        setTimeout(() => {
            header.style.opacity = "1";
            header.style.transform = "translateY(0)";
        }, 100);
    }

    const blocks = document.querySelectorAll(".block");
    blocks.forEach((block, index) => {

        if (isInViewport(block)) {
            setTimeout(() => {
                animateBlock(block);
            }, index * 100);
        }
    });

    setupScrollAnimations();
}

function initializeNavigation() {

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Mobile menu handling
    const hamburger = document.getElementById("hamburger");
    const navbar = document.getElementById("navbar");
    if (hamburger && navbar) {
        hamburger.addEventListener("click", () => {
            navbar.classList.toggle("active");
            hamburger.classList.toggle("open");
        });
    }

    // Mobile menu button
    const menuButton = document.getElementById('mobile-menu-button');
    if (menuButton) {
        const navMenu = document.querySelector('.sidebar nav');
        if (navMenu) {
            menuButton.addEventListener('click', () => {
                navMenu.classList.toggle('show-mobile-menu');
                setTimeout(adjustMainContentPadding, 300);
            });
        }
    }
}

function initializeTypewriter() {
    const typewriterTarget = document.getElementById("typewriter");
    if (typewriterTarget && typeof Typewriter !== 'undefined') {
        new Typewriter(typewriterTarget, {
            strings: [
                "Computer Scientist.",
                "Software Engineer.",
                "Programmer.",
                "Cloud Engineer.",
            ],
            autoStart: true,
            loop: true,
            delay: 75,
        });
    }
}

function initializeSkillsCarousel() {
    const carouselContainer = document.querySelector('.skills-carousel-container');
    if (!carouselContainer) return;

    const categories = Array.from(carouselContainer.querySelectorAll('.skill-category'));
    let currentIndex = 0;
    const totalCategories = categories.length;

    if (totalCategories === 0) return;

    categories.forEach((category, index) => {
        if (index !== 0) {
            category.classList.add('hidden-category');
            category.classList.remove('active-category');
        } else {
            category.classList.add('active-category');
            category.classList.remove('hidden-category');
        }
    });

    const indicators = document.querySelector('.carousel-indicators');
    if (indicators) {
        indicators.innerHTML = '';

        for (let i = 0; i < totalCategories; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');

            indicator.addEventListener('click', () => {
                goToCategory(i);
            });

            indicators.appendChild(indicator);
        }
    }

    function goToCategory(index) {
        if (index === currentIndex) return;

        categories[currentIndex].classList.remove('active-category');
        categories[currentIndex].classList.add('hidden-category');

        const indicators = document.querySelectorAll('.carousel-indicator');
        if (indicators[currentIndex]) {
            indicators[currentIndex].classList.remove('active');
        }

        currentIndex = index;
        categories[currentIndex].classList.remove('hidden-category');
        categories[currentIndex].classList.add('active-category');

        if (indicators[currentIndex]) {
            indicators[currentIndex].classList.add('active');
        }
    }

    function nextCategory() {
        let nextIndex = (currentIndex + 1) % totalCategories;
        goToCategory(nextIndex);
    }

    function prevCategory() {
        let prevIndex = (currentIndex - 1 + totalCategories) % totalCategories;
        goToCategory(prevIndex);
    }

    let autoRotateInterval = setInterval(nextCategory, 4000);

    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoRotateInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(nextCategory, 4000);
    });

    const prevBtn = document.querySelector('.skills-carousel-prev');
    const nextBtn = document.querySelector('.skills-carousel-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', prevCategory);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextCategory);
    }
}

function initializeInteractions() {
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = 'rgba(0,0,0,0.03)';
            item.style.borderRadius = '4px';
            item.style.transition = 'background-color 0.3s';
        });

        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });
    });

    adjustMainContentPadding();
}

function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            duration: 800,
            offset: 150
        });
    }
}

function setupScrollAnimations() {
    const blocks = document.querySelectorAll('.block');

    function checkScrollAnimations() {
        blocks.forEach(block => {
            if (isInViewport(block) && !block.classList.contains('animated')) {
                animateBlock(block);
                block.classList.add('animated');
            }
        });
    }

    window.addEventListener('scroll', checkScrollAnimations);
    checkScrollAnimations();
}
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0 &&
        rect.left >= 0 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function animateBlock(block) {
    const isRight = block.classList.contains('portrait') ||
        block.classList.contains('contact') ||
        block.classList.contains('projects') ||
        block.classList.contains('skills');

    if (isRight) {
        block.style.animation = 'slideInRight 0.8s ease forwards';
    } else {
        block.style.animation = 'slideInLeft 0.8s ease forwards';
    }

    setTimeout(() => {
        block.style.opacity = '1';
        block.style.transform = 'translateX(0)';
    }, 800);
}

function adjustMainContentPadding() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const navHeight = sidebar.offsetHeight;
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.paddingTop = (navHeight + 10) + 'px';
        }
        document.querySelectorAll('section').forEach(section => {
            section.style.scrollMarginTop = (navHeight + 10) + 'px';
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 60;
        const sectionHeight = section.offsetHeight;
        const id = section.getAttribute("id");

        const navLink = document.querySelector(`nav a[href="#${id}"]`);
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add("active");
            } else {
                navLink.classList.remove("active");
            }
        }
    });
});

// Enhanced Experience Section JavaScript
function initializeEnhancedExperience() {
    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const experienceSection = document.querySelector('.experience-section');

    // Enhanced intersection observer with better thresholds
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '-50px 0px -50px 0px'
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on item position
                setTimeout(() => {
                    entry.target.classList.add('visible');

                    // Add ripple effect to timeline dot
                    const dot = entry.target.querySelector('.timeline-dot');
                    if (dot) {
                        createRippleEffect(dot);
                    }
                }, index * 200);
            }
        });
    }, observerOptions);

    // Observe all timeline items
    timelineItems.forEach(item => {
        timelineObserver.observe(item);

        // Add hover effects
        addTimelineItemHoverEffects(item);
    });

    // Progressive disclosure animation
    if (experienceSection) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    animateTimelineSpine();
                }
            });
        }, { threshold: 0.1 });

        sectionObserver.observe(experienceSection);
    }

    // Initialize timeline controls if they exist
    initializeTimelineControls();
}

function addTimelineItemHoverEffects(item) {
    const leftPanel = item.querySelector('.left-panel');
    const rightPanel = item.querySelector('.right-panel');
    const dot = item.querySelector('.timeline-dot');

    // Add mouse enter/leave effects
    item.addEventListener('mouseenter', () => {
        // Scale effect for panels
        if (leftPanel) {
            leftPanel.style.transform = 'translateY(-5px) scale(1.02)';
        }
        if (rightPanel) {
            rightPanel.style.transform = 'translateY(-5px) scale(1.02)';
        }

        // Enhanced dot animation
        if (dot) {
            dot.style.transform = 'scale(1.3)';
            dot.style.boxShadow = '0 0 0 8px rgba(132, 232, 255, 0.4), 0 8px 32px rgba(0, 44, 221, 0.3)';
        }

        // Add floating animation
        item.classList.add('timeline-item-hover');
    });

    item.addEventListener('mouseleave', () => {
        if (leftPanel) {
            leftPanel.style.transform = '';
        }
        if (rightPanel) {
            rightPanel.style.transform = '';
        }

        if (dot) {
            dot.style.transform = '';
            dot.style.boxShadow = '';
        }

        item.classList.remove('timeline-item-hover');
    });

    // Add click effects for project links
    const projectLink = item.querySelector('.right-panel a');
    if (projectLink) {
        projectLink.addEventListener('click', (e) => {
            createClickRipple(e, projectLink);
        });
    }
}

function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(132, 232, 255, 0.6);
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.8s ease-out;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin-top: -20px;
        margin-left: -20px;
        z-index: -1;
    `;

    element.style.position = 'relative';
    element.appendChild(ripple);

    // Remove the ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 800);
}

function createClickRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        pointer-events: none;
        transform: scale(0);
        animation: clickRipple 0.6s ease-out;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        z-index: 1000;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

function animateTimelineSpine() {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    const spine = timelineContainer.querySelector('::before');

    // Create animated gradient effect for the spine
    let gradientPosition = 0;
    const animateGradient = () => {
        gradientPosition += 2;
        if (gradientPosition > 200) gradientPosition = -100;

        timelineContainer.style.setProperty('--gradient-position', `${gradientPosition}%`);
        requestAnimationFrame(animateGradient);
    };

    animateGradient();
}

function initializeTimelineControls() {
    // Auto-scroll functionality for timeline
    let isAutoScrolling = false;
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Optional: Add auto-scroll through timeline items
    function autoScrollTimeline() {
        if (isAutoScrolling || timelineItems.length === 0) return;

        isAutoScrolling = true;
        let currentIndex = 0;

        const scrollToItem = () => {
            if (currentIndex < timelineItems.length) {
                timelineItems[currentIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                currentIndex++;
                setTimeout(scrollToItem, 3000); // 3 second intervals
            } else {
                isAutoScrolling = false;
            }
        };

        setTimeout(scrollToItem, 1000); // Start after 1 second
    }

    // Add progress indicator
    createTimelineProgress();
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#experience-timeline');
    const items = container.querySelectorAll('.timeline-item');
    const observerOptions = {
        root: container,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                items.forEach(item => item.classList.remove('visible'));
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    items.forEach(item => observer.observe(item));
});

function createTimelineProgress() {
    const experienceSection = document.querySelector('.experience-section');
    if (!experienceSection) return;

    const progressContainer = document.createElement('div');
    progressContainer.className = 'timeline-progress';
    progressContainer.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 8px;
        z-index: 10;
    `;

    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item, index) => {
        const progressDot = document.createElement('div');
        progressDot.className = 'progress-dot';
        progressDot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(132, 232, 255, 0.3);
            border: 2px solid rgba(0, 44, 221, 0.5);
            transition: all 0.3s ease;
            cursor: pointer;
        `;

        progressDot.addEventListener('click', () => {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });

        // Update progress dot when item becomes visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressDot.style.background = 'var(--color-accent)';
                    progressDot.style.borderColor = 'var(--color-primary)';
                    progressDot.style.transform = 'scale(1.2)';
                } else {
                    progressDot.style.background = 'rgba(132, 232, 255, 0.3)';
                    progressDot.style.borderColor = 'rgba(0, 44, 221, 0.5)';
                    progressDot.style.transform = 'scale(1)';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(item);
        progressContainer.appendChild(progressDot);
    });

    experienceSection.appendChild(progressContainer);
}

// Add required CSS animations
function addEnhancedAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes clickRipple {
            to {
                transform: scale(1);
                opacity: 0;
            }
        }
        
        .timeline-item-hover {
            animation: gentle-float 2s ease-in-out infinite;
        }
        
        @keyframes gentle-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
        }
        
        .section-visible {
            animation: section-fade-in 1s ease-out forwards;
        }
        
        @keyframes section-fade-in {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .timeline-progress:hover .progress-dot {
            transform: scale(1.1);
        }
    `;

    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addEnhancedAnimations();
    initializeEnhancedExperience();
});

// Export functions for use in main app.js
window.enhancedExperience = {
    initializeEnhancedExperience,
    addTimelineItemHoverEffects,
    createRippleEffect,
    animateTimelineSpine
};
