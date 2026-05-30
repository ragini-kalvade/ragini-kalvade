// RK Systems portfolio interactions

const PROJECTS = [
    {
        number: '01',
        title: 'ForecastingError404',
        category: 'Agentic AI / Prediction Systems',
        outcome: 'Multi-agent forecasting system for Kalshi markets combining parallel model reasoning, evidence fusion, and calibrated judge arbitration.',
        bullets: [
            'Built parallel DeepSeek and Claude pipelines with a judge agent that audits bias, confidence, and correlated errors.',
            'Gathered category-aware evidence from nine external APIs plus Tavily search with graceful degradation.'
        ],
        tech: ['Python', 'FastAPI', 'LangGraph', 'OpenRouter', 'Multi-Agent'],
        accent: '#00ff9d',
        icon: 'trending_up',
        status: 'CORE_SYS: STABLE',
        arch: 'AGENTIC',
        links: {
            github: 'https://github.com/ragini-kalvade/AI-Prophets-Forecasting404',
            demo: 'https://youtu.be/i8Kv7EjxVyQ'
        },
        visualType: 'forecast',
        visualImage: 'media/forecast-multi-agent.png',
        visualDescription: 'Abstract multi-agent diagram showing event input, parallel evidence and model pipelines, judge arbitration, and final prediction output.',
        visualCaption: 'Multi-agent prediction with evidence fusion and judge calibration'
    },
    {
        number: '02',
        title: 'Flink-Neo4j GraphRAG Pipeline',
        category: 'Streaming Systems / Graph Retrieval',
        outcome: 'Streaming GraphRAG system combining Flink, Neo4j, and Kubernetes for relationship-aware retrieval.',
        bullets: [
            'Processed document and entity streams with Apache Flink.',
            'Modeled relationships in Neo4j to improve graph-aware retrieval.'
        ],
        tech: ['Flink', 'Neo4j', 'GraphRAG', 'EKS', 'Kubernetes'],
        accent: '#d07bff',
        icon: 'account_tree',
        status: 'CORE_SYS: LIVE',
        arch: 'STREAMING',
        links: {
            github: 'https://github.com/rkalv/MSR-Research-GraphRAG-Cloud-Pipeline',
            demo: 'https://youtu.be/Xj0raJIpaqg'
        },
        visualType: 'graphrag',
        visualImage: 'media/graphrag-architecture.png',
        visualDescription: 'Abstract streaming graph diagram showing Flink processing entity streams into Neo4j graph nodes for relationship-aware retrieval.',
        visualCaption: 'Streaming graph updates for relationship-aware retrieval'
    },
    {
        number: '03',
        title: 'Distributed Systems Simulator',
        category: 'Distributed Systems / Algorithms',
        outcome: 'Actor-based simulator for distributed algorithms and message-passing behavior.',
        bullets: [
            'Implemented distributed algorithm behavior over actor nodes and message channels.',
            'Modeled snapshot markers, node state, and message flow for system-level experimentation.'
        ],
        tech: ['Akka', 'Scala', 'Actors', 'Distributed Systems'],
        accent: '#7bd0ff',
        icon: 'hub',
        status: 'CORE_SYS: ACTIVE',
        arch: 'DISTRIBUTED',
        links: {
            github: 'https://github.com/rkalv/distributed-sys-simulator'
        },
        visualType: 'distributed',
        visualDescription: 'Abstract distributed systems diagram showing actor nodes exchanging messages and snapshot markers to capture global state.',
        visualCaption: 'Actor-based distributed algorithm simulator'
    },
    {
        number: '04',
        title: 'Cloud-Native Incremental RAG Pipeline',
        category: 'ML Systems / Cloud Infrastructure',
        outcome: 'Large-scale document ingestion and retrieval pipeline with incremental reprocessing, fault-tolerant checkpoints, and AWS deployment.',
        bullets: [
            'Used Spark, hashing, checkpoints, and cloud orchestration to avoid redundant reprocessing.',
            'Built retrieval infrastructure across embeddings, indexing, and AWS-backed storage.'
        ],
        tech: ['AWS', 'Spark', 'EMR', 'Delta Lake', 'RAG', 'Lucene'],
        accent: '#f59e0b',
        icon: 'cloud_sync',
        status: 'CORE_SYS: DEPLOYED',
        arch: 'ML-PIPELINE',
        links: {
            github: 'https://github.com/rkalv/incremental-spark-rag-pipeline',
            demo: 'https://youtu.be/Nf04b2GoBq4'
        },
        visualType: 'rag',
        visualImage: 'media/rag-pipeline.png',
        visualDescription: 'Abstract system diagram showing documents flowing through change detection, chunking, embeddings, indexing, and retrieval nodes.',
        visualCaption: 'Incremental document ingestion and retrieval pipeline'
    },
    {
        number: '05',
        title: 'DoReMi',
        category: 'HRI / Robotics / UX Research',
        outcome: 'Human-centered piano tutor robot using expressive feedback and structured evaluation.',
        bullets: [
            'Designed real-time and summarized feedback modes for beginner piano practice.',
            'Used robot expressions, lights, and structured evaluation to support learning.'
        ],
        tech: ['HRI', 'Robotics', 'UX Research', 'Misty'],
        accent: '#ff6b9d',
        icon: 'piano',
        status: 'CORE_SYS: PUBLISHED',
        arch: 'HRI',
        links: {
            publication: 'https://dl.acm.org/doi/10.1145/3776734.3794611'
        },
        visualType: 'doremi',
        visualImage: 'media/doremi-drawing.png',
        visualDescription: 'Abstract human-robot interaction diagram showing piano input flowing into feedback logic and robot cues.',
        visualCaption: 'Human-robot feedback system for piano practice'
    }
];

