// RK Systems portfolio interactions

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initActiveNav();
    initRotatingWords();
    initSkillTabs();
    initExperienceTabs();
    initArchiveStaggerReveal();
    initProjectVisuals();
    initArtTechSection();
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

function initProjectVisuals() {
    const cards = Array.from(document.querySelectorAll('[data-project-visual]'));
    if (!cards.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const states = [];
    let animationFrame = null;

    const getPalette = () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            return {
                bgA: '#0b1326',
                bgB: '#171f33',
                primary: '#7bd0ff',
                tertiary: '#4de082',
                outline: 'rgba(144, 144, 151, 0.32)',
                surface: 'rgba(23, 31, 51, 0.74)',
                ink: '#dae2fd'
            };
        }
        return {
            bgA: '#f3f8ff',
            bgB: '#e8f3ff',
            primary: '#00668a',
            tertiary: '#0f8f4c',
            outline: 'rgba(40, 67, 90, 0.2)',
            surface: 'rgba(217, 231, 244, 0.74)',
            ink: '#112030'
        };
    };

    function buildParticles(kind, width, height) {
        const count = kind === 'mage' ? 30 : (kind === 'cog' ? 24 : 18);
        return Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: 1 + Math.random() * 2
        }));
    }

    function ensureSize(state) {
        const rect = state.canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        if (width === state.width && height === state.height) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        state.canvas.width = Math.floor(width * dpr);
        state.canvas.height = Math.floor(height * dpr);
        state.canvas.style.width = `${width}px`;
        state.canvas.style.height = `${height}px`;
        state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        state.width = width;
        state.height = height;
        state.particles = buildParticles(state.kind, width, height);
    }

    function drawBackdrop(state, palette) {
        const { ctx, width, height } = state;
        const g = ctx.createLinearGradient(0, 0, width, height);
        g.addColorStop(0, palette.bgA);
        g.addColorStop(1, palette.bgB);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        const gridStep = Math.max(18, Math.floor(width / 12));
        ctx.strokeStyle = palette.outline;
        ctx.lineWidth = 1;
        for (let x = 0; x <= width; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.fillStyle = palette.surface;
        ctx.fillRect(0, height * 0.62, width, height * 0.38);
    }

    function animateParticles(state, palette) {
        const { ctx, width, height, particles } = state;
        particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            ctx.fillStyle = `${palette.primary}66`;
            ctx.fill();
        });
    }

    function drawRag(state, t, palette) {
        const { ctx, width, height } = state;
        drawBackdrop(state, palette);

        const laneCount = 6;
        const laneGap = height / (laneCount + 1);
        for (let i = 1; i <= laneCount; i += 1) {
            const y = i * laneGap;
            const pulse = 0.55 + Math.sin(t * 2 + i * 0.65) * 0.32;
            ctx.strokeStyle = `${palette.primary}${Math.floor(80 + pulse * 120).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width * 0.06, y);
            ctx.lineTo(width * (0.24 + pulse * 0.44), y);
            ctx.stroke();

            const docX = width * (0.09 + ((t * 0.11 + i * 0.17) % 0.17));
            ctx.beginPath();
            ctx.arc(docX, y, 3.2, 0, Math.PI * 2);
            ctx.fillStyle = palette.ink;
            ctx.fill();

            const dotX = width * (0.28 + ((t * 0.16 + i * 0.13) % 0.64));
            ctx.beginPath();
            ctx.arc(dotX, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = palette.tertiary;
            ctx.fill();
        }

        ctx.font = '600 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
        ctx.fillStyle = `${palette.ink}cc`;
        ctx.fillText('INGEST', width * 0.04, height * 0.13);
        ctx.fillText('INDEX', width * 0.24, height * 0.13);
        ctx.fillText('RETRIEVE', width * 0.76, height * 0.13);
    }

    function drawGraphRag(state, t, palette) {
        const { ctx, width, height } = state;
        drawBackdrop(state, palette);

        const nodes = [
            [0.18, 0.24], [0.4, 0.2], [0.64, 0.28], [0.83, 0.2],
            [0.25, 0.52], [0.5, 0.5], [0.74, 0.56], [0.34, 0.8], [0.62, 0.78]
        ].map(([x, y], idx) => ({
            x: width * x + Math.sin(t * 1.1 + idx) * 3,
            y: height * y + Math.cos(t * 0.9 + idx * 0.6) * 3
        }));
        const edges = [[0, 1], [1, 2], [2, 3], [1, 5], [0, 4], [4, 5], [5, 6], [4, 7], [5, 8], [6, 8], [2, 6]];

        ctx.lineWidth = 1.6;
        edges.forEach(([a, b], idx) => {
            const glow = 0.35 + 0.3 * Math.sin(t * 1.7 + idx);
            ctx.strokeStyle = `${palette.primary}${Math.floor(70 + glow * 120).toString(16).padStart(2, '0')}`;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
        });

        nodes.forEach((node, idx) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, idx % 3 === 0 ? 4.5 : 3.2, 0, Math.PI * 2);
            ctx.fillStyle = idx % 3 === 0 ? palette.tertiary : palette.primary;
            ctx.fill();
        });

        const streamX = width * ((t * 0.1) % 1);
        ctx.fillStyle = `${palette.ink}cc`;
        ctx.fillRect(streamX, height * 0.08, 16, 6);
        ctx.fillRect((streamX + width * 0.35) % width, height * 0.08, 16, 6);
        ctx.fillRect((streamX + width * 0.65) % width, height * 0.08, 16, 6);
    }

    function drawMage(state, t, palette) {
        const { ctx, width, height } = state;
        drawBackdrop(state, palette);
        animateParticles(state, palette);

        const agents = [
            { label: 'PLAN', x: 0.2, y: 0.35, color: palette.primary },
            { label: 'TOOL', x: 0.5, y: 0.22, color: palette.tertiary },
            { label: 'ACT', x: 0.78, y: 0.35, color: palette.primary },
            { label: 'CHECK', x: 0.5, y: 0.7, color: palette.tertiary }
        ];

        ctx.lineWidth = 1.8;
        for (let i = 0; i < agents.length; i += 1) {
            const a = agents[i];
            const b = agents[(i + 1) % agents.length];
            ctx.strokeStyle = `${palette.outline}`;
            ctx.beginPath();
            ctx.moveTo(width * a.x, height * a.y);
            ctx.lineTo(width * b.x, height * b.y);
            ctx.stroke();
        }

        agents.forEach((agent, idx) => {
            const x = width * agent.x + Math.sin(t * 1.4 + idx) * 4;
            const y = height * agent.y + Math.cos(t * 1.1 + idx) * 4;
            ctx.beginPath();
            ctx.arc(x, y, 14, 0, Math.PI * 2);
            ctx.fillStyle = `${agent.color}55`;
            ctx.fill();
            ctx.strokeStyle = `${agent.color}dd`;
            ctx.stroke();

            ctx.font = '600 8px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
            ctx.fillStyle = `${palette.ink}d9`;
            ctx.fillText(agent.label, x - 11, y + 3);
        });

        const tokenY = height * (0.5 + Math.sin(t * 1.8) * 0.08);
        const tokenX = width * (0.18 + ((t * 0.18) % 0.64));
        ctx.beginPath();
        ctx.arc(tokenX, tokenY, 4, 0, Math.PI * 2);
        ctx.fillStyle = palette.tertiary;
        ctx.fill();
    }

    function drawDoReMi(state, t, palette) {
        const { ctx, width, height } = state;
        drawBackdrop(state, palette);

        const outline = `${palette.ink}dd`;
        const sketch = (v) => v + Math.sin(t * 2.2 + v * 0.09) * 0.9;
        const botX = width * 0.53;
        const botY = height * (0.46 + Math.sin(t * 1.5) * 0.018);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = outline;
        ctx.fillStyle = `${palette.primary}20`;
        ctx.lineWidth = 2.2;

        // Head shell
        ctx.beginPath();
        ctx.roundRect(botX - 54, botY - 52, 108, 72, 22);
        ctx.fill();
        ctx.stroke();

        // Ear cups
        ctx.beginPath();
        ctx.arc(botX - 62, botY - 15, 15, Math.PI * 0.5, Math.PI * 1.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(botX + 62, botY - 15, 15, Math.PI * -0.5, Math.PI * 0.5);
        ctx.stroke();

        // Antenna
        ctx.beginPath();
        ctx.moveTo(botX + 44, botY - 52);
        ctx.lineTo(botX + 58, botY - 78);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(botX + 60, botY - 80, 3, 0, Math.PI * 2);
        ctx.fillStyle = palette.tertiary;
        ctx.fill();

        // Face panel
        ctx.fillStyle = `${palette.tertiary}2e`;
        ctx.beginPath();
        ctx.roundRect(botX - 38, botY - 34, 76, 43, 12);
        ctx.fill();

        // Eyes + smile
        ctx.fillStyle = outline;
        ctx.beginPath();
        ctx.arc(botX - 17, botY - 14, 6, 0, Math.PI * 2);
        ctx.arc(botX + 17, botY - 14, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(botX, botY - 2, 9, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Body
        ctx.fillStyle = `${palette.primary}18`;
        ctx.strokeStyle = outline;
        ctx.beginPath();
        ctx.roundRect(botX - 32, botY + 24, 64, 48, 14);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(botX - 18, botY + 24);
        ctx.lineTo(botX - 38, botY + 54);
        ctx.moveTo(botX + 18, botY + 24);
        ctx.lineTo(botX + 38, botY + 54);
        ctx.stroke();

        // Piano strip
        const keyY = height * 0.75;
        const keyW = width * 0.067;
        for (let i = 0; i < 9; i += 1) {
            const keyX = width * 0.2 + i * keyW;
            const hit = 0.5 + Math.sin(t * 2.4 + i * 0.7) * 0.5;
            ctx.fillStyle = i % 2 === 0 ? `${palette.ink}70` : `${palette.primary}${Math.floor(110 + hit * 90).toString(16).padStart(2, '0')}`;
            ctx.fillRect(keyX, keyY, keyW - 2, height * 0.17);
        }

        // Floating music notes (left side, sketchy)
        const notes = [
            { x: width * 0.17, y: height * 0.34, s: 1.0, p: 0 },
            { x: width * 0.12, y: height * 0.46, s: 0.85, p: 1.3 },
            { x: width * 0.24, y: height * 0.52, s: 1.2, p: 2.2 }
        ];
        ctx.strokeStyle = `${palette.tertiary}dd`;
        ctx.fillStyle = `${palette.tertiary}dd`;
        notes.forEach((n) => {
            const nx = sketch(n.x);
            const ny = sketch(n.y + Math.sin(t * 1.8 + n.p) * 6);
            const r = 4 * n.s;
            ctx.beginPath();
            ctx.arc(nx, ny, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(nx + r * 0.9, ny - r * 0.2);
            ctx.lineTo(nx + r * 0.9, ny - 18 * n.s);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(nx + r * 0.9, ny - 18 * n.s);
            ctx.lineTo(nx + 10 * n.s, ny - 14 * n.s);
            ctx.stroke();
        });
    }

    function drawCog(state, t, palette) {
        const { ctx, width, height } = state;
        drawBackdrop(state, palette);

        const bars = [0.32, 0.48, 0.41, 0.62, 0.56, 0.72];
        const barW = width * 0.09;
        bars.forEach((base, i) => {
            const h = height * (base + Math.sin(t * 1.25 + i * 0.7) * 0.06);
            const x = width * 0.1 + i * (barW + width * 0.04);
            const y = height * 0.88 - h;
            ctx.beginPath();
            ctx.rect(x, y, barW, h);
            ctx.fillStyle = i % 2 === 0 ? `${palette.primary}cc` : `${palette.tertiary}cc`;
            ctx.fill();
        });

        ctx.strokeStyle = `${palette.ink}cc`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 4) {
            const y = height * 0.3 + Math.sin(x * 0.045 + t * 1.5) * height * 0.09;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        animateParticles(state, palette);
    }

    function drawByKind(state, t, palette) {
        switch (state.kind) {
            case 'rag':
                drawRag(state, t, palette);
                break;
            case 'graphrag':
                drawGraphRag(state, t, palette);
                break;
            case 'mage':
                drawMage(state, t, palette);
                break;
            case 'doremi':
                drawDoReMi(state, t, palette);
                break;
            case 'cog':
                drawCog(state, t, palette);
                break;
            default:
                drawBackdrop(state, palette);
        }
    }

    cards.forEach((card) => {
        const canvas = card.querySelector('.project-visual-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const state = {
            kind: card.dataset.projectVisual || 'default',
            canvas,
            ctx,
            width: 0,
            height: 0,
            particles: [],
            resizeObserver: null
        };
        ensureSize(state);
        if ('ResizeObserver' in window) {
            state.resizeObserver = new ResizeObserver(() => ensureSize(state));
            state.resizeObserver.observe(canvas);
        }
        states.push(state);
    });

    if (!states.length) return;

    const render = (t) => {
        const palette = getPalette();
        states.forEach((state) => {
            ensureSize(state);
            drawByKind(state, t, palette);
        });
    };

    const step = (now) => {
        const t = now * 0.001;
        render(t);
        animationFrame = window.requestAnimationFrame(step);
    };

    if (prefersReducedMotion.matches) {
        render(0);
    } else {
        animationFrame = window.requestAnimationFrame(step);
    }

    prefersReducedMotion.addEventListener('change', (event) => {
        if (event.matches) {
            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
            render(0);
            return;
        }
        if (animationFrame === null) {
            animationFrame = window.requestAnimationFrame(step);
        }
    });

    const htmlClassObserver = new MutationObserver(() => {
        if (prefersReducedMotion.matches) render(0);
    });
    htmlClassObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

function initArtTechSection() {
    const canvas = document.getElementById('art-tech-canvas');
    const video = document.getElementById('art-tech-video');
    const tryItButton = document.getElementById('art-tech-camera-btn');
    const demoModeButton = document.getElementById('art-tech-demo-btn');
    const statusNode = document.getElementById('art-tech-status');
    const styleButtons = Array.from(document.querySelectorAll('[data-art-style]'));
    if (!canvas || !video || !tryItButton || !demoModeButton || !statusNode || !styleButtons.length) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const offscreenCanvas = document.createElement('canvas');
    const offscreenContext = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    const state = {
        pointerX: 0.5,
        pointerY: 0.5,
        smoothX: 0.5,
        smoothY: 0.5,
        width: 0,
        height: 0,
        devicePixelRatio: 1,
        style: 'constellation',
        mode: 'demo',
        particles: [],
        animationFrame: null,
        cameraStream: null,
        prevLuma: null,
        hasTrackerSignal: false
    };

    const stylePalette = {
        constellation: {
            bgA: '#050a18',
            bgB: '#080d20',
            stroke: '#7bd0ff',
            accent: '#4de082',
            glow: 'rgba(123, 208, 255, 0.9)'
        },
        ribbon: {
            bgA: '#0b0820',
            bgB: '#040816',
            stroke: '#9ab6ff',
            accent: '#7bd0ff',
            glow: 'rgba(154, 182, 255, 0.9)'
        },
        pulse: {
            bgA: '#081811',
            bgB: '#05100d',
            stroke: '#8cf4c8',
            accent: '#7bd0ff',
            glow: 'rgba(140, 244, 200, 0.9)'
        }
    };

    const particleCount = prefersReducedMotion.matches ? 42 : 110;
    state.particles = Array.from({ length: particleCount }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003,
        size: 0.8 + Math.random() * 2.3
    }));

    function updateStatus(text) {
        statusNode.textContent = text;
    }

    function updateStyleButtons() {
        styleButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.artStyle === state.style);
        });
    }

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        state.width = width;
        state.height = height;
        state.devicePixelRatio = devicePixelRatio;
        canvas.width = Math.floor(width * devicePixelRatio);
        canvas.height = Math.floor(height * devicePixelRatio);
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function stopCamera() {
        if (!state.cameraStream) return;
        state.cameraStream.getTracks().forEach((track) => track.stop());
        state.cameraStream = null;
        state.prevLuma = null;
        state.hasTrackerSignal = false;
    }

    function enableDemoMode(message) {
        state.mode = 'demo';
        if (message) updateStatus(message);
        else updateStatus('Demo mode active');
    }

    function readMotionFromVideo() {
        if (!offscreenContext || video.readyState < 2 || state.mode !== 'camera') return;

        const sampleWidth = 84;
        const sampleHeight = 60;
        if (offscreenCanvas.width !== sampleWidth || offscreenCanvas.height !== sampleHeight) {
            offscreenCanvas.width = sampleWidth;
            offscreenCanvas.height = sampleHeight;
            state.prevLuma = null;
        }

        offscreenContext.drawImage(video, 0, 0, sampleWidth, sampleHeight);
        const frame = offscreenContext.getImageData(0, 0, sampleWidth, sampleHeight).data;
        if (!state.prevLuma) {
            state.prevLuma = new Uint8ClampedArray(sampleWidth * sampleHeight);
            for (let i = 0; i < sampleWidth * sampleHeight; i += 1) {
                state.prevLuma[i] = (frame[i * 4] + frame[i * 4 + 1] + frame[i * 4 + 2]) / 3;
            }
            return;
        }

        let sumX = 0;
        let sumY = 0;
        let count = 0;
        const threshold = 22;

        for (let y = 0; y < sampleHeight; y += 1) {
            for (let x = 0; x < sampleWidth; x += 1) {
                const index = y * sampleWidth + x;
                const luma = (frame[index * 4] + frame[index * 4 + 1] + frame[index * 4 + 2]) / 3;
                const delta = Math.abs(luma - state.prevLuma[index]);
                if (delta > threshold) {
                    sumX += x;
                    sumY += y;
                    count += 1;
                }
                state.prevLuma[index] = luma;
            }
        }

        if (count > 20) {
            state.pointerX = 1 - (sumX / count) / sampleWidth;
            state.pointerY = (sumY / count) / sampleHeight;
            state.hasTrackerSignal = true;
            updateStatus('Camera live · move your hand');
        } else if (state.hasTrackerSignal) {
            updateStatus('Camera live · searching for motion');
        }
    }

    async function enableCameraMode() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            enableDemoMode('Camera unavailable · using demo mode');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 960 },
                    height: { ideal: 540 }
                },
                audio: false
            });

            stopCamera();
            state.cameraStream = stream;
            video.srcObject = stream;
            await video.play();
            state.mode = 'camera';
            state.prevLuma = null;
            state.hasTrackerSignal = false;
            updateStatus('Camera enabled · calibrating');
        } catch (error) {
            console.warn('[art-tech] camera permission denied or unavailable:', error);
            enableDemoMode('Camera denied · fallback demo mode');
        }
    }

    function drawBackdrop(time, palette) {
        const gradient = context.createLinearGradient(0, 0, state.width, state.height);
        gradient.addColorStop(0, palette.bgA);
        gradient.addColorStop(1, palette.bgB);
        context.fillStyle = gradient;
        context.fillRect(0, 0, state.width, state.height);

        const pulseRadius = Math.max(120, Math.min(state.width, state.height) * (0.18 + Math.sin(time * 1.3) * 0.04));
        context.save();
        context.globalCompositeOperation = 'screen';
        const glow = context.createRadialGradient(
            state.smoothX * state.width,
            state.smoothY * state.height,
            0,
            state.smoothX * state.width,
            state.smoothY * state.height,
            pulseRadius * 2.2
        );
        glow.addColorStop(0, `${palette.accent}6b`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        context.fillStyle = glow;
        context.fillRect(0, 0, state.width, state.height);
        context.restore();
    }

    function drawParticles(time, palette) {
        const targetX = state.smoothX;
        const targetY = state.smoothY;

        state.particles.forEach((particle, index) => {
            const dx = targetX - particle.x;
            const dy = targetY - particle.y;
            const distance = Math.max(0.0005, Math.hypot(dx, dy));
            const attraction = 0.00018 + (state.style === 'pulse' ? 0.0002 : 0.00012);
            const swirl = state.style === 'ribbon' ? 0.00022 : 0.00008;

            particle.vx += (dx / distance) * attraction + Math.sin(time + index * 0.2) * swirl * 0.4;
            particle.vy += (dy / distance) * attraction + Math.cos(time + index * 0.2) * swirl * 0.4;
            particle.vx *= 0.985;
            particle.vy *= 0.985;
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > 1) {
                particle.vx *= -0.9;
                particle.x = Math.min(1, Math.max(0, particle.x));
            }
            if (particle.y < 0 || particle.y > 1) {
                particle.vy *= -0.9;
                particle.y = Math.min(1, Math.max(0, particle.y));
            }
        });

        context.save();
        context.globalCompositeOperation = 'screen';
        for (let i = 0; i < state.particles.length; i += 1) {
            const particle = state.particles[i];
            const px = particle.x * state.width;
            const py = particle.y * state.height;
            const glowSize = particle.size * (state.style === 'pulse' ? 2.2 : 1.6);

            context.beginPath();
            context.arc(px, py, glowSize, 0, Math.PI * 2);
            context.fillStyle = i % 3 === 0 ? `${palette.accent}99` : `${palette.stroke}88`;
            context.fill();

            if (i % 4 === 0) {
                const other = state.particles[(i + 7) % state.particles.length];
                const ox = other.x * state.width;
                const oy = other.y * state.height;
                const lineDistance = Math.hypot(px - ox, py - oy);
                if (lineDistance < Math.min(state.width, state.height) * 0.22) {
                    context.beginPath();
                    context.strokeStyle = `${palette.stroke}44`;
                    context.lineWidth = 1;
                    context.moveTo(px, py);
                    context.lineTo(ox, oy);
                    context.stroke();
                }
            }
        }
        context.restore();

        if (state.style === 'ribbon') {
            context.save();
            context.strokeStyle = `${palette.stroke}66`;
            context.lineWidth = 2.4;
            context.beginPath();
            for (let i = 0; i <= 48; i += 1) {
                const x = (i / 48) * state.width;
                const y = state.smoothY * state.height + Math.sin(i * 0.35 + time * 2.2) * 18;
                if (i === 0) context.moveTo(x, y);
                else context.lineTo(x, y);
            }
            context.stroke();
            context.restore();
        }
    }

    function drawPointerOrb(palette) {
        const x = state.smoothX * state.width;
        const y = state.smoothY * state.height;

        context.save();
        context.shadowColor = palette.glow;
        context.shadowBlur = 24;
        context.fillStyle = palette.accent;
        context.beginPath();
        context.arc(x, y, 5.8, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }

    function animate(now) {
        const time = now * 0.001;
        const palette = stylePalette[state.style] || stylePalette.constellation;

        if (state.mode === 'camera') {
            readMotionFromVideo();
        } else {
            state.pointerX = 0.5 + Math.sin(time * 0.78) * 0.22;
            state.pointerY = 0.5 + Math.cos(time * 1.05) * 0.2;
        }

        state.smoothX += (state.pointerX - state.smoothX) * 0.12;
        state.smoothY += (state.pointerY - state.smoothY) * 0.12;

        drawBackdrop(time, palette);
        drawParticles(time, palette);
        drawPointerOrb(palette);

        state.animationFrame = window.requestAnimationFrame(animate);
    }

    styleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            state.style = button.dataset.artStyle || 'constellation';
            updateStyleButtons();
        });
    });

    canvas.addEventListener('pointermove', (event) => {
        const bounds = canvas.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        state.pointerX = (event.clientX - bounds.left) / bounds.width;
        state.pointerY = (event.clientY - bounds.top) / bounds.height;
    });

    tryItButton.addEventListener('click', () => {
        enableCameraMode();
    });

    demoModeButton.addEventListener('click', () => {
        stopCamera();
        enableDemoMode('Demo mode active');
    });

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pagehide', stopCamera);
    window.addEventListener('beforeunload', stopCamera);

    prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) {
            state.particles.splice(42);
        } else if (state.particles.length < 100) {
            const extras = Array.from({ length: 68 }, () => ({
                x: Math.random(),
                y: Math.random(),
                vx: (Math.random() - 0.5) * 0.003,
                vy: (Math.random() - 0.5) * 0.003,
                size: 0.8 + Math.random() * 2.3
            }));
            state.particles.push(...extras);
        }
    });

    resizeCanvas();
    updateStyleButtons();
    if (state.animationFrame === null) {
        state.animationFrame = window.requestAnimationFrame(animate);
    }
}
