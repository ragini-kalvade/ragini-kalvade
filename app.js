document.addEventListener('DOMContentLoaded', () => {
    const introCard = document.querySelector('#intro-card .card');
    const viewBtn = document.getElementById('view-profile-btn');
    const introOverlay = document.getElementById('intro-card');
    const portfolio = document.getElementById('portfolio');
    const messageInput = document.getElementById('message-input');
    const messageForm = document.getElementById('message-form');

    // 1) Kick off the border (and trail) animation after typing finishes
    setTimeout(() => {
        introCard.classList.add('animate-init');
    }, 1500);

    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            introOverlay.classList.add('hidden');
            portfolio.classList.remove('hidden');
            window.requestAnimationFrame(() => {
                document.querySelectorAll('.block').forEach(block => {
                    if (isInViewport(block)) {
                        const isRight = block.classList.contains('portrait') ||
                            block.classList.contains('contact') ||
                            block.classList.contains('projects');

                        if (isRight) {
                            block.style.animation = 'slideInRight 0.8s ease forwards';
                        } else {
                            block.style.animation = 'slideInLeft 0.8s ease forwards';
                        }
                    }
                });
            });
        });
    }

    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (messageInput.value.trim() !== '') {
                const messageNotification = document.createElement('div');
                messageNotification.className = 'message-notification';
                messageNotification.textContent = 'Message sent!';
                introCard.appendChild(messageNotification);

                setTimeout(() => {
                    messageNotification.classList.add('fade-out');
                    setTimeout(() => messageNotification.remove(), 1000);
                }, 2000);

                messageInput.value = '';
            }
        });
    }

    const track = document.querySelector('.carousel-track');
    if (track) {
        const items = Array.from(track.children);
        let index = 0;
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');

        function updateCarousel() {
            const style = getComputedStyle(items[0]);
            const itemWidth = items[0].getBoundingClientRect().width
                + parseFloat(style.marginLeft || 0)
                + parseFloat(style.marginRight || 0);
            track.style.transform = `translateX(-${index * itemWidth}px)`;

            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === items.length - 1;
            prevBtn.style.opacity = index === 0 ? '0.5' : '1';
            nextBtn.style.opacity = index === items.length - 1 ? '0.5' : '1';
        }

        prevBtn.addEventListener('click', () => {
            index = Math.max(index - 1, 0);
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            index = Math.min(index + 1, items.length - 1);
            updateCarousel();
        });

        updateCarousel();
        let startX, moveX;
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener('touchmove', (e) => {
            moveX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', () => {
            if (startX - moveX > 50 && index < items.length - 1) {
                index++;
                updateCarousel();
            } else if (moveX - startX > 50 && index > 0) {
                index--;
                updateCarousel();
            }
        });
    }

    const modal = document.getElementById('project-modal');
    if (modal) {
        const titleEl = document.getElementById('modal-title');
        const descEl = document.getElementById('modal-desc');

        document.querySelectorAll('.carousel-item').forEach(item => {
            item.addEventListener('click', () => {
                titleEl.textContent = item.dataset.title;
                descEl.textContent = item.dataset.desc;
                modal.classList.remove('hidden');
            });
        });

        document.querySelector('.modal .close').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
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
});

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

function adjustMainContentPadding() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const navHeight = sidebar.offsetHeight;
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.paddingTop = (navHeight + 10) + 'px';
        }

        // Also update section scroll margins
        document.querySelectorAll('section').forEach(section => {
            section.style.scrollMarginTop = (navHeight + 10) + 'px';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    adjustMainContentPadding();

    const blocks = document.querySelectorAll('.block');

    blocks.forEach(block => {
        if (isInViewport(block)) {
            block.style.animation = 'none'; // Remove animation
            block.style.opacity = '1'; // Make visible
            block.style.transform = 'translateX(0)'; // Reset position
        }
    });

    window.addEventListener('scroll', function() {
        blocks.forEach(block => {
            if (isInViewport(block) && block.style.opacity !== '1') {
                // Determine if block should slide from left or right
                const isRight = block.classList.contains('portrait') ||
                    block.classList.contains('contact') ||
                    block.classList.contains('projects');

                if (isRight) {
                    block.style.animation = 'slideInRight 0.8s ease forwards';
                } else {
                    block.style.animation = 'slideInLeft 0.8s ease forwards';
                }
            }
        });
    });

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
});

window.addEventListener('resize', adjustMainContentPadding);

const menuButton = document.getElementById('mobile-menu-button');
if (menuButton) {
    const navMenu = document.querySelector('.sidebar nav');
    menuButton.addEventListener('click', () => {
        navMenu.classList.toggle('show-mobile-menu');

        setTimeout(adjustMainContentPadding, 300);
    });
}

function initSkillsCarousel() {
    const carouselContainer = document.querySelector('.skills-carousel-container');
    if (!carouselContainer) return;

    const categories = Array.from(carouselContainer.querySelectorAll('.skill-category'));
    let currentIndex = 0;
    const totalCategories = categories.length;

    // Initially hide all categories except the first one
    categories.forEach((category, index) => {
        if (index !== 0) {
            category.classList.add('hidden-category');
        } else {
            category.classList.add('active-category');
        }
    });

    // Update indicators
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
    let autoRotateInterval = setInterval(nextCategory, 3600);
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoRotateInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(nextCategory, 3600);
    });

    const prevBtn = document.querySelector('.skills-carousel-prev');
    const nextBtn = document.querySelector('.skills-carousel-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentIndex - 1 + totalCategories) % totalCategories;
            goToCategory(prevIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextCategory();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSkillsCarousel();
});