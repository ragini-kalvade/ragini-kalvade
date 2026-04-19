import * as THREE from 'three';

const canvas = document.getElementById('signal-globe');
if (canvas) initGlobe(canvas);

function initGlobe(canvas) {
    const wrap = canvas.parentElement;
    const labelLayer = document.getElementById('globe-labels');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const PRIMARY = 0x7bd0ff;
    const TERTIARY = 0x4de082;
    const BG = 0x0b1326;
    const RADIUS = 1;

    const globe = new THREE.Group();
    scene.add(globe);

    const inner = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * 0.985, 64, 48),
        new THREE.MeshBasicMaterial({ color: BG, transparent: true, opacity: 0.92 })
    );
    globe.add(inner);

    const wireMesh = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(RADIUS, 3)),
        new THREE.LineBasicMaterial({ color: PRIMARY, transparent: true, opacity: 0.08 })
    );
    globe.add(wireMesh);

    const dotTexture = makeCircleTexture();
    const dotsCount = 3500;
    const dotsPositions = new Float32Array(dotsCount * 3);
    for (let i = 0; i < dotsCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        dotsPositions[i * 3 + 0] = RADIUS * Math.sin(phi) * Math.cos(theta);
        dotsPositions[i * 3 + 1] = RADIUS * Math.sin(phi) * Math.sin(theta);
        dotsPositions[i * 3 + 2] = RADIUS * Math.cos(phi);
    }
    const dotsGeom = new THREE.BufferGeometry();
    dotsGeom.setAttribute('position', new THREE.BufferAttribute(dotsPositions, 3));
    const dotsMat = new THREE.PointsMaterial({
        color: PRIMARY,
        size: 0.022,
        map: dotTexture,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        sizeAttenuation: true,
        alphaTest: 0.05,
    });
    globe.add(new THREE.Points(dotsGeom, dotsMat));

    loadCountryBorders(globe, PRIMARY, RADIUS);

    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * 1.08, 48, 32),
        new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.BackSide,
            uniforms: { uColor: { value: new THREE.Color(PRIMARY) } },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                uniform vec3 uColor;
                void main() {
                    float intensity = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                    gl_FragColor = vec4(uColor, 1.0) * intensity;
                }
            `,
        })
    );
    globe.add(atmosphere);

    // Featured cities — the places that matter.
    // Edit `years` / `note` to taste; set years to '' to hide the caption.
    // `labelOffset` is a screen-space nudge in pixels, used to space out labels
    // that would otherwise overlap (e.g. Mumbai/Pune/Indore clustered in India).
    // `intro` is shown when the marker is clicked — edit freely.
    const markedCities = [
        {
            name: 'Indore',
            lat: 22.7196, lon: 75.8577,
            years: '2013-2022',
            labelOffset: { x: 0, y: -52 },
            role: 'Hometown',
            intro: 'Where the engineering spark ignited — high school years, endless math problem sets, and the first lines of code that shaped everything after.',
        },
        {
            name: 'Mumbai',
            lat: 19.0760, lon: 72.8777,
            years: '2000-2006',
            labelOffset: { x: -78, y: 18 },
            role: 'Early Years',
            intro: "My earliest memories of India's most electric city — where the idea that anything was buildable first took root.",
        },
        {
            name: 'Pune',
            lat: 18.5204, lon: 73.8567,
            years: '2022-2024',
            labelOffset: { x: 72, y: 40 },
            role: 'Deutsche Bank',
            intro: 'Senior Analyst on Corporate Bank Tech — shipped distributed systems for Letters of Credit and Bank Guarantees, cutting trade processing latency from 4 days to 2 minutes.',
        },
        {
            name: 'Singapore',
            lat: 1.3521, lon: 103.8198,
            years: '2007-2013',
            labelOffset: { x: 0, y: 0 },
            role: 'Middle School',
            intro: 'Formative school years abroad — first encounters with scientific computing, robotics clubs, and a city that runs like a well-tuned operating system.',
        },
        {
            name: 'Chicago',
            lat: 41.8781, lon: -87.6298,
            years: '2024-',
            labelOffset: { x: 0, y: 0 },
            role: 'UIC',
            intro: "MS in Computer Science at the University of Illinois Chicago and Research Developer at the Fall Prevention Lab — building cognitive-rehab training platforms for older adults.",
        },
    ];

    // Additional hubs used only as extra arc endpoints for visual variety
    const extraHubs = [
        { lat: 37.77, lon: -122.41 },
        { lat: 40.71, lon:  -74.00 },
        { lat: 51.50, lon:   -0.12 },
        { lat: 48.85, lon:    2.35 },
        { lat: 35.68, lon:  139.69 },
        { lat: -33.86, lon: 151.21 },
        { lat: 25.20, lon:   55.27 },
    ];

    function latLonToVec3(lat, lon, r = RADIUS) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lon + 180) * Math.PI / 180;
        return new THREE.Vector3(
            -r * Math.sin(phi) * Math.cos(theta),
             r * Math.cos(phi),
             r * Math.sin(phi) * Math.sin(theta)
        );
    }

    // Featured city markers: larger dot + pulsing ring + outer halo
    const markedGroup = new THREE.Group();
    globe.add(markedGroup);

    // SVG layer for thin connector lines from marker dot -> offset label
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const connectorSvg = document.createElementNS(SVG_NS, 'svg');
    connectorSvg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;';
    labelLayer.appendChild(connectorSvg);

    const markedList = markedCities.map((c) => {
        const pos = latLonToVec3(c.lat, c.lon, RADIUS * 1.002);

        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.024, 14, 14),
            new THREE.MeshBasicMaterial({ color: TERTIARY })
        );
        dot.position.copy(pos);
        markedGroup.add(dot);

        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.034, 0.046, 32),
            new THREE.MeshBasicMaterial({ color: TERTIARY, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
        );
        ring.position.copy(pos);
        ring.lookAt(pos.clone().multiplyScalar(2));
        markedGroup.add(ring);

        const halo = new THREE.Mesh(
            new THREE.RingGeometry(0.05, 0.12, 48),
            new THREE.MeshBasicMaterial({ color: TERTIARY, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
        );
        halo.position.copy(pos);
        halo.lookAt(pos.clone().multiplyScalar(2));
        markedGroup.add(halo);

        const label = document.createElement('div');
        label.style.cssText = [
            'position:absolute',
            'transform:translate(-50%, -130%)',
            'pointer-events:none',
            'font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace',
            'letter-spacing:0.16em',
            'text-transform:uppercase',
            'background:rgba(11,19,38,0.75)',
            'border:1px solid rgba(77,224,130,0.35)',
            'padding:4px 9px',
            'border-radius:4px',
            'white-space:nowrap',
            'backdrop-filter:blur(6px)',
            'transition:opacity 120ms ease',
            'will-change:transform,opacity',
            'text-align:center',
            'line-height:1.1',
        ].join(';');

        const nameEl = document.createElement('div');
        nameEl.textContent = c.name;
        nameEl.style.cssText = 'font-size:10px;color:#4de082;font-weight:600;';
        label.appendChild(nameEl);

        if (c.years) {
            const yearsEl = document.createElement('div');
            yearsEl.textContent = c.years;
            yearsEl.style.cssText = 'font-size:8.5px;color:#7bd0ff;opacity:0.85;margin-top:2px;letter-spacing:0.2em;';
            label.appendChild(yearsEl);
        }

        // Make the label clickable so it opens the info card
        label.style.pointerEvents = 'auto';
        label.style.cursor = 'pointer';
        label.addEventListener('mouseenter', () => {
            label.style.background = 'rgba(11, 19, 38, 0.92)';
            label.style.borderColor = 'rgba(77, 224, 130, 0.75)';
            label.style.transform = 'translate(-50%, -130%) scale(1.06)';
        });
        label.addEventListener('mouseleave', () => {
            label.style.background = 'rgba(11, 19, 38, 0.75)';
            label.style.borderColor = 'rgba(77, 224, 130, 0.35)';
            label.style.transform = 'translate(-50%, -130%) scale(1)';
        });
        label.addEventListener('pointerdown', (e) => e.stopPropagation());

        labelLayer.appendChild(label);

        const offset = c.labelOffset || { x: 0, y: 0 };
        const hasOffset = offset.x !== 0 || offset.y !== 0;

        let connector = null;
        if (hasOffset) {
            connector = document.createElementNS(SVG_NS, 'line');
            connector.setAttribute('stroke', 'rgba(77, 224, 130, 0.45)');
            connector.setAttribute('stroke-width', '1');
            connector.setAttribute('stroke-dasharray', '2 3');
            connectorSvg.appendChild(connector);
        }

        const entry = {
            city: c,
            pos,
            worldPos: new THREE.Vector3(),
            dot, ring, halo, label,
            offset,
            connector,
            active: false,
        };

        label.addEventListener('click', (e) => {
            e.stopPropagation();
            openCard(entry);
        });

        return entry;
    });

    // --- Info card (click a city to open) ---------------------------------
    const card = document.createElement('div');
    card.style.cssText = [
        'position:absolute',
        'left:12px',
        'right:12px',
        'bottom:12px',
        'z-index:20',
        'background:rgba(23, 31, 51, 0.92)',
        'backdrop-filter:blur(18px)',
        '-webkit-backdrop-filter:blur(18px)',
        'border:1px solid rgba(123, 208, 255, 0.32)',
        'border-radius:12px',
        'padding:16px 18px 18px',
        'color:#dae2fd',
        'pointer-events:auto',
        'opacity:0',
        'transform:translateY(14px)',
        'transition:opacity 220ms ease, transform 220ms ease',
        'visibility:hidden',
        'box-shadow:0 12px 40px -12px rgba(0, 0, 0, 0.6)',
    ].join(';');
    card.innerHTML = `
        <button type="button" data-card-close style="
            position:absolute; top:10px; right:10px;
            width:28px; height:28px; display:flex; align-items:center; justify-content:center;
            background:rgba(45, 52, 73, 0.8); color:#dae2fd;
            border:1px solid rgba(144, 144, 151, 0.2); border-radius:6px;
            cursor:pointer; line-height:0;
        " aria-label="Close">
            <span class="material-symbols-outlined" style="font-size:18px;">close</span>
        </button>
        <div data-card-role style="
            font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
            font-size:10px; letter-spacing:0.22em; text-transform:uppercase;
            color:#4de082; margin-bottom:6px;
        "></div>
        <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
            <h4 data-card-name style="
                font-family:'Space Grotesk', sans-serif;
                font-size:22px; font-weight:700; letter-spacing:-0.02em;
                color:#dae2fd; margin:0;
            "></h4>
            <span data-card-years style="
                font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
                font-size:10px; letter-spacing:0.2em;
                color:#7bd0ff; padding:2px 8px;
                border:1px solid rgba(123, 208, 255, 0.35); border-radius:4px;
            "></span>
        </div>
        <p data-card-intro style="
            font-size:13px; line-height:1.55; font-weight:300;
            color:#c6c6cd; margin:0;
        "></p>
    `;
    wrap.appendChild(card);
    card.addEventListener('pointerdown', (e) => e.stopPropagation());

    const cardRoleEl = card.querySelector('[data-card-role]');
    const cardNameEl = card.querySelector('[data-card-name]');
    const cardYearsEl = card.querySelector('[data-card-years]');
    const cardIntroEl = card.querySelector('[data-card-intro]');
    const cardCloseBtn = card.querySelector('[data-card-close]');

    let activeEntry = null;

    function openCard(entry) {
        activeEntry = entry;
        markedList.forEach((m) => { m.active = m === entry; });
        cardRoleEl.textContent = entry.city.role || 'Location';
        cardNameEl.textContent = entry.city.name;
        cardYearsEl.textContent = entry.city.years || '';
        cardYearsEl.style.display = entry.city.years ? '' : 'none';
        cardIntroEl.textContent = entry.city.intro || '';
        card.style.visibility = 'visible';
        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }

    function closeCard() {
        activeEntry = null;
        markedList.forEach((m) => { m.active = false; });
        card.style.opacity = '0';
        card.style.transform = 'translateY(14px)';
        setTimeout(() => {
            if (!activeEntry) card.style.visibility = 'hidden';
        }, 240);
    }

    cardCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCard();
    });
    canvas.addEventListener('pointerdown', () => {
        if (activeEntry) closeCard();
    }, true);

    // Small secondary hubs (for arc variety)
    const secondaryPositions = extraHubs.map(({ lat, lon }) => latLonToVec3(lat, lon, RADIUS * 1.002));
    const secondaryMat = new THREE.MeshBasicMaterial({ color: PRIMARY });
    secondaryPositions.forEach((p) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 10), secondaryMat);
        m.position.copy(p);
        globe.add(m);
    });

    // Arcs — mostly between marked cities, some out to the wider world
    const arcEndpoints = [
        ...markedList.map((m) => m.pos.clone()),
        ...secondaryPositions,
    ];
    const markedCount = markedList.length;

    const ARC_COUNT = 11;
    const ARC_SEGMENTS = 64;
    const arcs = [];

    function pickEndpoints() {
        // First endpoint: prefer a marked city
        const aIdx = Math.floor(Math.random() * markedCount);
        // Second endpoint: any endpoint except a itself
        let bIdx = Math.floor(Math.random() * arcEndpoints.length);
        if (bIdx === aIdx) bIdx = (bIdx + 1) % arcEndpoints.length;
        return [aIdx, bIdx];
    }

    function makeArc() {
        const [aIdx, bIdx] = pickEndpoints();
        const a = arcEndpoints[aIdx];
        const b = arcEndpoints[bIdx];
        const dist = a.distanceTo(b);
        const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(RADIUS + dist * 0.38);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);

        const positions = new Float32Array((ARC_SEGMENTS + 1) * 3);
        const pts = curve.getPoints(ARC_SEGMENTS);
        pts.forEach((p, i) => {
            positions[i * 3 + 0] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = p.z;
        });
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setDrawRange(0, 0);
        const mat = new THREE.LineBasicMaterial({
            color: PRIMARY,
            transparent: true,
            opacity: 0.55,
        });
        const line = new THREE.Line(geom, mat);
        globe.add(line);

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.022, 12, 12),
            new THREE.MeshBasicMaterial({ color: TERTIARY })
        );
        head.visible = false;
        globe.add(head);

        return {
            curve,
            line,
            geom,
            head,
            speed: 0.25 + Math.random() * 0.35,
            progress: Math.random() * 0.5,
            cooldown: Math.random() * 2,
            segments: ARC_SEGMENTS,
        };
    }

    for (let i = 0; i < ARC_COUNT; i++) arcs.push(makeArc());

    let isDragging = false;
    let lastX = 0, lastY = 0;
    let velX = 0, velY = 0;
    let rotY = 0;
    let rotX = 0.25;

    canvas.addEventListener('pointerdown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        velY = dx * 0.006;
        velX = dy * 0.006;
        rotY += velY;
        rotX += velX;
        rotX = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, rotX));
        lastX = e.clientX;
        lastY = e.clientY;
    });
    const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('pointerleave', endDrag);

    let canvasSize = 1;
    function resize() {
        const rect = wrap.getBoundingClientRect();
        const size = Math.max(1, Math.min(rect.width, rect.height));
        canvasSize = size;
        renderer.setSize(size, size, false);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const clock = new THREE.Clock();
    const tmpVec = new THREE.Vector3();
    const cameraDir = new THREE.Vector3();

    function animate() {
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.getElapsedTime();

        if (!isDragging) {
            velY *= 0.94;
            velX *= 0.94;
            rotY += velY + dt * 0.14;
            rotX += velX;
            rotX += (0.2 - rotX) * 0.01;
        }

        globe.rotation.y = rotY;
        globe.rotation.x = rotX;
        globe.updateMatrixWorld(true);

        // Pulse the marked-city rings + halos; active city glows brighter
        markedList.forEach((m, i) => {
            const activeBoost = m.active ? 1.4 : 1;
            const pulse = (1 + Math.sin(t * 2 + i) * 0.25) * activeBoost;
            m.ring.scale.setScalar(pulse);
            m.ring.material.opacity = Math.min(1, (0.6 + Math.sin(t * 2 + i) * 0.25) * (m.active ? 1.4 : 1));

            const haloPulse = 1 + ((t * 0.6 + i * 0.2) % 1) * 1.2 * activeBoost;
            m.halo.scale.setScalar(haloPulse);
            m.halo.material.opacity = Math.max(0, (m.active ? 0.55 : 0.3) - ((t * 0.6 + i * 0.2) % 1) * 0.3);
        });

        // Animate signal arcs
        arcs.forEach((a) => {
            if (a.cooldown > 0) {
                a.cooldown -= dt;
                a.geom.setDrawRange(0, 0);
                a.head.visible = false;
                return;
            }
            a.progress += dt * a.speed;
            if (a.progress >= 1.2) {
                a.progress = 0;
                a.cooldown = 0.5 + Math.random() * 1.5;
                return;
            }
            const drawEnd = Math.min(1, a.progress);
            a.geom.setDrawRange(0, Math.floor(drawEnd * (a.segments + 1)));
            if (a.progress <= 1) {
                const p = a.curve.getPoint(Math.min(1, a.progress));
                a.head.position.copy(p);
                a.head.visible = true;
                a.head.scale.setScalar(1 + Math.sin(t * 10) * 0.2);
            } else {
                a.head.visible = false;
            }
        });

        // Project marked-city world positions to screen and position labels
        camera.getWorldDirection(cameraDir);
        markedList.forEach((m) => {
            m.worldPos.copy(m.pos).applyMatrix4(globe.matrixWorld);

            // Hide labels/markers on the far side of the globe
            const toCam = tmpVec.copy(m.worldPos).sub(camera.position).normalize();
            const facing = toCam.dot(m.worldPos.clone().normalize());
            const visible = facing < -0.15;

            m.dot.visible = visible;
            m.ring.visible = visible;
            m.halo.visible = visible;

            if (!visible) {
                m.label.style.opacity = '0';
                if (m.connector) m.connector.style.opacity = '0';
                if (m === activeEntry) closeCard();
                return;
            }

            const projected = m.worldPos.clone().project(camera);
            const x = (projected.x * 0.5 + 0.5) * canvasSize;
            const y = (-projected.y * 0.5 + 0.5) * canvasSize;

            const labelX = x + m.offset.x;
            const labelY = y + m.offset.y;
            m.label.style.left = `${labelX}px`;
            m.label.style.top = `${labelY}px`;
            m.label.style.opacity = '1';

            if (m.connector) {
                m.connector.setAttribute('x1', x);
                m.connector.setAttribute('y1', y);
                m.connector.setAttribute('x2', labelX);
                m.connector.setAttribute('y2', labelY);
                m.connector.style.opacity = '1';
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}

function latLonToVec3Shared(lat, lon, r) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta)
    );
}

async function loadCountryBorders(globe, color, radius) {
    try {
        const [{ mesh }, world] = await Promise.all([
            import('https://esm.sh/topojson-client@3.1.0'),
            fetch('https://unpkg.com/world-atlas@2/countries-110m.json').then((r) => {
                if (!r.ok) throw new Error('world-atlas fetch failed: ' + r.status);
                return r.json();
            }),
        ]);

        const borders = mesh(world, world.objects.countries);
        const R = radius * 1.004;
        const SUBDIV = 4;
        const positions = [];

        for (const line of borders.coordinates) {
            for (let i = 0; i < line.length - 1; i++) {
                const a = line[i];
                const b = line[i + 1];

                if (Math.abs(b[0] - a[0]) > 180) continue;

                for (let s = 0; s < SUBDIV; s++) {
                    const t1 = s / SUBDIV;
                    const t2 = (s + 1) / SUBDIV;
                    const lon1 = a[0] + (b[0] - a[0]) * t1;
                    const lat1 = a[1] + (b[1] - a[1]) * t1;
                    const lon2 = a[0] + (b[0] - a[0]) * t2;
                    const lat2 = a[1] + (b[1] - a[1]) * t2;
                    const p1 = latLonToVec3Shared(lat1, lon1, R);
                    const p2 = latLonToVec3Shared(lat2, lon2, R);
                    positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                }
            }
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

        const mat = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
        });

        const lines = new THREE.LineSegments(geom, mat);
        lines.renderOrder = 1;
        globe.add(lines);
    } catch (e) {
        console.warn('[globe] country borders skipped:', e);
    }
}

function makeCircleTexture() {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
}
