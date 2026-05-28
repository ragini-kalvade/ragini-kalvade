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
        links: {
            github: 'https://github.com/ragini-kalvade/AI-Prophets-Forecasting404',
            demo: 'https://youtu.be/i8Kv7EjxVyQ'
        },
        visualType: 'forecast',
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
        links: {
            github: 'https://github.com/rkalv/MSR-Research-GraphRAG-Cloud-Pipeline',
            demo: 'https://youtu.be/Xj0raJIpaqg'
        },
        visualType: 'graphrag',
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
        links: {
            github: 'https://github.com/rkalv/incremental-spark-rag-pipeline',
            demo: 'https://youtu.be/Nf04b2GoBq4'
        },
        visualType: 'rag',
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
        links: {
            publication: 'https://dl.acm.org/doi/10.1145/3776734.3794611'
        },
        visualType: 'doremi',
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

function ProjectVisualCanvas({ type, visualDescription, visualCaption }) {
    const nodes = DIAGRAM_NODES[type] || ['Input', 'Process', 'Output'];
    const figure = document.createElement('figure');
    figure.className = 'project-visual';

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

function buildProjectLinks(project) {
    const links = project.links || {};
    const items = [];
    if (links.github) {
        items.push({ href: links.github, label: 'GitHub', aria: `GitHub repository for ${project.title}` });
    }
    if (links.demo) {
        items.push({ href: links.demo, label: 'Demo', aria: `Demo video for ${project.title}` });
    }
    if (links.publication) {
        items.push({ href: links.publication, label: 'Publication', aria: `Publication for ${project.title}` });
    }
    if (links.caseStudy) {
        items.push({ href: links.caseStudy, label: 'Case Study', aria: `Case study for ${project.title}` });
    }
    return items.map(({ href, label, aria }) =>
        `<a href="${href}" target="_blank" rel="noopener" class="project-card-link" aria-label="${escapeHtml(aria)}">${label} <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>`
    ).join('');
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = '';

    PROJECTS.forEach((project) => {
        const article = document.createElement('article');
        article.className = 'project-card group';

        const visualWrap = document.createElement('div');
        visualWrap.className = 'project-card-visual hud-frame';
        visualWrap.appendChild(ProjectVisualCanvas({
            type: project.visualType,
            visualDescription: project.visualDescription,
            visualCaption: project.visualCaption
        }));
        article.appendChild(visualWrap);

        const body = document.createElement('div');
        body.className = 'project-card-body glass-panel';
        body.innerHTML = `
            <div class="project-card-meta">
                <span class="project-card-number mono-accent">${escapeHtml(project.number)}</span>
                <span class="project-card-category mono-accent">${escapeHtml(project.category)}</span>
            </div>
            <h3>${escapeHtml(project.title)}</h3>
            <p class="project-card-outcome">${escapeHtml(project.outcome)}</p>
            <ul class="project-card-bullets">
                ${project.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
            <div class="project-card-tags">
                ${project.tech.map((t) => `<span class="brutal-chip">${escapeHtml(t)}</span>`).join('')}
            </div>
            <div class="project-card-links project-card-links-row">
                ${buildProjectLinks(project)}
            </div>
        `;
        article.appendChild(body);
        grid.appendChild(article);
    });

    const explore = document.createElement('article');
    explore.className = 'project-card group project-card-explore';
    explore.innerHTML = `
        <div class="project-card-visual hud-frame project-card-visual-explore">
            <div class="project-card-explore-icon" aria-hidden="true"><i class="fab fa-github"></i></div>
        </div>
        <div class="project-card-body glass-panel">
            <div class="project-card-meta">
                <span class="project-card-number mono-accent">+</span>
                <span class="project-card-category mono-accent">Open Source</span>
            </div>
            <h3>Explore My GitHub</h3>
            <p class="project-card-outcome">More engineering work, experiments, and research repositories.</p>
            <div class="project-card-links project-card-links-row">
                <a href="https://github.com/ragini-kalvade" target="_blank" rel="noopener" class="project-card-link" aria-label="View Ragini Kalvade GitHub profile">GitHub <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
            </div>
        </div>
    `;
    grid.appendChild(explore);
}

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    initArchiveStaggerReveal();
    initMobileMenu();
    initActiveNav();
    initRotatingWords();
    initSkillTabs();
    initExperienceTabs();
    initArtTechFiveModes();
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
        archiveSection.querySelectorAll('.archive-grid > .project-card')
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

function initArtTechFiveModes() {
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
    const BG = { wave: '#00050f', circuit: '#021a0a', ascii: '#050a00', glass: '#0d0608' };
    const CHARS = '@#B%8&WM*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`. ';

    let width = 0;
    let height = 0;
    let mode = 'wave';
    let lastLandmarks = null;
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

    const circuitLines = [];
    const shadowTrail = [];
    let voronoiImage = null;
    let lastGlassSeed = '';

    function resize() {
        width = stage.clientWidth;
        height = stage.clientHeight;
        canvas.width = width;
        canvas.height = height;
        voronoiImage = null;
        lastGlassSeed = '';
    }

    function setMode(nextMode) {
        if (mode !== nextMode) {
            modeTransitionAlpha = 0.28;
        }
        mode = nextMode;
        artSection.dataset.artTheme = nextMode;
        modeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.artMode === nextMode);
        });
    }

    function refreshPreviewVisibility() {
        const show = cameraActive && previewEnabled;
        video.classList.toggle('is-live', show);
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

    function fingertipPoints(landmarks) {
        return TIPS.map((i) => point(landmarks, i));
    }

    function classifyGesture(landmarks) {
        const extension = [8, 12, 16, 20].map((tip, i) => landmarks[tip].y < landmarks[[6, 10, 14, 18][i]].y);
        const raised = extension.filter(Boolean).length;
        const pinch = Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y) < 0.07;
        if (pinch) return 'pinch';
        if (raised === 0) return 'fist';
        if (raised === 1 && extension[0]) return 'point';
        if (raised === 2 && extension[0] && extension[1]) return 'peace';
        if (raised === 4) return 'open hand';
        return 'hand';
    }

    function drawWave(time) {
        const landmarks = lastLandmarks;
        for (let wave = 0; wave < 5; wave += 1) {
            let centerX = width / 2;
            let centerY = height / 2;
            let amplitude = height * 0.12;
            const frequency = 2 + wave;
            if (landmarks) {
                const tip = point(landmarks, TIPS[wave]);
                centerX = tip.x;
                centerY = tip.y;
                amplitude = height * 0.08 + Math.hypot(landmarks[TIPS[wave]].x - 0.5, landmarks[TIPS[wave]].y - 0.5) * height * 0.18;
            }
            const hue = 190 + wave * 30 + time * 15;
            context.strokeStyle = `hsla(${hue},85%,65%,0.7)`;
            context.lineWidth = 1.5;
            context.beginPath();
            for (let x = 0; x < width; x += 2) {
                const phase = (x / width) * Math.PI * 2 * frequency + time * (1.5 + wave * 0.3);
                const deltaX = (x - centerX) / width;
                const envelope = Math.exp(-deltaX * deltaX * 4);
                const y = centerY + Math.sin(phase) * amplitude * envelope;
                if (x === 0) context.moveTo(x, y);
                else context.lineTo(x, y);
            }
            context.stroke();
        }
        if (landmarks) {
            CONN.forEach(([a, b]) => {
                context.strokeStyle = 'rgba(100,200,255,0.1)';
                context.lineWidth = 0.8;
                context.beginPath();
                context.moveTo(xAt(landmarks, a), yAt(landmarks, a));
                context.lineTo(xAt(landmarks, b), yAt(landmarks, b));
                context.stroke();
            });
            fingertipPoints(landmarks).forEach((p, i) => {
                const hue = 190 + i * 30 + time * 15;
                context.beginPath();
                context.arc(p.x, p.y, 5, 0, Math.PI * 2);
                context.fillStyle = `hsla(${hue},90%,70%,0.9)`;
                context.fill();
                context.beginPath();
                context.arc(p.x, p.y, 12, 0, Math.PI * 2);
                context.strokeStyle = `hsla(${hue},90%,70%,0.25)`;
                context.lineWidth = 1.5;
                context.stroke();
            });
            return;
        }
        for (let wave = 0; wave < 5; wave += 1) {
            const hue = 190 + wave * 30 + time * 15;
            context.strokeStyle = `hsla(${hue},80%,60%,0.5)`;
            context.lineWidth = 1.2;
            context.beginPath();
            for (let x = 0; x < width; x += 2) {
                const y = height / 2 + Math.sin((x / width) * Math.PI * 2 * (2 + wave) + time * (1.2 + wave * 0.25)) * height * (0.06 + wave * 0.02);
                if (x === 0) context.moveTo(x, y);
                else context.lineTo(x, y);
            }
            context.stroke();
        }
    }

    function drawCircuit(time) {
        const landmarks = lastLandmarks;
        const nodes = landmarks
            ? fingertipPoints(landmarks)
            : Array.from({ length: 5 }, (_, i) => {
                const angle = time * 0.3 + i * Math.PI * 2 / 5;
                return { x: width / 2 + Math.cos(angle) * width * 0.28, y: height / 2 + Math.sin(angle) * height * 0.28 };
            });

        if (landmarks && Math.random() < 0.15) {
            const a = nodes[Math.floor(Math.random() * nodes.length)];
            const b = nodes[Math.floor(Math.random() * nodes.length)];
            circuitLines.push({ x1: a.x, y1: a.y, x2: b.x, y2: a.y, x3: b.x, y3: b.y, life: 1, hue: 120 + Math.random() * 60 });
        }
        circuitLines.forEach((line) => {
            line.life -= 0.008;
            context.strokeStyle = `hsla(${line.hue},90%,55%,${line.life * 0.6})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(line.x1, line.y1);
            context.lineTo(line.x2, line.y2);
            context.lineTo(line.x3, line.y3);
            context.stroke();
        });
        for (let i = circuitLines.length - 1; i >= 0; i -= 1) {
            if (circuitLines[i].life <= 0) circuitLines.splice(i, 1);
        }

        if (landmarks) {
            CONN.forEach(([a, b]) => {
                const pA = point(landmarks, a);
                const pB = point(landmarks, b);
                context.strokeStyle = 'rgba(110,231,183,0.18)';
                context.lineWidth = 0.8;
                context.beginPath();
                context.moveTo(pA.x, pA.y);
                context.lineTo(pB.x, pA.y);
                context.lineTo(pB.x, pB.y);
                context.stroke();
            });
        }
        for (let i = 0; i < nodes.length; i += 1) {
            for (let j = i + 1; j < nodes.length; j += 1) {
                const a = nodes[i];
                const b = nodes[j];
                context.strokeStyle = 'rgba(110,231,183,0.22)';
                context.lineWidth = 1;
                context.setLineDash([4, 6]);
                context.beginPath();
                context.moveTo(a.x, a.y);
                context.lineTo(b.x, a.y);
                context.lineTo(b.x, b.y);
                context.stroke();
                context.setLineDash([]);
            }
        }
        nodes.forEach((node, i) => {
            const pulse = Math.sin(time * 3 + i) * 3;
            context.beginPath();
            context.arc(node.x, node.y, 6 + pulse, 0, Math.PI * 2);
            context.fillStyle = '#6ee7b7';
            context.fill();
            context.beginPath();
            context.arc(node.x, node.y, 12 + pulse, 0, Math.PI * 2);
            context.strokeStyle = 'rgba(110,231,183,0.4)';
            context.lineWidth = 1.5;
            context.stroke();
            context.beginPath();
            context.arc(node.x, node.y, 20 + pulse, 0, Math.PI * 2);
            context.strokeStyle = 'rgba(110,231,183,0.12)';
            context.lineWidth = 1;
            context.stroke();
            context.fillStyle = '#6ee7b7';
            context.font = '9px monospace';
            context.fillText(`0${i + 1}`, node.x + 14, node.y - 10);
        });
        context.strokeStyle = 'rgba(110,231,183,0.06)';
        context.lineWidth = 0.5;
        for (let x = 0; x < width; x += 24) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, height);
            context.stroke();
        }
        for (let y = 0; y < height; y += 24) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(width, y);
            context.stroke();
        }
    }

    function drawAscii(time) {
        const landmarks = lastLandmarks;
        const charWidth = 9;
        const charHeight = 11;
        const columns = Math.floor(width / charWidth);
        const rows = Math.floor(height / charHeight);
        context.font = `${charHeight - 1}px monospace`;
        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < columns; col += 1) {
                const px = col / columns;
                const py = row / rows;
                let value = 0;
                if (landmarks) {
                    TIPS.forEach((tipIndex) => {
                        const dx = px - landmarks[tipIndex].x;
                        const dy = py - landmarks[tipIndex].y;
                        value += Math.exp(-(dx * dx + dy * dy) * 18) * 1.2;
                    });
                    CONN.forEach(([a, b]) => {
                        const ax = 1 - landmarks[a].x;
                        const ay = landmarks[a].y;
                        const bx = 1 - landmarks[b].x;
                        const by = landmarks[b].y;
                        const ratio = Math.max(0, Math.min(1, ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2 + 1e-9)));
                        const distance = Math.hypot(px - (ax + ratio * (bx - ax)), py - (ay + ratio * (by - ay)));
                        value += Math.exp(-distance * distance * 80) * 0.5;
                    });
                } else {
                    value = Math.abs(Math.sin(px * 8 + time) * Math.sin(py * 6 + time * 0.7));
                }
                value = Math.min(1, value);
                const charIndex = Math.floor((1 - value) * (CHARS.length - 1));
                const char = CHARS[charIndex];
                if (char === ' ') continue;
                context.fillStyle = `hsla(140,70%,${Math.floor(30 + value * 50)}%,${0.5 + value * 0.5})`;
                context.fillText(char, col * charWidth, row * charHeight + charHeight);
            }
        }
    }

    function drawGlass(time) {
        const landmarks = lastLandmarks;
        const seeds = landmarks
            ? Array.from({ length: 21 }, (_, i) => ({ x: xAt(landmarks, i), y: yAt(landmarks, i), h: (i * 37 + time * 8) % 360, seedIndex: i }))
            : Array.from({ length: 9 }, (_, i) => {
                const angle = time * 0.2 + i * Math.PI * 2 / 9;
                const radius = width * 0.2 + Math.sin(time * 0.5 + i) * width * 0.1;
                return { x: width / 2 + Math.cos(angle) * radius, y: height / 2 + Math.sin(angle) * radius, h: i * 40, seedIndex: i };
            });

        const seedKey = seeds.map((seed) => `${Math.round(seed.x / 8)},${Math.round(seed.y / 8)}`).join('|');
        if (seedKey !== lastGlassSeed) {
            lastGlassSeed = seedKey;
            const step = 10;
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = width;
            tmpCanvas.height = height;
            const tmpContext = tmpCanvas.getContext('2d');
            if (!tmpContext) return;
            for (let y = 0; y < height; y += step) {
                for (let x = 0; x < width; x += step) {
                    let bestDistance = Infinity;
                    let bestSeed = seeds[0];
                    seeds.forEach((seed) => {
                        const distance = (x - seed.x) ** 2 + (y - seed.y) ** 2;
                        if (distance < bestDistance) {
                            bestDistance = distance;
                            bestSeed = seed;
                        }
                    });
                    const isTip = TIPS.includes(bestSeed.seedIndex);
                    tmpContext.fillStyle = `hsla(${bestSeed.h},75%,${isTip ? 65 : 45}%,0.82)`;
                    tmpContext.fillRect(x, y, step, step);
                }
            }
            tmpContext.strokeStyle = 'rgba(5,2,8,0.9)';
            tmpContext.lineWidth = 2;
            for (let y = 0; y < height; y += step) {
                tmpContext.beginPath();
                tmpContext.moveTo(0, y);
                tmpContext.lineTo(width, y);
                tmpContext.stroke();
            }
            for (let x = 0; x < width; x += step) {
                tmpContext.beginPath();
                tmpContext.moveTo(x, 0);
                tmpContext.lineTo(x, height);
                tmpContext.stroke();
            }
            voronoiImage = tmpCanvas;
        }
        if (voronoiImage) context.drawImage(voronoiImage, 0, 0);
        const glow = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.5);
        glow.addColorStop(0, 'rgba(255,240,200,0.06)');
        glow.addColorStop(1, 'rgba(255,240,200,0)');
        context.fillStyle = glow;
        context.fillRect(0, 0, width, height);
    }

    function drawHandSilhouette(points, alpha) {
        context.fillStyle = `rgba(5,2,1,${alpha})`;
        context.strokeStyle = `rgba(5,2,1,${alpha})`;
        CONN.forEach(([a, b]) => {
            context.lineWidth = 10;
            context.lineCap = 'round';
            context.beginPath();
            context.moveTo(points[a].x, points[a].y);
            context.lineTo(points[b].x, points[b].y);
            context.stroke();
        });
        [0, 5, 9, 13, 17].forEach((i) => {
            context.beginPath();
            context.arc(points[i].x, points[i].y, 8, 0, Math.PI * 2);
            context.fill();
        });
    }

    function drawShadow(time) {
        const landmarks = lastLandmarks;
        const warmBg = context.createLinearGradient(0, 0, width, height);
        warmBg.addColorStop(0, '#2a0e00');
        warmBg.addColorStop(1, '#0d0300');
        context.fillStyle = warmBg;
        context.fillRect(0, 0, width, height);
        context.fillStyle = 'rgba(255,130,40,0.05)';
        context.beginPath();
        context.ellipse(width / 2, height * 0.52, width * 0.32, height * 0.4, 0, 0, Math.PI * 2);
        context.fill();

        if (landmarks) {
            const allPoints = Array.from({ length: 21 }, (_, i) => ({ x: xAt(landmarks, i), y: yAt(landmarks, i) }));
            shadowTrail.push(allPoints.map((p) => ({ ...p })));
            if (shadowTrail.length > 6) shadowTrail.shift();
            shadowTrail.forEach((trailFrame, frameIndex) => drawHandSilhouette(trailFrame, ((frameIndex + 1) / shadowTrail.length) * 0.108));
            drawHandSilhouette(allPoints, 0.95);
            TIPS.forEach((tip, i) => {
                const p = point(landmarks, tip);
                context.beginPath();
                context.arc(p.x, p.y, 4, 0, Math.PI * 2);
                context.fillStyle = `rgba(255,${100 + i * 20},20,0.7)`;
                context.fill();
            });
            const base = point(landmarks, 0);
            context.beginPath();
            context.ellipse(base.x, base.y + 8, 18, 6, 0, 0, Math.PI * 2);
            context.fillStyle = 'rgba(0,0,0,0.5)';
            context.fill();
        } else {
            const idlePoints = Array.from({ length: 21 }, (_, i) => {
                const finger = Math.floor(i / 4);
                const segment = i % 4;
                const baseX = width / 2 + (finger - 2) * 35;
                const baseY = height * 0.7;
                return { x: baseX + Math.sin(time * 0.8 + finger) * 10, y: baseY - segment * 45 - Math.sin(time * 0.6 + finger + segment) * 8 };
            });
            drawHandSilhouette(idlePoints, 0.7);
        }

        context.fillStyle = 'rgba(255,100,20,0.35)';
        context.beginPath();
        context.ellipse(width / 2, height * 0.92, width * 0.45, height * 0.06, 0, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = 'rgba(255,100,20,0.12)';
        context.beginPath();
        context.ellipse(width / 2, height * 0.92, width * 0.55, height * 0.1, 0, 0, Math.PI * 2);
        context.fill();
    }

    function drawFrame() {
        frame += 1;
        const time = frame * 0.016;
        context.fillStyle = BG[mode];
        if (mode === 'wave' || mode === 'ascii') {
            context.fillRect(0, 0, width, height);
        } else if (mode === 'circuit') {
            context.fillStyle = 'rgba(2,26,10,0.25)';
            context.fillRect(0, 0, width, height);
        } else if (mode === 'glass') {
            context.fillStyle = 'rgba(13,6,8,0.4)';
            context.fillRect(0, 0, width, height);
        }

        if (mode === 'wave') drawWave(time);
        else if (mode === 'circuit') drawCircuit(time);
        else if (mode === 'ascii') drawAscii(time);
        else if (mode === 'glass') drawGlass(time);

        if (modeTransitionAlpha > 0.002) {
            context.fillStyle = `rgba(8, 12, 24, ${modeTransitionAlpha})`;
            context.fillRect(0, 0, width, height);
            modeTransitionAlpha *= 0.86;
        } else {
            modeTransitionAlpha = 0;
        }

        animationFrameId = window.requestAnimationFrame(drawFrame);
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
        outContext.fillText('created with hand art', 14, height - footerHeight / 2);

        const handle = '@Ragini Kalvade';
        const handleWidth = outContext.measureText(handle).width;
        outContext.fillStyle = 'rgba(255,255,255,0.7)';
        outContext.fillText(handle, width - handleWidth - 14, height - footerHeight / 2);

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
        shadowTrail.length = 0;
        circuitLines.length = 0;
    }

    function updateGesturePill() {
        const gesture = lastLandmarks
            ? classifyGesture(lastLandmarks)
            : (cameraActive ? 'waiting for motion' : (demoMode ? 'canvas idle' : 'raise a hand'));
        gPill.textContent = gesture;
        gPill.classList.toggle('is-live', Boolean(lastLandmarks));
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
            return;
        }

        intro.style.display = 'none';
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });
            video.srcObject = stream;
            await new Promise((resolve) => {
                video.onloadedmetadata = resolve;
            });
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
            if (animationFrameId === null) drawFrame();
        } catch (error) {
            console.warn('[art-tech] camera start failed:', error);
            cameraActive = false;
            demoMode = true;
            updateDemoToggleUI();
            refreshPreviewVisibility();
            intro.style.display = 'flex';
            cameraButton.textContent = 'retry (allow camera)';
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
        if (animationFrameId === null) drawFrame();
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
        button.addEventListener('click', () => {
            setMode(button.dataset.artMode || 'wave');
        });
    });
    cameraButton.addEventListener('click', boot);
    introDemoButton.addEventListener('click', startDemoExperience);
    saveButton.addEventListener('click', saveFrame);
    demoToggleButton.addEventListener('click', () => {
        if (demoMode) {
            boot();
        } else {
            startDemoExperience();
        }
    });
    previewToggleButton.addEventListener('click', () => {
        previewEnabled = !previewEnabled;
        updatePreviewToggleUI();
        refreshPreviewVisibility();
    });
    fullscreenButton.addEventListener('click', () => {
        toggleFullscreen().catch(() => {});
    });
    window.addEventListener('resize', resize);
    window.addEventListener('pagehide', stopSession);
    window.addEventListener('beforeunload', stopSession);
    document.addEventListener('fullscreenchange', updateFullscreenUI);
    initNavSoftening();

    resize();
    stage.classList.add('is-blooming');
    window.setTimeout(() => stage.classList.remove('is-blooming'), 1400);
    setMode(mode);
    updateDemoToggleUI();
    updatePreviewToggleUI();
    updateFullscreenUI();
    updateGesturePill();
    if (animationFrameId === null) drawFrame();
}
