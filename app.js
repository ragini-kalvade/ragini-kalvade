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
