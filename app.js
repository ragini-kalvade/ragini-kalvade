document.addEventListener('DOMContentLoaded', () => {
    // Remove any leftover mobile overlay elements that might cause camera modal issues
    const existingOverlays = document.querySelectorAll('.mobile-overlay');
    existingOverlays.forEach(overlay => overlay.remove());
    
    // Ensure body overflow is reset
    document.body.style.overflow = '';

    initializeDarkMode();
    initializeAnimations();
    initializeNavigation();
    initializeTypewriter();
    initializeSkillsCarousel();
    initializeInteractions();
    initializeAOS();
    initializeExperience();
    initializeExperienceTabs();

    window.addEventListener('resize', adjustMainContentPadding);
    
    // Handle browser back navigation to prevent camera modal issues
    window.addEventListener('popstate', () => {
        // Remove any mobile overlays that might appear after back navigation
        const overlays = document.querySelectorAll('.mobile-overlay');
        overlays.forEach(overlay => overlay.remove());
        
        // Reset body overflow
        document.body.style.overflow = '';
        
        // Remove any active mobile menu classes
        const navCenter = document.querySelector('.nav-center');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navCenter) navCenter.classList.remove('active');
        if (mobileToggle) mobileToggle.classList.remove('active');
    });
    
    // Handle page visibility changes to prevent camera modal issues
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page became visible, clean up any leftover overlays
            const overlays = document.querySelectorAll('.mobile-overlay');
            overlays.forEach(overlay => overlay.remove());
            
            // Reset body overflow
            document.body.style.overflow = '';
        }
    });
});

// Dark Mode Toggle Functionality
function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the theme immediately (before page renders)
    htmlElement.setAttribute('data-theme', currentTheme);
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add ripple effect
        themeToggle.classList.add('ripple');
        setTimeout(() => {
            themeToggle.classList.remove('ripple');
        }, 600);
        
        // Update theme
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Optional: Log for debugging
        console.log(`Theme switched to: ${newTheme}`);
    }
    
    // Add click event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Add keyboard support
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
    
    // Check system preference on first visit
    if (!localStorage.getItem('theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
        }
    });
}

function initializeAnimations() {
    const header = document.querySelector(".main-header");
    if (header) {
        setTimeout(() => {
            header.style.opacity = "1";
            header.style.transform = "translateY(0)";
        }, 100);
    }

    // Animate all blocks on startup
    const blocks = document.querySelectorAll(".block");
    blocks.forEach((block, index) => {
            setTimeout(() => {
                animateBlock(block);
        }, 300 + (index * 200)); // Stagger the animations
    });

    setupScrollAnimations();
}

function initializeNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        // Set initial active state
        updateActiveNavLink();
        
        // Update on scroll with throttling for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveNavLink();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Update on hash change
        window.addEventListener('hashchange', updateActiveNavLink);
        
        // Add smooth scroll behavior for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const headerOffset = 100; // Account for sticky header
                        const elementPosition = targetSection.offsetTop;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update URL without jumping
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });
    }
    
    function updateActiveNavLink() {
        let current = '';
        const scrollPosition = window.pageYOffset + 150; // Account for sticky header

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                current = sectionId;
            }
        });

        // If at the very top, highlight home
        if (window.pageYOffset < 100) {
            current = 'hero';
        }

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Mobile menu handling
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const navCenter = document.querySelector(".nav-center");
    
    if (mobileMenuToggle && navCenter) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(overlay);

        mobileMenuToggle.addEventListener("click", () => {
            navCenter.classList.toggle("active");
            mobileMenuToggle.classList.toggle("active");
            
            if (navCenter.classList.contains("active")) {
                overlay.style.opacity = "1";
                overlay.style.visibility = "visible";
                document.body.style.overflow = "hidden";
            } else {
                overlay.style.opacity = "0";
                overlay.style.visibility = "hidden";
                document.body.style.overflow = "";
            }
        });

        // Close menu when clicking overlay
        overlay.addEventListener("click", () => {
            navCenter.classList.remove("active");
            mobileMenuToggle.classList.remove("active");
            overlay.style.opacity = "0";
            overlay.style.visibility = "hidden";
            document.body.style.overflow = "";
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navCenter.classList.remove("active");
                mobileMenuToggle.classList.remove("active");
                overlay.style.opacity = "0";
                overlay.style.visibility = "hidden";
                document.body.style.overflow = "";
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navCenter.classList.contains("active")) {
                navCenter.classList.remove("active");
                mobileMenuToggle.classList.remove("active");
                overlay.style.opacity = "0";
                overlay.style.visibility = "hidden";
                document.body.style.overflow = "";
            }
        });
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
            once: false,
            duration: 800,
            offset: 150,
            easing: 'ease-in-out',
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
    // Mark block as animated
    block.classList.add('animated');
    
    const isRight = block.classList.contains('portrait') ||
        block.classList.contains('contact') ||
        block.classList.contains('projects') ||
        block.classList.contains('skills');

    if (isRight) {
        block.style.animation = 'slideInRight 0.8s ease forwards';
    } else {
        block.style.animation = 'slideInLeft 0.8s ease forwards';
    }

    // Ensure block is visible
    setTimeout(() => {
        block.style.opacity = '1';
        block.style.transform = 'translateX(0)';
    }, 100);
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

// Navigation active state is now handled in initializeNavigation() function

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

// Initialize experience section on startup

function initializeExperience() {
    // This function is for timeline-based experience (not used in current HTML)
    // The actual experience section uses tabs, handled by initializeExperienceTabs()
    console.log('Experience section initialized');
}