const DIAGRAM_NODES = {
    forecast: ['Event', 'Evidence', 'Model A/B', 'Judge', 'Forecast'],
    rag: ['Documents', 'Change Det.', 'Chunking', 'Embeddings', 'Index', 'Retrieval'],
    graphrag: ['Stream', 'Flink', 'Entities', 'Neo4j', 'Graph RAG'],
    distributed: ['Actors', 'Messages', 'Snapshots', 'Global State'],
    doremi: ['Piano', 'Feedback', 'Modes', 'Robot']
};

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function ProjectVisualCanvas({ type, visualImage, visualDescription, visualCaption }) {
    const figure = document.createElement('figure');
    figure.className = 'project-visual';

    if (visualImage) {
        const img = document.createElement('img');
        img.src = visualImage;
        img.alt = visualDescription;
        img.className = 'project-visual-img';
        img.loading = 'lazy';
        img.decoding = 'async';
        figure.appendChild(img);

        const caption = document.createElement('figcaption');
        caption.className = 'project-visual-caption mono-accent';
        caption.textContent = visualCaption;
        figure.appendChild(caption);
        return figure;
    }

    const nodes = DIAGRAM_NODES[type] || ['Input', 'Process', 'Output'];
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('class', 'project-visual-svg');
    svg.setAttribute('viewBox', '0 0 360 120');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', visualDescription);

    const defs = document.createElementNS(svgNs, 'defs');
    const marker = document.createElementNS(svgNs, 'marker');
    marker.setAttribute('id', `arrow-${type}`);
    marker.setAttribute('markerWidth', '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '5');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const markerPath = document.createElementNS(svgNs, 'path');
    markerPath.setAttribute('d', 'M0,0 L6,3 L0,6 Z');
    markerPath.setAttribute('fill', 'rgba(192, 132, 252, 0.85)');
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    const count = nodes.length;
    const spacing = count > 1 ? 300 / (count - 1) : 0;
    const y = 52;

    nodes.forEach((label, index) => {
        const x = 30 + index * spacing;
        const rect = document.createElementNS(svgNs, 'rect');
        rect.setAttribute('x', String(x - 22));
        rect.setAttribute('y', String(y - 14));
        rect.setAttribute('width', '44');
        rect.setAttribute('height', '28');
        rect.setAttribute('rx', '4');
        rect.setAttribute('class', 'project-visual-node');
        svg.appendChild(rect);

        const text = document.createElementNS(svgNs, 'text');
        text.setAttribute('x', String(x));
        text.setAttribute('y', String(y + 4));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'project-visual-label');
        text.textContent = label.length > 10 ? `${label.slice(0, 9)}…` : label;
        svg.appendChild(text);

        if (index < count - 1) {
            const line = document.createElementNS(svgNs, 'line');
            line.setAttribute('x1', String(x + 24));
            line.setAttribute('y1', String(y));
            line.setAttribute('x2', String(x + spacing - 24));
            line.setAttribute('y2', String(y));
            line.setAttribute('class', 'project-visual-edge');
            line.setAttribute('marker-end', `url(#arrow-${type})`);
            svg.appendChild(line);
        }
    });

    figure.appendChild(svg);

    const caption = document.createElement('figcaption');
    caption.className = 'project-visual-caption mono-accent';
    caption.textContent = visualCaption;
    figure.appendChild(caption);

    return figure;
}

function hexToRgb(hex) {
    const value = String(hex).replace('#', '');
    const n = parseInt(value, 16);
    if (Number.isNaN(n)) return '123, 208, 255';
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function buildRkLinks(project) {
    const links = project.links || {};
    const items = [];
    if (links.github) {
        items.push({ href: links.github, label: 'GITHUB', aria: `GitHub repository for ${project.title}` });
    }
    if (links.demo) {
        items.push({ href: links.demo, label: 'DEMO', aria: `Demo video for ${project.title}` });
    }
    if (links.publication) {
        items.push({ href: links.publication, label: 'PUBLICATION', aria: `Publication for ${project.title}` });
    }
    if (links.caseStudy) {
        items.push({ href: links.caseStudy, label: 'CASE STUDY', aria: `Case study for ${project.title}` });
    }
    return items.map(({ href, label, aria }) =>
        `<a href="${href}" target="_blank" rel="noopener" class="rk-link" aria-label="${escapeHtml(aria)}">// ${label} →</a>`
    ).join('');
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = '';

    PROJECTS.forEach((project, index) => {
        const accent = project.accent || '#7bd0ff';
        const article = document.createElement('article');
        article.className = 'rk-card project-card group';
        article.style.setProperty('--rk-accent', accent);
        article.style.setProperty('--rk-accent-rgb', hexToRgb(accent));
        article.style.setProperty('--rk-status-delay', `${(index * 0.7).toFixed(1)}s`);
        article.innerHTML = `
            <div class="rk-corner rk-corner-tl" aria-hidden="true"></div>
            <div class="rk-corner rk-corner-br" aria-hidden="true"></div>
            <div class="rk-card-inner">
                <div class="rk-node-row">
                    <span class="rk-node-id">NODE_ID: ${escapeHtml(project.number)}</span>
                    <span class="rk-entry-tag">ENTRY_VERIFIED</span>
                </div>
                <div class="rk-title-row">
                    <p class="rk-title">${escapeHtml(project.title)}</p>
                    <span class="material-symbols-outlined rk-icon" aria-hidden="true">${escapeHtml(project.icon || 'terminal')}</span>
                </div>
                <p class="rk-desc">${escapeHtml(project.outcome)}</p>
                <div class="rk-footer">
                    <span class="rk-status-badge">${escapeHtml(project.status || 'CORE_SYS: ACTIVE')}</span>
                    <span class="rk-arch-badge">ARCH: ${escapeHtml(project.arch || 'SYSTEM')}</span>
                </div>
                <div class="rk-links">${buildRkLinks(project)}</div>
            </div>
        `;
        grid.appendChild(article);
    });

    const explore = document.createElement('article');
    explore.className = 'rk-card project-card group rk-card-explore';
    explore.style.setProperty('--rk-accent', '#3d6ec9');
    explore.style.setProperty('--rk-accent-rgb', hexToRgb('#3d6ec9'));
    explore.style.setProperty('--rk-status-delay', `${(PROJECTS.length * 0.7).toFixed(1)}s`);
    explore.innerHTML = `
        <div class="rk-corner rk-corner-tl" aria-hidden="true"></div>
        <div class="rk-corner rk-corner-br" aria-hidden="true"></div>
        <div class="rk-card-inner">
            <div class="rk-node-row">
                <span class="rk-node-id">NODE_ID: +</span>
                <span class="rk-entry-tag">ENTRY_OPEN</span>
            </div>
            <div class="rk-title-row">
                <p class="rk-title">Explore My GitHub<span class="rk-cursor" aria-hidden="true"></span></p>
                <i class="fab fa-github rk-icon rk-icon-fa" aria-hidden="true"></i>
            </div>
            <p class="rk-desc">More engineering work, experiments, and research repositories.</p>
            <div class="rk-footer">
                <span class="rk-status-badge">CORE_SYS: OPEN</span>
                <span class="rk-arch-badge">ARCH: SOURCE</span>
            </div>
            <div class="rk-links">
                <a href="https://github.com/ragini-kalvade" target="_blank" rel="noopener" class="rk-link" aria-label="View Ragini Kalvade GitHub profile">// GITHUB →</a>
            </div>
        </div>
    `;
    grid.appendChild(explore);
}

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    initThemeToggle();
    initScrollPerformance();
    initSmoothScroll();
    initArchiveStaggerReveal();
    initSectionReveal();
    initImpactCounters();
    initMobileMenu();
    initActiveNav();
    initRotatingWords();
    initSkillTabs();
    initExperienceTabs();
    initArtTechModes();
});

