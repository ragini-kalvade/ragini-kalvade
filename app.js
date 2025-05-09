document.addEventListener('DOMContentLoaded', () => {
    const introCard = document.querySelector('#intro-card .card');
    const viewBtn = document.querySelector('#view-profile-btn');
    const introOverlay = document.getElementById('intro-card');
    const portfolio = document.getElementById('portfolio');
    const messageInput = document.getElementById('message-input');
    const messageForm = document.getElementById('message-form');

    // 1) Kick off the border (and trail) animation after typing finishes
    setTimeout(() => {
        introCard.classList.add('animate-init');
    }, 1500);

    // 2) Reveal portfolio on button click
    viewBtn.addEventListener('click', () => {
        introCard.classList.add('hidden');
        introOverlay.classList.add('hidden');
        portfolio.classList.remove('hidden');
    });

    // 3) Handle message form submission
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

    // 5) Carousel logic
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

            // Update button states
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

        // Initialize carousel
        updateCarousel();

        // Add touch support for mobile
        let startX, moveX;
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener('touchmove', (e) => {
            moveX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', () => {
            if (startX - moveX > 50 && index < items.length - 1) {
                // Swipe left
                index++;
                updateCarousel();
            } else if (moveX - startX > 50 && index > 0) {
                // Swipe right
                index--;
                updateCarousel();
            }
        });
    }

    // 6) Modal for project details
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

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // 7) Smooth scrolling for navigation
    document.querySelectorAll('.sidebar a').forEach(link => {
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

    // 8) Add scroll event listener to highlight active menu item
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar a');

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

function adjustMainContentPadding() {
    const navHeight = document.querySelector('.sidebar').offsetHeight;
    document.querySelector('.main-content').style.paddingTop = (navHeight + 10) + 'px';

    // Also update section scroll margins
    document.querySelectorAll('section').forEach(section => {
        section.style.scrollMarginTop = (navHeight + 10) + 'px';
    });
}

adjustMainContentPadding();

// Run on window resize
window.addEventListener('resize', adjustMainContentPadding);

// Mobile navigation toggle (optional)
const menuButton = document.getElementById('mobile-menu-button');
if (menuButton) {
    const navMenu = document.querySelector('.sidebar nav');
    menuButton.addEventListener('click', () => {
        navMenu.classList.toggle('show-mobile-menu');

        // Update main content padding after toggle
        setTimeout(adjustMainContentPadding, 300);
    });
}