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

    // function goToCategory(index) {
    //     if (index === currentIndex) return;
    //
    //     categories[currentIndex].classList.remove('active-category');
    //     categories[currentIndex].classList.add('hidden-category');
    //
    //     const indicators = document.querySelectorAll('.carousel-indicator');
    //     if (indicators[currentIndex]) {
    //         indicators[currentIndex].classList.remove('active');
    //     }
    //
    //     currentIndex = index;
    //     categories[currentIndex].classList.remove('hidden-category');
    //     categories[currentIndex].classList.add('active-category');
    //
    //     if (indicators[currentIndex]) {
    //         indicators[currentIndex].classList.add('active');
    //     }
    // }
    //
    // function nextCategory() {
    //     let nextIndex = (currentIndex + 1) % totalCategories;
    //     goToCategory(nextIndex);
    // }
    //
    // function prevCategory() {
    //     let prevIndex = (currentIndex - 1 + totalCategories) % totalCategories;
    //     goToCategory(prevIndex);
    // }

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

// Fixed Experience Section JavaScript - Replace the experience-related code in app.js

document.addEventListener("DOMContentLoaded", function() {
    // Initialize all functions
    initializeAnimations();
    initializeNavigation();
    initializeTypewriter();
    initializeSkillsCarousel();
    initializeInteractions();
    initializeAOS();
    initializeExperience(); // Add this line

    window.addEventListener('resize', adjustMainContentPadding);
});

function initializeExperience() {
    const container = document.getElementById('experience-timeline');
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.timeline-item'));
    const chevron = document.getElementById('scroll-chevron');

    if (!items.length) return;

    let currentIndex = 0;

    // Create and setup timeline vertical line
    function setupTimelineLine() {
        let line = container.querySelector('.timeline-vertical-line');
        if (!line) {
            line = document.createElement('div');
            line.className = 'timeline-vertical-line';
            container.insertBefore(line, container.firstChild);
        }

        // Calculate total height needed for the line
        const totalHeight = items.reduce((height, item) => {
            return height + item.offsetHeight + 20; // 20px for margin-bottom
        }, 0);

        line.style.height = Math.max(totalHeight, container.scrollHeight) + "px";
    }

    // Initialize timeline items visibility
    function initializeItems() {
        items.forEach((item, index) => {
            item.classList.remove('active', 'next-glimpse', 'visible');
            if (index === 0) {
                item.classList.add('active', 'visible');
            } else if (index === 1) {
                item.classList.add('next-glimpse');
            }
        });
    }

    // Update active timeline item based on scroll position
    function updateActiveItem() {
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;

        let closestIndex = 0;
        let minDistance = Infinity;

        items.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.top + itemRect.height / 2;
            const distance = Math.abs(itemCenter - containerCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        // Only update if the active item has changed
        if (closestIndex !== currentIndex) {
            setActiveItem(closestIndex);
        }
    }

    // Set specific item as active
    function setActiveItem(index) {
        if (index < 0 || index >= items.length) return;

        // Clear all states
        items.forEach(item => {
            item.classList.remove('active', 'next-glimpse', 'visible');
        });

        // Set active item
        currentIndex = index;
        items[currentIndex].classList.add('active', 'visible');

        // Set visible items (current and adjacent)
        if (currentIndex > 0) {
            items[currentIndex - 1].classList.add('visible');
        }
        if (currentIndex < items.length - 1) {
            items[currentIndex + 1].classList.add('visible', 'next-glimpse');
        }
    }

    // Smooth scroll to specific item
    function scrollToItem(index) {
        if (index < 0 || index >= items.length) return;

        const item = items[index];
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        // Calculate scroll position to center the item
        const scrollTop = container.scrollTop +
            (itemRect.top - containerRect.top) -
            (containerRect.height / 2) +
            (itemRect.height / 2);

        container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }

    // Update chevron visibility
    function updateChevron() {
        if (!chevron) return;

        const isAtBottom = Math.abs(
            container.scrollTop + container.clientHeight - container.scrollHeight
        ) < 10;

        const hasOverflow = container.scrollHeight > container.clientHeight + 5;

        if (isAtBottom || !hasOverflow) {
            chevron.style.display = "none";
        } else {
            chevron.style.display = "block";
        }
    }

    // Handle wheel events for smooth navigation
    function handleWheel(e) {
        if (container.scrollHeight <= container.clientHeight + 5) return;

        e.preventDefault();

        const delta = Math.sign(e.deltaY);
        let nextIndex = Math.max(0, Math.min(items.length - 1, currentIndex + delta));

        if (nextIndex !== currentIndex) {
            scrollToItem(nextIndex);
        }
    }

    // Handle keyboard navigation
    function handleKeydown(e) {
        if (!['ArrowDown', 'ArrowUp', 'Space'].includes(e.key)) return;

        e.preventDefault();

        let nextIndex = currentIndex;
        if (e.key === 'ArrowDown' || e.key === 'Space') {
            nextIndex = Math.min(items.length - 1, currentIndex + 1);
        } else if (e.key === 'ArrowUp') {
            nextIndex = Math.max(0, currentIndex - 1);
        }

        if (nextIndex !== currentIndex) {
            scrollToItem(nextIndex);
        }
    }

    // Add hover effects to timeline items
    function addHoverEffects() {
        items.forEach(item => {
            const leftPanel = item.querySelector('.left-panel');
            const rightPanel = item.querySelector('.right-panel');
            const dot = item.querySelector('.timeline-dot');

            item.addEventListener('mouseenter', () => {
                if (leftPanel) {
                    leftPanel.style.transform = 'translateY(-5px) scale(1.02)';
                    leftPanel.style.transition = 'transform 0.3s ease';
                }
                if (rightPanel) {
                    rightPanel.style.transform = 'translateY(-5px) scale(1.02)';
                    rightPanel.style.transition = 'transform 0.3s ease';
                }
                if (dot) {
                    dot.style.transform = 'scale(1.3)';
                    dot.style.transition = 'transform 0.3s ease';
                }
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
                }
            });

            // Add click handler for project links
            const projectLink = item.querySelector('.right-panel a');
            if (projectLink) {
                projectLink.addEventListener('click', (e) => {
                    // Add visual feedback
                    projectLink.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        projectLink.style.transform = '';
                    }, 150);
                });
            }
        });
    }

    // Initialize everything
    function initialize() {
        setupTimelineLine();
        initializeItems();
        addHoverEffects();
        updateChevron();

        // Scroll to first item after a brief delay
        setTimeout(() => {
            scrollToItem(0);
        }, 100);
    }

    // Event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('keydown', handleKeydown);
    container.addEventListener('scroll', () => {
        updateActiveItem();
        updateChevron();
    });

    // Handle window resize
    const resizeObserver = new ResizeObserver(() => {
        setupTimelineLine();
        updateChevron();
    });
    resizeObserver.observe(container);

    // Make container focusable for keyboard navigation
    container.setAttribute('tabindex', '0');

    // Initialize on load
    initialize();

    // Re-initialize after fonts and images load
    window.addEventListener('load', () => {
        setTimeout(initialize, 200);
    });
}

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

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            // Add active to selected
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });
});

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