const THEME_STORAGE_KEY = 'rk-theme';

function getActiveTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    syncThemeToggleUI();
}

function syncThemeToggleUI() {
    const isDark = getActiveTheme() === 'dark';
    document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach((button) => {
        const icon = button.querySelector('.material-symbols-outlined');
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    });
}

function initThemeToggle() {
    const buttons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    if (!buttons.length) return;

    syncThemeToggleUI();

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            applyTheme(getActiveTheme() === 'dark' ? 'light' : 'dark');
        });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });
}

function easeOutQuint(t) {
    return 1 - (1 - t) ** 5;
}

function getScrollOffset() {
    const nav = document.getElementById('top-nav');
    return (nav ? nav.getBoundingClientRect().height : 72) + 12;
}

function initScrollPerformance() {
    let idleTimer = null;
    const root = document.documentElement;

    const setScrolling = (active) => {
        root.classList.toggle('is-scrolling', active);
        root.dataset.scrolling = active ? 'true' : 'false';
    };

    window.addEventListener('scroll', () => {
        setScrolling(true);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => setScrolling(false), 140);
    }, { passive: true });
}

function initSmoothScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) return;

    document.documentElement.classList.add('smooth-scroll-enabled');

    let scrollFrame = null;

    const scrollToY = (targetY) => {
        if (scrollFrame) cancelAnimationFrame(scrollFrame);

        const startY = window.scrollY;
        const distance = targetY - startY;
        if (Math.abs(distance) < 2) return;

        const duration = Math.min(1100, Math.max(520, Math.abs(distance) * 0.55));
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min(1, (now - startTime) / duration);
            window.scrollTo(0, startY + distance * easeOutQuint(progress));
            if (progress < 1) {
                scrollFrame = requestAnimationFrame(step);
            } else {
                scrollFrame = null;
            }
        };

        scrollFrame = requestAnimationFrame(step);
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const hash = anchor.getAttribute('href');
            if (!hash || hash === '#') return;

            const target = document.querySelector(hash);
            if (!target) return;

            event.preventDefault();
            const targetY = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
            scrollToY(Math.max(0, targetY));

            if (history.replaceState) {
                history.replaceState(null, '', hash);
            } else {
                window.location.hash = hash;
            }
        });
    });
}

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
        const y = window.scrollY + getScrollOffset();
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let idx = 0;
    setInterval(() => {
        words[idx].classList.remove('active');
        idx = (idx + 1) % words.length;
        words[idx].classList.add('active');
    }, 4000);
}

function initSkillTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const panels = document.querySelectorAll('.skill-panel');
    const section = document.getElementById('skills');
    const tabList = document.getElementById('skillTabs');
    const tabScroller = document.querySelector('.skill-tabs-scroll');
    const panelsWrap = document.querySelector('.skill-panels-wrap');
    if (!tabs.length || !panels.length) return;

    const activeClasses = ['bg-primary/10', 'text-primary', 'border-primary/30'];
    const idleClasses = ['bg-surface-container-highest', 'text-on-surface-variant', 'border-outline-variant/15'];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const keys = Array.from(tabs).map(t => t.dataset.tab);
    const AUTO_INTERVAL_MS = 1300;
    const MANUAL_PAUSE_MS = 8000;

    let idx = 0;
    let autoTimer = null;
    let paused = false;
    let sectionVisible = false;
    let manualPauseTimer = null;
    let touchResumeTimer = null;

    const activate = (key, { scrollTab = true } = {}) => {
        tabs.forEach(t => {
            const on = t.dataset.tab === key;
            activeClasses.forEach(c => t.classList.toggle(c, on));
            idleClasses.forEach(c => t.classList.toggle(c, !on));
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
        });
        panels.forEach(p => {
            const on = p.id === `panel-${key}`;
            p.classList.toggle('active', on);
            p.hidden = !on;
        });

        const activeTab = Array.from(tabs).find(t => t.dataset.tab === key);
        const scrollContainer = tabScroller || tabList;
        if (scrollTab && activeTab && scrollContainer) {
            const listRect = scrollContainer.getBoundingClientRect();
            const tabRect = activeTab.getBoundingClientRect();
            const delta = (tabRect.left + tabRect.width / 2) - (listRect.left + listRect.width / 2);
            scrollContainer.scrollTo({
                left: scrollContainer.scrollLeft + delta,
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
            });
        }
    };

    const stopAuto = () => {
        if (!autoTimer) return;
        clearInterval(autoTimer);
        autoTimer = null;
    };

    const startAuto = () => {
        if (autoTimer || paused || !sectionVisible || prefersReducedMotion.matches) return;
        autoTimer = setInterval(() => {
            idx = (idx + 1) % keys.length;
            activate(keys[idx]);
        }, AUTO_INTERVAL_MS);
    };

    const pauseAuto = () => {
        paused = true;
        stopAuto();
    };

    const resumeAuto = () => {
        paused = false;
        startAuto();
    };

    const pauseAutoTemporarily = (ms = MANUAL_PAUSE_MS) => {
        pauseAuto();
        clearTimeout(manualPauseTimer);
        manualPauseTimer = setTimeout(resumeAuto, ms);
    };

    tabs.forEach(t => {
        t.setAttribute('role', 'tab');
        t.addEventListener('click', () => {
            idx = keys.indexOf(t.dataset.tab);
            activate(t.dataset.tab, { scrollTab: false });
            pauseAutoTemporarily();
        });
    });

    if (tabList) {
        tabList.setAttribute('role', 'tablist');
        tabList.setAttribute('aria-label', 'Skill categories');
    }
    if (panelsWrap) {
        panelsWrap.setAttribute('aria-live', 'polite');
    }

    if (section && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            sectionVisible = entries.some(entry => entry.isIntersecting);
            if (sectionVisible) startAuto();
            else stopAuto();
        }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
        observer.observe(section);
    } else {
        sectionVisible = true;
        startAuto();
    }

    const pauseTargets = [tabScroller, panelsWrap].filter(Boolean);
    pauseTargets.forEach((pauseTarget) => {
        pauseTarget.addEventListener('mouseenter', pauseAuto);
        pauseTarget.addEventListener('mouseleave', () => {
            clearTimeout(manualPauseTimer);
            resumeAuto();
        });
        pauseTarget.addEventListener('focusin', pauseAuto);
        pauseTarget.addEventListener('focusout', (event) => {
            if (!pauseTargets.some(el => el.contains(event.relatedTarget))) {
                clearTimeout(manualPauseTimer);
                resumeAuto();
            }
        });
        pauseTarget.addEventListener('touchstart', () => {
            pauseAuto();
            clearTimeout(touchResumeTimer);
            clearTimeout(manualPauseTimer);
        }, { passive: true });
        pauseTarget.addEventListener('touchend', () => {
            clearTimeout(touchResumeTimer);
            touchResumeTimer = setTimeout(resumeAuto, MANUAL_PAUSE_MS);
        }, { passive: true });
    });

    panels.forEach((p, i) => {
        p.setAttribute('role', 'tabpanel');
        p.id = p.id || `panel-${keys[i]}`;
        p.hidden = !p.classList.contains('active');
    });

    activate(keys[idx]);
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
        archiveSection.querySelectorAll('.archive-grid > .project-card')
    );
    if (!archiveItems.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealItem = (item) => {
        if (item.classList.contains('archive-reveal-visible')) return;
        item.classList.add('archive-reveal-visible');
        item.addEventListener('animationend', (event) => {
            if (event.animationName !== 'rkCardIn') return;
            item.style.willChange = 'auto';
        }, { once: true });
    };

    archiveItems.forEach((item) => {
        item.classList.add('archive-reveal-item');
    });

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
        archiveItems.forEach(revealItem);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealItem(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        root: null,
        threshold: 0.18,
        rootMargin: '0px 0px -6% 0px'
    });

    archiveItems.forEach((item) => observer.observe(item));
}