function initializeExperienceTabs() {
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");

    if (tabs.length === 0 || contents.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            // Add active to selected
            tab.classList.add("active");
            const targetId = tab.dataset.tab;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });

    // Ensure first tab is active on load
    if (tabs.length > 0 && contents.length > 0) {
        tabs[0].classList.add("active");
        contents[0].classList.add("active");
    }
}

// Old timeline code removed - not needed for current tabbed experience section

// Enhanced intersection observer for better performance
function initializeTimelineObserver() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timelineItems.length) return;

    const observerOptions = {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: '-20% 0px -20% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                entry.target.classList.add('in-view');

                // Add staggered animation to panels
                const leftPanel = entry.target.querySelector('.left-panel');
                const rightPanel = entry.target.querySelector('.right-panel');

                if (leftPanel) {
                    setTimeout(() => {
                        leftPanel.style.opacity = '1';
                        leftPanel.style.transform = 'translateY(0)';
                    }, 100);
                }

                if (rightPanel) {
                    setTimeout(() => {
                        rightPanel.style.opacity = '1';
                        rightPanel.style.transform = 'translateY(0)';
                    }, 100);
                }
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => observer.observe(item));
}

// Call this function as well
document.addEventListener('DOMContentLoaded', initializeTimelineObserver);

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("experience-timeline");
    const items = Array.from(container.querySelectorAll(".timeline-item"));

    // Intersection Observer for scroll-based animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const item = entry.target;
                item.classList.toggle("active", entry.isIntersecting);
                item.classList.toggle("in-view", entry.isIntersecting);

                const next = item.nextElementSibling;
                if (next && next.classList.contains("timeline-item")) {
                    next.classList.add("next-glimpse");
                }

                if (!entry.isIntersecting) {
                    item.classList.remove("active", "in-view", "next-glimpse");
                }
            });
        },
        {
            root: container,
            threshold: 0.6,
        }
    );

    items.forEach((item) => observer.observe(item));

    // Chevron scroll logic
    const chevron = document.getElementById("scroll-chevron");
    chevron.addEventListener("click", () => {
        const current = items.find((item) => item.classList.contains("active"));
        const index = items.indexOf(current);
        const nextItem = items[index + 1];
        if (nextItem) {
            nextItem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });

    // Lazy load logos
    const lazyImages = document.querySelectorAll(".company-logo");
    lazyImages.forEach((img) => {
        img.setAttribute("loading", "lazy");
    });
});

// Tab initialization moved to initializeExperienceTabs() function above

document.addEventListener('DOMContentLoaded', () => {
    const user = 'ragini-kalvade';
    // Fetch repo count
    fetch(`https://api.github.com/users/${user}`)
    .then(res => res.json())
    .then(u => {
    document.getElementById('gh-repos').textContent = u.public_repos;
});
    // Fetch stars & forks across all repos
    fetch(`https://api.github.com/users/${user}/repos?per_page=100`)
    .then(res => res.json())
    .then(repos => {
    let stars = 0, forks = 0;
    repos.forEach(r => { stars += r.stargazers_count; forks += r.forks_count; });
    document.getElementById('gh-stars').textContent = stars;
    document.getElementById('gh-forks').textContent = forks;
});
});

document.addEventListener("DOMContentLoaded", () => {
    const collabList = document.getElementById("collabList");
    const buttons = [...collabList.querySelectorAll(".collab-btn")];
    const pointer = document.getElementById("collabPointer");

    // // Scatter the buttons randomly
    // buttons.forEach(btn => {
    //     const x = Math.random() * (collabList.clientWidth - 50); // prevent overflow
    //     const y = Math.random() * (collabList.clientHeight - 300);
    //     btn.style.left = `${x}px`;
    //     btn.style.top = `${y}px`;
    // });

    // Animate the pointer to hover randomly
    let currentIndex = 0;
    function movePointerRandomly() {
        const randomIndex = Math.floor(Math.random() * buttons.length);
        const targetBtn = buttons[randomIndex];
        const rect = targetBtn.getBoundingClientRect();
        const listRect = collabList.getBoundingClientRect();

        pointer.style.left = `${rect.left - listRect.left - 30}px`;
        pointer.style.top = `${rect.top - listRect.top + rect.height / 2}px`;

        // Add hover style temporarily
        buttons.forEach(btn => btn.classList.remove("hovered"));
        targetBtn.classList.add("hovered");
    }

    setInterval(movePointerRandomly, 1500);
});


document.addEventListener("DOMContentLoaded", () => {
    const mousePointer = document.getElementById("mouse-pointer");
    const options = document.querySelectorAll(".collab-option");

    function randomHover() {
        if (!options.length) return;
        const option = options[Math.floor(Math.random() * options.length)];
        const rect = option.getBoundingClientRect();

        mousePointer.style.left = `${rect.left + 10}px`;
        mousePointer.style.top = `${rect.top + 10 + window.scrollY}px`;

        option.classList.add("hovered");
        setTimeout(() => option.classList.remove("hovered"), 700);
    }

    setInterval(randomHover, 2000);
});

const pointer = document.getElementById("collabPointer");

function movePointerTo(target) {
    const rect = target.getBoundingClientRect();
    const listRect = collabList.getBoundingClientRect();

    const pointerX = target.offsetLeft - 30;
    const pointerY = target.offsetTop + target.offsetHeight / 2 - 10;

    pointer.style.left = `${pointerX}px`;
    pointer.style.top = `${pointerY}px`;
}


