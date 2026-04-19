// RK Systems portfolio interactions

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initActiveNav();
    initRotatingWords();
    initSkillTabs();
    initExperienceTabs();
    initArchiveStaggerReveal();
});

function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        const icon = toggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = menu.classList.contains('open') ? 'close' : 'menu';
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            const icon = toggle.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = 'menu';
        });
    });
}

function initActiveNav() {
    const links = document.querySelectorAll('.nav-link');
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!links.length || !sections.length) return;

    const setActive = id => {
        links.forEach(l => {
            const match = l.getAttribute('href') === `#${id}`;
            l.classList.toggle('active', match);
        });
    };

    const onScroll = () => {
        const y = window.scrollY + 120;
        let current = sections[0].id;
        for (const s of sections) {
            if (s.offsetTop <= y) current = s.id;
        }
        setActive(current);
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            onScroll();
            ticking = false;
        });
    });
    onScroll();
}

function initRotatingWords() {
    const words = document.querySelectorAll('.rotating-word');
    if (words.length < 2) return;
    let idx = 0;
    setInterval(() => {
        words[idx].classList.remove('active');
        idx = (idx + 1) % words.length;
        words[idx].classList.add('active');
    }, 2600);
}

function initSkillTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const panels = document.querySelectorAll('.skill-panel');
    if (!tabs.length || !panels.length) return;

    const activeClasses = ['bg-primary/10', 'text-primary', 'border-primary/30'];
    const idleClasses = ['bg-surface-container-highest', 'text-on-surface-variant', 'border-outline-variant/15'];

    const activate = key => {
        tabs.forEach(t => {
            const on = t.dataset.tab === key;
            activeClasses.forEach(c => t.classList.toggle(c, on));
            idleClasses.forEach(c => t.classList.toggle(c, !on));
        });
        panels.forEach(p => {
            p.classList.toggle('active', p.id === `panel-${key}`);
        });
    };

    tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));

    let idx = 0;
    const keys = Array.from(tabs).map(t => t.dataset.tab);
    let autoTimer = setInterval(() => {
        idx = (idx + 1) % keys.length;
        activate(keys[idx]);
    }, 5000);

    const wrapper = document.getElementById('skillTabs');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
        wrapper.addEventListener('click', () => clearInterval(autoTimer));
    }
}

function initExperienceTabs() {
    const tabs = document.querySelectorAll('.exp-tab');
    const panels = document.querySelectorAll('.exp-panel');
    if (!tabs.length || !panels.length) return;

    const activeClasses = ['bg-surface-container', 'border-primary/30'];
    const idleClasses = ['bg-surface-container-highest', 'border-outline-variant/15'];

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.dataset.tab;
            tabs.forEach(t => {
                const on = t === tab;
                activeClasses.forEach(c => t.classList.toggle(c, on));
                idleClasses.forEach(c => t.classList.toggle(c, !on));
            });
            panels.forEach(p => {
                p.classList.toggle('active', p.id === `exp-${key}`);
            });
        });
    });
}

function initArchiveStaggerReveal() {
    const archiveSection = document.getElementById('projects');
    if (!archiveSection) return;

    const archiveItems = Array.from(
        archiveSection.querySelectorAll('.archive-grid > a')
    );
    if (!archiveItems.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const baseDelay = 110;

    archiveItems.forEach((item, index) => {
        item.classList.add('archive-reveal-item');
        item.style.setProperty('--archive-reveal-delay', `${index * baseDelay}ms`);
    });

    const revealAll = () => {
        archiveItems.forEach(item => item.classList.add('archive-reveal-visible'));
    };

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
        revealAll();
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            revealAll();
            obs.unobserve(entry.target);
        });
    }, {
        root: null,
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px'
    });

    observer.observe(archiveSection);
}