const SECTION_REVEAL_CLASSES = ['reveal-scanline', 'reveal-trace', 'reveal-flicker', 'reveal-pulse'];

function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
}

function initSectionReveal() {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!sections.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) return;

    const targets = sections.map((section, index) => {
        const label = section.querySelector('.section-label');
        const heading = section.querySelector('.art-title, h2.headline-font');
        const el = label || heading;
        if (!el) return null;
        const block = el.closest('.text-center, .flex, div') || el.parentElement;
        const target = block && block.contains(el) ? block : el;
        target.classList.add('section-reveal-target');
        if (!target.classList.contains('section-header-block')) {
            target.classList.add('section-header-block');
        }
        return { section, target, index, isContact: section.id === 'contact' };
    }).filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const item = targets.find((t) => t.target === entry.target);
            if (!item || item.revealed) return;
            item.revealed = true;
            const revealClass = SECTION_REVEAL_CLASSES[item.index % SECTION_REVEAL_CLASSES.length];
            item.target.classList.add(revealClass);
            if (item.isContact) item.target.classList.add('reveal-transmission');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.25, rootMargin: '-10% 0px -5% 0px' });

    targets.forEach((item) => observer.observe(item.target));
}

function initImpactCounters() {
    const strip = document.querySelector('.impact-strip');
    const counters = Array.from(document.querySelectorAll('.impact-value[data-counter]'));
    if (!strip || !counters.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const setFinalValues = () => {
        counters.forEach((el) => {
            const type = el.dataset.counter;
            if (type === 'range') {
                el.textContent = el.dataset.final || '4 days → 2 minutes';
            } else {
                const target = Number(el.dataset.target) || 0;
                const suffix = el.dataset.suffix || '';
                el.textContent = `${target}${suffix}`;
            }
        });
    };

    if (prefersReducedMotion.matches) {
        setFinalValues();
        return;
    }

    let animated = false;
    const runAnimation = () => {
        if (animated) return;
        animated = true;
        strip.classList.add('impact-strip--emphasis');
        const duration = 1200;
        const start = performance.now();

        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = easeOutCubic(t);
            counters.forEach((el) => {
                const type = el.dataset.counter;
                if (type === 'range') {
                    const from = Number(el.dataset.from) || 4;
                    const to = Number(el.dataset.to) || 2;
                    const current = Math.round(from + (to - from) * eased);
                    el.textContent = `${current} days → 2 minutes`;
                } else {
                    const target = Number(el.dataset.target) || 0;
                    const suffix = el.dataset.suffix || '';
                    el.textContent = `${Math.round(target * eased)}${suffix}`;
                }
            });
            if (t < 1) requestAnimationFrame(tick);
            else setFinalValues();
        };
        requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
        runAnimation();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
            runAnimation();
            observer.disconnect();
        }
    }, { threshold: 0.35, rootMargin: '0px' });
    observer.observe(strip);

    requestAnimationFrame(() => {
        const rect = strip.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) runAnimation();
    });
}

const CONSTELLATION_PREFIXES = ['Sol', 'Kha', 'Ara', 'Vel', 'Mira', 'Nex', 'Oru'];
const CONSTELLATION_SUFFIXES = ['nis', 'dra', 'ix', 'oth', 'ra', 'on', 'ae'];

function generateConstellationName() {
    const pre = CONSTELLATION_PREFIXES[Math.floor(Math.random() * CONSTELLATION_PREFIXES.length)];
    const suf = CONSTELLATION_SUFFIXES[Math.floor(Math.random() * CONSTELLATION_SUFFIXES.length)];
    return `${pre}${suf}`;
}

function initArtTechModes() {
    const artSection = document.getElementById('art-tech');
    const video = document.getElementById('art-tech-video');
    const canvas = document.getElementById('art-tech-canvas');
    const stage = document.getElementById('art-stage');
    const intro = document.getElementById('art-intro');
    const cameraButton = document.getElementById('art-tech-camera-btn');
    const introDemoButton = document.getElementById('art-tech-demo-btn');
    const gPill = document.getElementById('art-gpill');
    const fPill = document.getElementById('art-fpill');
    const saveButton = document.getElementById('art-save-btn');
    const exportSvgButton = document.getElementById('art-export-svg-btn');
    const demoToggleButton = document.getElementById('art-demo-toggle-btn');
    const previewToggleButton = document.getElementById('art-preview-toggle-btn');
    const fullscreenButton = document.getElementById('art-fullscreen-btn');
    const modeButtons = Array.from(document.querySelectorAll('[data-art-mode]'));
    if (
        !artSection || !video || !canvas || !stage || !intro || !cameraButton || !introDemoButton ||
        !gPill || !fPill || !saveButton || !demoToggleButton || !previewToggleButton ||
        !fullscreenButton || !modeButtons.length
    ) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const TIPS = [4, 8, 12, 16, 20];
    const CONN = [
        [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
        [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16],
        [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]
    ];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function getArtCanvasPalette() {
        const dark = document.documentElement.classList.contains('dark');
        if (dark) {
            return {
                bg: { constellation: '#050a18', mycelium: '#050a12', fracture: '#0a0c14' },
                constellation: {
                    grad: ['#050a18', '#080d20'],
                    star: '123, 208, 255',
                    lineAlpha: 0.35,
                    pending: '77, 224, 130',
                    label: '200, 230, 255'
                },
                mycelium: { branch: '220, 240, 230', composite: 'multiply' },
                fracture: {
                    base: '#1a1d28',
                    overlay: '26, 29, 40',
                    glow: ['#1a0533', '#f59e0b', '#f87171'],
                    scratch: '0, 0, 0'
                },
                transition: '8, 12, 24'
            };
        }
        return {
            bg: { constellation: '#eef6ff', mycelium: '#f0faf4', fracture: '#faf5ef' },
            constellation: {
                grad: ['#eef6ff', '#f8fbff'],
                star: '8, 145, 178',
                lineAlpha: 0.42,
                pending: '5, 150, 105',
                label: '30, 41, 59'
            },
            mycelium: { branch: '5, 150, 105', composite: 'source-over' },
            fracture: {
                base: '#f8fafc',
                overlay: '241, 245, 249',
                glow: ['#ede9fe', '#fcd34d', '#fca5a5'],
                scratch: '15, 23, 42'
            },
            transition: '255, 255, 255'
        };
    }

    let width = 0;
    let height = 0;
    let mode = 'constellation';
    let lastLandmarks = null;
    let lastGesture = '';
    let frame = 0;
    let fpsCount = 0;
    let lastFpsTime = Date.now();
    let animationFrameId = null;
    let trackingFrameId = null;
    let stream = null;
    let handsTracker = null;
    let started = false;
    let cameraActive = false;
    let demoMode = true;
    let previewEnabled = false;
    let modeTransitionAlpha = 0;
    let lastFrameTime = performance.now();

    const stars = [];
    const constellations = [];
    const dwellTrackers = TIPS.map(() => ({ stillSince: 0, lastX: 0, lastY: 0 }));
    let pendingCluster = null;

    const branches = [];
    const landmarkHistory = [];
    let stillnessFrames = 0;
    const MAX_BRANCHES = prefersReducedMotion.matches ? 400 : 1000;

    const crackCells = new Map();
    const fractureStrokes = [];
    let fractureGlowCanvas = null;
    let demoPressureAngle = 0;

    function resize() {
        width = stage.clientWidth;
        height = stage.clientHeight;
        canvas.width = width;
        canvas.height = height;
        fractureGlowCanvas = null;
    }

    function setMode(nextMode) {
        if (mode !== nextMode) {
            modeTransitionAlpha = 0.28;
            lastGesture = '';
        }
        mode = nextMode;
        artSection.dataset.artTheme = nextMode;
        modeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.artMode === nextMode);
        });
        if (exportSvgButton) {
            exportSvgButton.disabled = mode !== 'constellation';
            exportSvgButton.style.opacity = mode === 'constellation' ? '1' : '0.45';
        }
    }

    function refreshPreviewVisibility() {
        video.classList.toggle('is-live', cameraActive && previewEnabled);
    }

    function updateDemoToggleUI() {
        demoToggleButton.classList.toggle('is-on', demoMode);
        demoToggleButton.textContent = demoMode ? 'demo on' : 'demo off';
    }

    function updatePreviewToggleUI() {
        previewToggleButton.classList.toggle('is-on', previewEnabled);
        previewToggleButton.textContent = previewEnabled ? 'hide camera' : 'show camera';
    }

    function updateFullscreenUI() {
        fullscreenButton.classList.toggle('is-on', document.fullscreenElement === stage);
        fullscreenButton.textContent = document.fullscreenElement === stage ? 'collapse' : 'expand';
    }

    function xAt(landmarks, i) {
        return (1 - landmarks[i].x) * width;
    }

    function yAt(landmarks, i) {
        return landmarks[i].y * height;
    }

    function point(landmarks, i) {
        return { x: xAt(landmarks, i), y: yAt(landmarks, i) };
    }

    function classifyGesture(landmarks) {
        const extension = [8, 12, 16, 20].map((tip, i) => landmarks[tip].y < landmarks[[6, 10, 14, 18][i]].y);
        const raised = extension.filter(Boolean).length;
        const pinch = Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y) < 0.07;
        if (pinch) return 'pinch';
        if (raised === 0) return 'fist';
        if (raised === 4) return 'open hand';
        return 'hand';
    }

    function getDemoFingertips(time) {
        return TIPS.map((_, i) => ({
            x: width * (0.5 + Math.sin(time * 0.35 + i * 1.2) * 0.28),
            y: height * (0.5 + Math.cos(time * 0.42 + i * 0.9) * 0.26),
            finger: i
        }));
    }

    function plantStar(x, y, finger) {
        stars.push({ x, y, finger, born: performance.now(), r: 1.2 + Math.random() * 1.8 });
    }

    function distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function findCluster(candidateStars) {
        if (candidateStars.length < 3) return null;
        const cluster = [];
        candidateStars.forEach((s) => {
            const near = candidateStars.filter((o) => o !== s && distance(s, o) < 80);
            if (near.length >= 2) cluster.push(s);
        });
        const unique = [...new Set(cluster)];
        if (unique.length < 3) return null;
        const cx = unique.reduce((a, s) => a + s.x, 0) / unique.length;
        const cy = unique.reduce((a, s) => a + s.y, 0) / unique.length;
        return { stars: unique, cx, cy };
    }

    function lockConstellation(cluster) {
        const name = generateConstellationName();
        constellations.push({
            name,
            stars: cluster.stars.map((s) => ({ x: s.x, y: s.y })),
            cx: cluster.cx,
            cy: cluster.cy
        });
        cluster.stars.forEach((s) => {
            const idx = stars.indexOf(s);
            if (idx >= 0) stars.splice(idx, 1);
        });
        pendingCluster = null;
    }

    function updateConstellationLogic(landmarks, dt) {
        const now = performance.now();
        const tips = landmarks
            ? TIPS.map((ti, fi) => ({ ...point(landmarks, ti), finger: fi }))
            : getDemoFingertips(frame * 0.016);

        tips.forEach((tip, fi) => {
            const tracker = dwellTrackers[fi];
            const speed = Math.hypot(tip.x - tracker.lastX, tip.y - tracker.lastY) / Math.max(dt, 1);
            if (speed < 0.35) {
                if (!tracker.stillSince) tracker.stillSince = now;
                if (now - tracker.stillSince > 300) {
                    const tooClose = stars.some((s) => distance(s, tip) < 12);
                    if (!tooClose) plantStar(tip.x, tip.y, fi);
                    tracker.stillSince = now;
                }
            } else {
                tracker.stillSince = 0;
            }
            tracker.lastX = tip.x;
            tracker.lastY = tip.y;
        });

        const mature = stars.filter((s) => now - s.born > 1000);
        const cluster = findCluster(mature.length >= 3 ? mature : stars);
        if (cluster && !pendingCluster) pendingCluster = cluster;

        const gesture = landmarks ? classifyGesture(landmarks) : '';
        if (gesture === 'pinch' && lastGesture !== 'pinch') {
            const target = pendingCluster || findCluster(stars);
            if (target) lockConstellation(target);
        }
        if (gesture === 'fist' && lastGesture !== 'fist') {
            stars.length = 0;
            pendingCluster = null;
        }
        lastGesture = gesture;
    }

    function drawConstellation() {
        const theme = getArtCanvasPalette().constellation;
        const grad = context.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, theme.grad[0]);
        grad.addColorStop(1, theme.grad[1]);
        context.fillStyle = grad;
        context.fillRect(0, 0, width, height);

        const drawStar = (s, alpha, sizeMul) => {
            context.beginPath();
            context.arc(s.x, s.y, (s.r || 2) * sizeMul, 0, Math.PI * 2);
            context.fillStyle = `rgba(${theme.star}, ${alpha})`;
            context.fill();
            context.beginPath();
            context.arc(s.x, s.y, (s.r || 2) * sizeMul * 2.5, 0, Math.PI * 2);
            context.fillStyle = `rgba(${theme.star}, ${alpha * 0.2})`;
            context.fill();
        };

        constellations.forEach((c) => {
            const pts = c.stars;
            for (let i = 0; i < pts.length; i += 1) {
                for (let j = i + 1; j < pts.length; j += 1) {
                    context.beginPath();
                    context.moveTo(pts[i].x, pts[i].y);
                    context.lineTo(pts[j].x, pts[j].y);
                    context.strokeStyle = `rgba(${theme.star}, ${theme.lineAlpha})`;
                    context.lineWidth = 0.8;
                    context.stroke();
                }
            }
            pts.forEach((s) => drawStar(s, 0.85, 1));
            context.font = 'small-caps 11px ui-monospace, monospace';
            context.fillStyle = `rgba(${theme.label}, 0.9)`;
            context.textAlign = 'center';
            context.fillText(c.name, c.cx, c.cy - 10);
        });

        if (pendingCluster) {
            const pts = pendingCluster.stars;
            for (let i = 0; i < pts.length; i += 1) {
                for (let j = i + 1; j < pts.length; j += 1) {
                    context.beginPath();
                    context.moveTo(pts[i].x, pts[i].y);
                    context.lineTo(pts[j].x, pts[j].y);
                    context.strokeStyle = `rgba(${theme.pending}, 0.25)`;
                    context.lineWidth = 0.6;
                    context.stroke();
                }
            }
        }

        stars.forEach((s) => {
            const age = (performance.now() - s.born) / 1000;
            drawStar(s, Math.min(0.9, 0.3 + age * 0.4), 1);
        });
    }

    function palmAngle(landmarks) {
        const wrist = point(landmarks, 0);
        const mid = point(landmarks, 9);
        return Math.atan2(mid.y - wrist.y, mid.x - wrist.x);
    }

    function averageLandmarkMotion(landmarks) {
        const pts = Array.from({ length: 21 }, (_, i) => point(landmarks, i));
        landmarkHistory.push(pts);
        if (landmarkHistory.length > 8) landmarkHistory.shift();
        if (landmarkHistory.length < 2) return 999;
        let sum = 0;
        const prev = landmarkHistory[landmarkHistory.length - 2];
        pts.forEach((p, i) => { sum += Math.hypot(p.x - prev[i].x, p.y - prev[i].y); });
        return sum / 21;
    }

    function growBranch(x, y, angle, length, life, parentId, sparse) {
        if (branches.length >= MAX_BRANCHES) branches.shift();
        const grow = sparse ? 1.5 : 2.5;
        const nx = x + Math.cos(angle) * grow;
        const ny = y + Math.sin(angle) * grow;
        branches.push({ x0: x, y0: y, x1: nx, y1: ny, angle, life: 0, maxLife: life, parentId, sparse });
        if (length > grow && Math.random() < (sparse ? 0.12 : 0.2)) {
            growBranch(nx, ny, angle + (Math.random() < 0.5 ? 0.26 : -0.26), length - grow, life * 0.85, branches.length - 1, sparse);
        }
        return { x: nx, y: ny, angle };
    }

    function updateMyceliumLogic(landmarks) {
        if (!landmarks) {
            stillnessFrames += 1;
            if (stillnessFrames % 2 === 0) {
                const t = frame * 0.016;
                for (let i = 0; i < 8; i += 1) {
                    const x = width * (0.5 + Math.sin(t + i) * 0.3);
                    const y = height * (0.5 + Math.cos(t * 0.8 + i) * 0.3);
                    growBranch(x, y, t + i, 120, 140, -1, false);
                }
            }
            return;
        }

        const motion = averageLandmarkMotion(landmarks);
        const sparse = motion > 8 || motion < 0.01;
        if (motion > 4.5) {
            branches.length = 0;
            landmarkHistory.length = 0;
            stillnessFrames = 0;
            return;
        }
        stillnessFrames += 1;
        const baseAngle = palmAngle(landmarks);
        for (let i = 0; i < 21; i += 1) {
            const p = point(landmarks, i);
            const fork = (i % 5) * 0.12;
            growBranch(p.x, p.y, baseAngle + fork + (Math.random() - 0.5) * 0.4, 100 + Math.random() * 80, 120 + Math.random() * 60, i, sparse);
        }
    }

    function drawMycelium() {
        const theme = getArtCanvasPalette();
        context.fillStyle = theme.bg.mycelium;
        context.fillRect(0, 0, width, height);
        context.save();
        context.globalCompositeOperation = theme.mycelium.composite;
        branches.forEach((b) => {
            b.life += 1;
            const t = b.life / b.maxLife;
            if (t > 1) return;
            const alpha = (1 - t) * (b.sparse ? 0.35 : 0.65);
            context.strokeStyle = `rgba(${theme.mycelium.branch}, ${alpha})`;
            context.lineWidth = 0.8;
            context.beginPath();
            context.moveTo(b.x0, b.y0);
            context.lineTo(b.x1, b.y1);
            context.stroke();
        });
        context.restore();
        for (let i = branches.length - 1; i >= 0; i -= 1) {
            if (branches[i].life > branches[i].maxLife) branches.splice(i, 1);
        }
    }

    function cellKey(x, y) {
        const step = 14;
        return `${Math.floor(x / step)},${Math.floor(y / step)}`;
    }

    function crackAt(x, y, energy, axisAngle) {
        const key = cellKey(x, y);
        const existing = crackCells.get(key) || { crack: 0, heal: 0 };
        existing.crack = Math.min(1, existing.crack + energy * 0.15);
        existing.heal = 0;
        crackCells.set(key, existing);
        fractureStrokes.push({
            x, y, angle: axisAngle, life: 1, width: 1 + energy * 3, secondary: false
        });
        if (Math.random() < 0.4) {
            fractureStrokes.push({
                x, y, angle: axisAngle + (Math.random() < 0.5 ? 1.05 : -1.05), life: 0.8, width: 0.8, secondary: true
            });
        }
    }

    function ensureFractureGlow() {
        if (fractureGlowCanvas && fractureGlowCanvas.width === width) return;
        fractureGlowCanvas = document.createElement('canvas');
        fractureGlowCanvas.width = width;
        fractureGlowCanvas.height = height;
        const gctx = fractureGlowCanvas.getContext('2d');
        const glow = getArtCanvasPalette().fracture.glow;
        const g = gctx.createLinearGradient(0, 0, width, height);
        g.addColorStop(0, glow[0]);
        g.addColorStop(0.5, glow[1]);
        g.addColorStop(1, glow[2]);
        gctx.fillStyle = g;
        gctx.fillRect(0, 0, width, height);
    }

    function updateFractureLogic(landmarks) {
        ensureFractureGlow();
        let axisAngle = -Math.PI / 2;
        if (landmarks) {
            const wrist = point(landmarks, 0);
            const mid = point(landmarks, 9);
            axisAngle = Math.atan2(mid.y - wrist.y, mid.x - wrist.x);
            const gesture = classifyGesture(landmarks);
            if (gesture === 'open hand') {
                crackCells.forEach((cell) => {
                    cell.heal += 0.008;
                    cell.crack = Math.max(0, cell.crack - 0.012);
                });
            }
            if (gesture === 'pinch' && lastGesture !== 'pinch') {
                const px = (xAt(landmarks, 4) + xAt(landmarks, 8)) / 2;
                const py = (yAt(landmarks, 4) + yAt(landmarks, 8)) / 2;
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
                    crackAt(px, py, 1.2, a);
                }
            }
            lastGesture = gesture;
            const wristZ = landmarks[0].z || 0;
            TIPS.forEach((ti) => {
                const p = point(landmarks, ti);
                const z = (landmarks[ti].z || 0) - wristZ;
                const energy = Math.max(0, Math.min(1, 0.5 - z * 3));
                if (energy > 0.15) crackAt(p.x, p.y, energy, axisAngle);
            });
        } else {
            demoPressureAngle += 0.04;
            const px = width / 2 + Math.cos(demoPressureAngle) * width * 0.25;
            const py = height / 2 + Math.sin(demoPressureAngle * 0.7) * height * 0.2;
            crackAt(px, py, 0.5, demoPressureAngle);
        }

        fractureStrokes.forEach((stroke) => {
            stroke.life -= 0.006;
            const len = 8 * stroke.life;
            const x2 = stroke.x + Math.cos(stroke.angle) * len;
            const y2 = stroke.y + Math.sin(stroke.angle) * len;
            const scratch = getArtCanvasPalette().fracture.scratch;
            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.strokeStyle = `rgba(${scratch}, ${0.15 + stroke.life * 0.25})`;
            context.lineWidth = stroke.width;
            context.beginPath();
            context.moveTo(stroke.x, stroke.y);
            context.lineTo(x2, y2);
            context.stroke();
            context.restore();
            stroke.x = x2;
            stroke.y = y2;
        });
        for (let i = fractureStrokes.length - 1; i >= 0; i -= 1) {
            if (fractureStrokes[i].life <= 0) fractureStrokes.splice(i, 1);
        }
    }

    function drawFracture() {
        const theme = getArtCanvasPalette().fracture;
        context.fillStyle = theme.base;
        context.fillRect(0, 0, width, height);
        if (fractureGlowCanvas) context.drawImage(fractureGlowCanvas, 0, 0);
        updateFractureLogic(lastLandmarks);
        context.fillStyle = `rgba(${theme.overlay}, 0.35)`;
        context.fillRect(0, 0, width, height);
    }

    function updateGesturePill() {
        let gesture = lastLandmarks
            ? classifyGesture(lastLandmarks)
            : (cameraActive ? 'waiting for motion' : (demoMode ? 'canvas idle' : 'raise a hand'));
        if (mode === 'constellation' && gesture === 'pinch') gesture = 'pinch · lock';
        if (mode === 'constellation' && gesture === 'fist') gesture = 'fist · clear';
        if (mode === 'fracture' && gesture === 'open hand') gesture = 'open hand · heal';
        gPill.textContent = gesture;
        gPill.classList.toggle('is-live', Boolean(lastLandmarks));
    }

    function drawFrame(now) {
        const dt = Math.min(64, now - lastFrameTime);
        lastFrameTime = now;
        frame += 1;
        const time = frame * 0.016;

        const canvasTheme = getArtCanvasPalette();
        context.fillStyle = canvasTheme.bg[mode] || canvasTheme.bg.constellation;
        context.fillRect(0, 0, width, height);

        if (mode === 'constellation') {
            updateConstellationLogic(lastLandmarks, dt);
            drawConstellation();
        } else if (mode === 'mycelium') {
            updateMyceliumLogic(lastLandmarks);
            drawMycelium();
        } else if (mode === 'fracture') {
            drawFracture();
        }

        if (modeTransitionAlpha > 0.002) {
            const transition = getArtCanvasPalette().transition;
            context.fillStyle = `rgba(${transition}, ${modeTransitionAlpha})`;
            context.fillRect(0, 0, width, height);
            modeTransitionAlpha *= 0.86;
        } else {
            modeTransitionAlpha = 0;
        }

        animationFrameId = window.requestAnimationFrame(drawFrame);
    }

    function serializeConstellationSvg() {
        const pad = 20;
        const w = width + pad * 2;
        const h = height + pad * 2;
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
        svg += `<rect width="100%" height="100%" fill="#050a18"/>`;
        constellations.forEach((c) => {
            const pts = c.stars;
            for (let i = 0; i < pts.length; i += 1) {
                for (let j = i + 1; j < pts.length; j += 1) {
                    svg += `<line x1="${pts[i].x + pad}" y1="${pts[i].y + pad}" x2="${pts[j].x + pad}" y2="${pts[j].y + pad}" stroke="#7bd0ff" stroke-opacity="0.4" stroke-width="1"/>`;
                }
            }
            pts.forEach((s) => {
                svg += `<circle cx="${s.x + pad}" cy="${s.y + pad}" r="3" fill="#7bd0ff"/>`;
            });
            svg += `<text x="${c.cx + pad}" y="${c.cy + pad - 8}" fill="#dae2fd" font-family="monospace" font-size="11" text-anchor="middle">${c.name}</text>`;
        });
        stars.forEach((s) => {
            svg += `<circle cx="${s.x + pad}" cy="${s.y + pad}" r="2" fill="#7bd0ff" opacity="0.7"/>`;
        });
        svg += '</svg>';
        return svg;
    }

    function exportConstellationSvg() {
        if (mode !== 'constellation') return;
        const blob = new Blob([serializeConstellationSvg()], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `constellation-map-${Date.now()}.svg`;
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function saveFrame() {
        const output = document.createElement('canvas');
        output.width = width;
        output.height = height;
        const outContext = output.getContext('2d');
        if (!outContext) return;
        outContext.drawImage(canvas, 0, 0);
        const footerHeight = 28;
        outContext.fillStyle = 'rgba(0,0,0,0.55)';
        outContext.fillRect(0, height - footerHeight, width, footerHeight);
        outContext.font = '500 12px system-ui, sans-serif';
        outContext.textBaseline = 'middle';
        outContext.fillStyle = 'rgba(255,255,255,0.35)';
        outContext.fillText(`created with hand art · ${mode}`, 14, height - footerHeight / 2);
        const anchor = document.createElement('a');
        anchor.href = output.toDataURL('image/png');
        anchor.download = `hand-art-${mode}-${Date.now()}.png`;
        anchor.click();
    }

    function stopSession() {
        if (trackingFrameId !== null) {
            window.cancelAnimationFrame(trackingFrameId);
            trackingFrameId = null;
        }
        if (animationFrameId !== null) {
            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            stream = null;
        }
        cameraActive = false;
        refreshPreviewVisibility();
        lastLandmarks = null;
        started = false;
        branches.length = 0;
        landmarkHistory.length = 0;
    }

    function startTrackingLoop() {
        const track = async () => {
            if (!stream || !handsTracker) return;
            await handsTracker.send({ image: video });
            fpsCount += 1;
            const now = Date.now();
            if (now - lastFpsTime > 1000) {
                fPill.textContent = `${fpsCount} fps`;
                fpsCount = 0;
                lastFpsTime = now;
            }
            trackingFrameId = window.requestAnimationFrame(track);
        };
        trackingFrameId = window.requestAnimationFrame(track);
    }

    async function boot() {
        if (started) return;
        if (typeof window.Hands === 'undefined') {
            cameraButton.textContent = 'mediapipe unavailable';
            cameraButton.classList.add('is-error');
            return;
        }
        intro.style.display = 'none';
        cameraButton.classList.remove('is-error');
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });
            video.srcObject = stream;
            await new Promise((resolve) => { video.onloadedmetadata = resolve; });
            await video.play();
            cameraActive = true;
            demoMode = false;
            updateDemoToggleUI();
            refreshPreviewVisibility();
            resize();
            handsTracker = new window.Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });
            handsTracker.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.6
            });
            handsTracker.onResults((results) => {
                lastLandmarks = results.multiHandLandmarks?.length ? results.multiHandLandmarks[0] : null;
                updateGesturePill();
            });
            started = true;
            updateGesturePill();
            startTrackingLoop();
            if (animationFrameId === null) {
                lastFrameTime = performance.now();
                drawFrame(lastFrameTime);
            }
        } catch (error) {
            console.warn('[art-tech] camera start failed:', error);
            cameraActive = false;
            demoMode = true;
            updateDemoToggleUI();
            refreshPreviewVisibility();
            intro.style.display = 'flex';
            cameraButton.textContent = 'retry (allow camera)';
            cameraButton.classList.add('is-error');
        }
    }

    function startDemoExperience() {
        intro.style.display = 'none';
        stopSession();
        demoMode = true;
        started = false;
        updateDemoToggleUI();
        refreshPreviewVisibility();
        updateGesturePill();
        if (animationFrameId === null) {
            lastFrameTime = performance.now();
            drawFrame(lastFrameTime);
        }
    }

    async function toggleFullscreen() {
        if (document.fullscreenElement === stage) {
            await document.exitFullscreen();
            return;
        }
        await stage.requestFullscreen();
    }

    function initNavSoftening() {
        if (!('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver((entries) => {
            const active = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.22);
            document.body.classList.toggle('art-tech-focus', active);
        }, { threshold: [0.2, 0.35, 0.6], rootMargin: '-90px 0px -32% 0px' });
        observer.observe(artSection);
    }

    modeButtons.forEach((button) => {
        button.addEventListener('click', () => setMode(button.dataset.artMode || 'constellation'));
    });
    cameraButton.addEventListener('click', boot);
    introDemoButton.addEventListener('click', startDemoExperience);
    saveButton.addEventListener('click', saveFrame);
    if (exportSvgButton) exportSvgButton.addEventListener('click', exportConstellationSvg);
    demoToggleButton.addEventListener('click', () => {
        if (demoMode) boot();
        else startDemoExperience();
    });
    previewToggleButton.addEventListener('click', () => {
        previewEnabled = !previewEnabled;
        updatePreviewToggleUI();
        refreshPreviewVisibility();
    });
    fullscreenButton.addEventListener('click', () => { toggleFullscreen().catch(() => {}); });
    window.addEventListener('resize', resize);
    window.addEventListener('pagehide', stopSession);
    window.addEventListener('beforeunload', stopSession);
    document.addEventListener('fullscreenchange', updateFullscreenUI);
    document.addEventListener('themechange', () => {
        fractureGlowCanvas = null;
    });

    initNavSoftening();

    resize();
    stage.classList.add('is-blooming');
    window.setTimeout(() => stage.classList.remove('is-blooming'), 1400);
    setMode(mode);
    updateDemoToggleUI();
    updatePreviewToggleUI();
    updateFullscreenUI();
    updateGesturePill();
    if (animationFrameId === null) {
        lastFrameTime = performance.now();
        drawFrame(lastFrameTime);
    }
}
