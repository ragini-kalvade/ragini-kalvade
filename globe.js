import * as THREE from 'three';

const canvas = document.getElementById('signal-globe');
if (canvas) initGlobe(canvas);

function readGlobePalette() {
    const dark = document.documentElement.classList.contains('dark');
    if (dark) {
        return {
            primary: 0x7bd0ff,
            accent: 0xc084fc,
            tertiary: 0x4de082,
            bg: 0x0b1326,
            labelBg: 'rgba(11, 19, 38, 0.75)',
            labelBgHover: 'rgba(11, 19, 38, 0.92)',
            labelBorder: 'rgba(77, 224, 130, 0.35)',
            labelBorderHover: 'rgba(77, 224, 130, 0.75)',
            nameColor: '#4de082',
            yearsColor: '#7bd0ff',
            connector: 'rgba(77, 224, 130, 0.45)',
            cardBg: 'rgba(23, 31, 51, 0.92)',
            cardBorder: 'rgba(123, 208, 255, 0.32)',
            cardText: '#dae2fd',
            cardMuted: '#c6c6cd',
            cardRole: '#4de082',
            cardYears: '#7bd0ff',
            cardCloseBg: 'rgba(45, 52, 73, 0.8)',
            cardCloseColor: '#dae2fd',
            cardShadow: '0 12px 40px -12px rgba(0, 0, 0, 0.6)',
            dotsCount: 1000,
            dotsSize: 0.028,
            dotsOpacity: 0.72,
        wirePrimaryOpacity: 0.2,
        wireAccentOpacity: 0.12,
        borderOpacity: 0.72,
            atmosphereIntensity: 1.15,
            atmosphereOuterMultiplier: 0.26,
            atmosphereSoftHalo: 0,
            rimPower: 3.5,
            atmosphereInnerScale: 1.05,
            atmosphereOuterScale: 1.08,
            innerOpacity: 0.92,
            glowPrimary: 0x7bd0ff,
            glowAccent: 0xc084fc,
            focusMarker: 0x7bd0ff,
            focusGlow: 0x5eb8f0,
            focusLabelBg: 'rgba(123, 208, 255, 0.1)',
            focusLabelBorder: 'rgba(123, 208, 255, 0.38)',
            focusNameColor: '#9fdcff',
            focusYearsColor: '#7bd0ff',
            focusConnector: 'rgba(123, 208, 255, 0.42)',
        };
    }
    return {
        primary: 0x0891b2,
        accent: 0x9333ea,
        tertiary: 0x059669,
        bg: 0xf4f7fb,
        labelBg: 'rgba(255, 255, 255, 0.92)',
        labelBgHover: 'rgba(255, 255, 255, 0.98)',
        labelBorder: 'rgba(5, 150, 105, 0.35)',
        labelBorderHover: 'rgba(5, 150, 105, 0.65)',
        nameColor: '#059669',
        yearsColor: '#0891b2',
        connector: 'rgba(5, 150, 105, 0.42)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(8, 145, 178, 0.28)',
        cardText: '#1e293b',
        cardMuted: '#64748b',
        cardRole: '#059669',
        cardYears: '#0891b2',
        cardCloseBg: 'rgba(241, 245, 249, 0.95)',
        cardCloseColor: '#475569',
        cardShadow: '0 12px 40px -12px rgba(15, 23, 42, 0.12)',
        dotsCount: 400,
        dotsSize: 0.036,
        dotsOpacity: 0.82,
        wirePrimaryOpacity: 0.34,
        wireAccentOpacity: 0.22,
        borderOpacity: 0.62,
        atmosphereIntensity: 1.15,
        atmosphereOuterMultiplier: 0.12,
        atmosphereSoftHalo: 0.03,
        rimPower: 3.35,
        atmosphereInnerScale: 1.05,
        atmosphereOuterScale: 1.08,
        innerOpacity: 0.94,
        glowPrimary: 0xb8e8ff,
        glowAccent: 0xddd6fe,
        focusMarker: 0x0891b2,
        focusGlow: 0x38bdf8,
        focusLabelBg: 'rgba(8, 145, 178, 0.08)',
        focusLabelBorder: 'rgba(8, 145, 178, 0.32)',
        focusNameColor: '#0891b2',
        focusYearsColor: '#0e7490',
        focusConnector: 'rgba(8, 145, 178, 0.38)',
    };
}

function getGlowColors(palette) {
    return {
        primary: palette.glowPrimary ?? palette.primary,
        accent: palette.glowAccent ?? palette.accent,
    };
}

function initGlobe(canvas) {
    const wrap = canvas.parentElement;
    const labelLayer = document.getElementById('globe-labels');

    let palette = readGlobePalette();
    const glow = getGlowColors(palette);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const RADIUS = 1;

    const globe = new THREE.Group();
    scene.add(globe);

    const inner = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * 0.985, 64, 48),
        new THREE.MeshBasicMaterial({ color: palette.bg, transparent: true, opacity: palette.innerOpacity })
    );
    globe.add(inner);

    const wireMesh = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(RADIUS, 4)),
        new THREE.LineBasicMaterial({ color: palette.primary, transparent: true, opacity: palette.wirePrimaryOpacity })
    );
    globe.add(wireMesh);

    const wireAccent = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(RADIUS * 1.012, 2)),
        new THREE.LineBasicMaterial({ color: palette.accent, transparent: true, opacity: palette.wireAccentOpacity })
    );
    globe.add(wireAccent);

    function addOrbitRing(radius, color, opacity, tiltX = 0, tiltZ = 0) {
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(radius * 0.992, radius * 1.008, 128),
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity,
                side: THREE.DoubleSide,
                depthWrite: false,
            })
        );
        ring.rotation.x = Math.PI / 2 + tiltX;
        ring.rotation.z = tiltZ;
        globe.add(ring);
        return ring;
    }

    const hudRings = [
        addOrbitRing(RADIUS * 1.06, palette.accent, 0.38, 0.12, 0),
        addOrbitRing(RADIUS * 1.1, palette.primary, 0.28, -0.18, 0.42),
        addOrbitRing(RADIUS * 1.14, palette.tertiary, 0.22, 0.08, -0.35),
    ];

    const dotTexture = makeCircleTexture();
    const dotsCount = palette.dotsCount;
    const dotsPositions = new Float32Array(dotsCount * 3);
    for (let i = 0; i < dotsCount; i += 1) {
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
        color: palette.primary,
        size: palette.dotsSize,
        map: dotTexture,
        transparent: true,
        opacity: palette.dotsOpacity,
        depthWrite: false,
        sizeAttenuation: true,
        alphaTest: 0.05,
    });
    globe.add(new THREE.Points(dotsGeom, dotsMat));

    let borderMat = null;
    loadCountryBorders(globe, palette.primary, RADIUS, palette.borderOpacity).then((mat) => {
        borderMat = mat;
        if (mat) {
            wireMesh.visible = false;
            wireAccent.visible = false;
        }
    });

    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * palette.atmosphereInnerScale, 48, 32),
        new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.BackSide,
            depthWrite: false,
            uniforms: {
                uPrimary: { value: new THREE.Color(glow.primary) },
                uAccent: { value: new THREE.Color(glow.accent) },
                uIntensity: { value: palette.atmosphereIntensity },
                uRimPower: { value: palette.rimPower },
                uSoftHalo: { value: palette.atmosphereSoftHalo },
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                uniform vec3 uPrimary;
                uniform vec3 uAccent;
                uniform float uIntensity;
                uniform float uRimPower;
                uniform float uSoftHalo;
                void main() {
                    float facing = max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
                    float rim = pow(clamp(1.0 - facing, 0.0, 1.0), uRimPower);
                    float halo = pow(rim, 0.9) * uSoftHalo;
                    vec3 glowColor = mix(uPrimary, uAccent, 0.42 + rim * 0.18);
                    gl_FragColor = vec4(glowColor, (rim * 0.92 + halo * 0.45) * uIntensity);
                }
            `,
        })
    );
    globe.add(atmosphere);

    const atmosphereOuter = new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * palette.atmosphereOuterScale, 32, 24),
        new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.BackSide,
            depthWrite: false,
            uniforms: {
                uPrimary: { value: new THREE.Color(glow.primary) },
                uAccent: { value: new THREE.Color(glow.accent) },
                uIntensity: { value: palette.atmosphereIntensity * palette.atmosphereOuterMultiplier },
                uRimPower: { value: palette.rimPower + 0.35 },
                uSoftHalo: { value: palette.atmosphereSoftHalo * 0.85 },
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                uniform vec3 uPrimary;
                uniform vec3 uAccent;
                uniform float uIntensity;
                uniform float uRimPower;
                uniform float uSoftHalo;
                void main() {
                    float facing = max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
                    float rim = pow(clamp(1.0 - facing, 0.0, 1.0), uRimPower);
                    float halo = pow(rim, 0.85) * uSoftHalo;
                    vec3 glowColor = mix(uPrimary, uAccent, 0.55);
                    gl_FragColor = vec4(glowColor, (rim * 0.88 + halo * 0.4) * uIntensity);
                }
            `,
        })
    );
    atmosphereOuter.visible = !document.documentElement.classList.contains('dark');
    globe.add(atmosphereOuter);

    // Auto-focus cycle order (array order matches this sequence).
    const FOCUS_SEQUENCE = ['Mumbai', 'Singapore', 'Bhopal', 'Pune', 'Chicago', 'Edinburgh'];

    // Featured cities — the places that matter.
    // Edit `years` / `note` to taste; set years to '' to hide the caption.
    // `labelOffset` is a screen-space nudge in pixels, used to space out labels
    // that would otherwise overlap (e.g. Mumbai/Pune/Bhopal clustered in India).
    // `intro` is shown when the marker is clicked — edit freely.
    const markedCities = [
        {
            name: 'Mumbai',
            lat: 19.0760, lon: 72.8777,
            years: '2000-2006',
            labelOffset: { x: -78, y: 18 },
            role: 'Early Years',
            intro: "My earliest memories of India's most electric city — where the idea that anything was buildable first took root.",
        },
        {
            name: 'Singapore',
            lat: 1.3521, lon: 103.8198,
            years: '2007-2013',
            labelOffset: { x: 0, y: 0 },
            role: 'Middle School',
            intro: 'Formative school years abroad — first encounters with scientific computing, animation clubs, and a city that runs like a well-tuned operating system.',
        },
        {
            name: 'Bhopal',
            lat: 23.2599, lon: 77.4126,
            years: '2018-2022',
            labelOffset: { x: 58, y: -36 },
            role: 'NIT Bhopal',
            intro: 'B.Tech in Computer Science — four years of algorithms, systems, and late-night hackathons that turned curiosity into craft.',
        },
        {
            name: 'Pune',
            lat: 18.5204, lon: 73.8567,
            years: '2022-2024',
            labelOffset: { x: 72, y: 40 },
            role: 'Deutsche Bank',
            intro: 'Senior Analyst on Corporate Bank Tech — shipped microservices for Letters of Credit and Bank Guarantees.',
        },
        {
            name: 'Chicago',
            lat: 41.8781, lon: -87.6298,
            years: '2024-',
            labelOffset: { x: 0, y: 0 },
            role: 'UIC',
            intro: "MS in Computer Science at the University of Illinois Chicago and Research Developer at the Fall Prevention Lab — building cognitive-rehab training platforms for older adults.",
        },
        {
            name: 'Edinburgh',
            lat: 55.9533, lon: -3.1883,
            years: '2026',
            labelOffset: { x: 0, y: 0 },
            role: 'HRI Student Design',
            intro: 'Presented DoReMi — a human-centered piano tutor robot — at the HRI Student Design Challenge; short paper published in the companion proceedings.',
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

    function getFocusRotation(pos) {
        const probe = new THREE.Group();
        const worldPos = new THREE.Vector3();
        let best = { score: -Infinity, rotX: 0, rotY: 0 };

        for (let yi = 0; yi <= 72; yi++) {
            const rotY = -Math.PI + (2 * Math.PI * yi) / 72;
            for (let xi = 0; xi <= 52; xi++) {
                const rotX = -Math.PI / 2.3 + (2 * Math.PI / 2.3 * xi) / 52;
                probe.rotation.set(rotX, rotY, 0);
                probe.updateMatrix();
                worldPos.copy(pos).applyMatrix4(probe.matrix);
                const score = worldPos.z - worldPos.x * worldPos.x - worldPos.y * worldPos.y;
                if (score > best.score) {
                    best = { score, rotX, rotY };
                }
            }
        }

        return { rotY: best.rotY, rotX: best.rotX };
    }

    function lerpAngle(from, to, t) {
        let diff = to - from;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        return from + diff * t;
    }

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    // Featured city markers: larger dot + pulsing ring + outer halo
    const markedGroup = new THREE.Group();
    globe.add(markedGroup);

    // SVG layer for thin connector lines from marker dot -> offset label
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const connectorSvg = document.createElementNS(SVG_NS, 'svg');
    connectorSvg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;';
    labelLayer.appendChild(connectorSvg);

    const markedList = markedCities.map((c, index) => {
        const pos = latLonToVec3(c.lat, c.lon, RADIUS * 1.002);

        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.028, 14, 14),
            new THREE.MeshBasicMaterial({ color: palette.tertiary })
        );
        dot.position.copy(pos);
        markedGroup.add(dot);

        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.038, 0.052, 32),
            new THREE.MeshBasicMaterial({ color: palette.tertiary, transparent: true, opacity: 0.95, side: THREE.DoubleSide })
        );
        ring.position.copy(pos);
        ring.lookAt(pos.clone().multiplyScalar(2));
        markedGroup.add(ring);

        const halo = new THREE.Mesh(
            new THREE.RingGeometry(0.055, 0.14, 48),
            new THREE.MeshBasicMaterial({ color: palette.accent, transparent: true, opacity: 0.32, side: THREE.DoubleSide })
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
            `background:${palette.labelBg}`,
            `border:1px solid ${palette.labelBorder}`,
            'padding:4px 9px',
            'border-radius:4px',
            'white-space:nowrap',
            'backdrop-filter:blur(6px)',
            'transition:opacity 120ms ease, background-color 0.35s ease, border-color 0.35s ease',
            'will-change:transform,opacity',
            'text-align:center',
            'line-height:1.1',
        ].join(';');

        const nameEl = document.createElement('div');
        nameEl.textContent = c.name;
        nameEl.style.cssText = `font-size:10px;color:${palette.nameColor};font-weight:600;`;
        label.appendChild(nameEl);

        let yearsEl = null;
        if (c.years) {
            yearsEl = document.createElement('div');
            yearsEl.textContent = c.years;
            yearsEl.style.cssText = `font-size:8.5px;color:${palette.yearsColor};opacity:0.85;margin-top:2px;letter-spacing:0.2em;`;
            label.appendChild(yearsEl);
        }

        label.style.pointerEvents = 'auto';
        label.style.cursor = 'pointer';
        label.addEventListener('mouseenter', () => {
            const p = readGlobePalette();
            label.style.background = p.labelBgHover;
            label.style.borderColor = p.labelBorderHover;
            label.style.transform = 'translate(-50%, -130%) scale(1.06)';
        });
        label.addEventListener('mouseleave', () => {
            const p = readGlobePalette();
            label.style.background = p.labelBg;
            label.style.borderColor = p.labelBorder;
            label.style.transform = 'translate(-50%, -130%) scale(1)';
        });
        label.addEventListener('pointerdown', (e) => e.stopPropagation());

        labelLayer.appendChild(label);

        const offset = c.labelOffset || { x: 0, y: 0 };
        const hasOffset = offset.x !== 0 || offset.y !== 0;

        let connector = null;
        if (hasOffset) {
            connector = document.createElementNS(SVG_NS, 'line');
            connector.setAttribute('stroke', palette.connector);
            connector.setAttribute('stroke-width', '1');
            connector.setAttribute('stroke-dasharray', '2 3');
            connectorSvg.appendChild(connector);
        }

        const entry = {
            city: c,
            pos,
            focusRot: getFocusRotation(pos),
            worldPos: new THREE.Vector3(),
            dot, ring, halo, label, nameEl, yearsEl,
            offset,
            connector,
            active: false,
        };

        label.addEventListener('click', (e) => {
            e.stopPropagation();
            focusOnMarker(index);
            openCard(entry);
            pauseAutoFocus();
        });

        return entry;
    }).sort((a, b) => FOCUS_SEQUENCE.indexOf(a.city.name) - FOCUS_SEQUENCE.indexOf(b.city.name));

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

    function applyCardTheme() {
        card.style.background = palette.cardBg;
        card.style.border = `1px solid ${palette.cardBorder}`;
        card.style.color = palette.cardText;
        card.style.boxShadow = palette.cardShadow;
        cardRoleEl.style.color = palette.cardRole;
        cardNameEl.style.color = palette.cardText;
        cardYearsEl.style.color = palette.cardYears;
        cardYearsEl.style.border = `1px solid ${palette.cardBorder}`;
        cardIntroEl.style.color = palette.cardMuted;
        cardCloseBtn.style.background = palette.cardCloseBg;
        cardCloseBtn.style.color = palette.cardCloseColor;
    }

    applyCardTheme();

    let activeEntry = null;

    function openCard(entry) {
        activeEntry = entry;
        setActiveMarker(markedList.indexOf(entry));
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
        if (performance.now() > userControlUntil && !isDragging) {
            setActiveMarker(focusIndex);
        } else {
            setActiveMarker(-1);
        }
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
    const secondaryMat = new THREE.MeshBasicMaterial({ color: palette.primary });
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
            color: palette.primary,
            transparent: true,
            opacity: 0.55,
        });
        const line = new THREE.Line(geom, mat);
        globe.add(line);

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.022, 12, 12),
            new THREE.MeshBasicMaterial({ color: palette.tertiary })
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

    const FOCUS_DWELL = 1;
    const FOCUS_DURATION = 1;
    const USER_PAUSE_MS = 2500;

    let focusIndex = Math.max(0, markedList.findIndex((m) => m.city.name === FOCUS_SEQUENCE[0]));
    let focusPhase = 'dwell';
    let focusElapsed = 0;
    let focusFrom = { rotY: 0, rotX: 0.25 };
    let focusTo = markedList[focusIndex].focusRot;
    let userControlUntil = 0;

    function applyLabelTheme(entry, isActive = entry.active) {
        entry.label.style.background = isActive ? palette.focusLabelBg : palette.labelBg;
        entry.label.style.borderColor = isActive ? palette.focusLabelBorder : palette.labelBorder;
        entry.nameEl.style.color = isActive ? palette.focusNameColor : palette.nameColor;
        if (entry.yearsEl) {
            entry.yearsEl.style.color = isActive ? palette.focusYearsColor : palette.yearsColor;
        }
        if (entry.connector) {
            entry.connector.setAttribute('stroke', isActive ? palette.focusConnector : palette.connector);
        }
    }

    function applyMarkerVisual(entry, isActive) {
        entry.dot.material.color.setHex(isActive ? palette.focusMarker : palette.tertiary);
        entry.ring.material.color.setHex(isActive ? palette.focusMarker : palette.tertiary);
        entry.halo.material.color.setHex(isActive ? palette.focusGlow : palette.accent);
        applyLabelTheme(entry, isActive);
    }

    function setActiveMarker(index) {
        markedList.forEach((m, i) => {
            const isActive = index >= 0 && i === index;
            m.active = isActive;
            applyMarkerVisual(m, isActive);
        });
    }

    function getNextFocusIndex(currentIndex) {
        const currentName = markedList[currentIndex]?.city.name;
        const seqIndex = FOCUS_SEQUENCE.indexOf(currentName);
        const nextName = FOCUS_SEQUENCE[(seqIndex + 1) % FOCUS_SEQUENCE.length];
        return markedList.findIndex((m) => m.city.name === nextName);
    }

    function focusOnMarker(index) {
        focusIndex = ((index % markedList.length) + markedList.length) % markedList.length;
        focusFrom = { rotY, rotX };
        focusTo = markedList[focusIndex].focusRot;
        focusPhase = 'transition';
        focusElapsed = 0;
        velX = 0;
        velY = 0;
        setActiveMarker(focusIndex);
    }

    function pauseAutoFocus(durationMs = USER_PAUSE_MS) {
        userControlUntil = performance.now() + durationMs;
        focusPhase = 'dwell';
        focusElapsed = 0;
    }

    {
        const initial = markedList[focusIndex].focusRot;
        rotY = initial.rotY;
        rotX = initial.rotX;
        focusTo = initial;
        setActiveMarker(focusIndex);
        openCard(markedList[focusIndex]);
    }

    canvas.addEventListener('pointerdown', (e) => {
        isDragging = true;
        pauseAutoFocus();
        setActiveMarker(-1);
        if (activeEntry) closeCard();
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
    let isVisible = true;

    const visibilityObserver = new IntersectionObserver((entries) => {
        isVisible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.08, rootMargin: '80px 0px' });
    visibilityObserver.observe(wrap);

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.getElapsedTime();

        if (!isDragging) {
            const autoCycle = performance.now() > userControlUntil;
            const transitioning = focusPhase === 'transition';

            if (autoCycle || transitioning) {
                if (autoCycle) {
                    velY = 0;
                    velX = 0;
                }
                focusElapsed += dt;

                if (focusPhase === 'transition') {
                    const progress = Math.min(1, focusElapsed / FOCUS_DURATION);
                    const eased = easeInOutQuad(progress);
                    rotY = lerpAngle(focusFrom.rotY, focusTo.rotY, eased);
                    rotX = focusFrom.rotX + (focusTo.rotX - focusFrom.rotX) * eased;
                    if (progress >= 1) {
                        focusPhase = 'dwell';
                        focusElapsed = 0;
                        openCard(markedList[focusIndex]);
                    }
                } else if (autoCycle) {
                    rotX += (focusTo.rotX - rotX) * 0.08;
                    if (focusElapsed >= FOCUS_DWELL) {
                        focusOnMarker(getNextFocusIndex(focusIndex));
                    }
                }
            } else {
                velY *= 0.94;
                velX *= 0.94;
                rotY += velY;
                rotX += velX;
                rotX = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, rotX));
            }
        }

        globe.rotation.y = rotY;
        globe.rotation.x = rotX;
        hudRings.forEach((ring, i) => {
            ring.rotation.y += dt * (0.08 + i * 0.04) * (i % 2 === 0 ? 1 : -1);
        });
        globe.updateMatrixWorld(true);

        // Pulse the marked-city rings + halos; active city gets a subtle blue glow
        markedList.forEach((m, i) => {
            const pulseAmp = m.active ? 0.1 : 0.22;
            const pulse = 1 + Math.sin(t * 2 + i) * pulseAmp;
            m.ring.scale.setScalar(pulse);
            m.ring.material.opacity = m.active
                ? 0.38 + Math.sin(t * 2 + i) * 0.08
                : Math.min(1, 0.55 + Math.sin(t * 2 + i) * 0.2);

            const haloPulse = 1 + ((t * 0.6 + i * 0.2) % 1) * (m.active ? 0.45 : 1.1);
            m.halo.scale.setScalar(haloPulse);
            m.halo.material.opacity = Math.max(
                0,
                (m.active ? 0.16 : 0.28) - ((t * 0.6 + i * 0.2) % 1) * (m.active ? 0.1 : 0.26)
            );
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
        markedList.forEach((m, markerIndex) => {
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
                const rotatingToThis = focusPhase === 'transition' && markerIndex === focusIndex;
                if (m === activeEntry && !rotatingToThis) closeCard();
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
    }

    function applyGlobeTheme() {
        palette = readGlobePalette();
        const glowColors = getGlowColors(palette);
        inner.material.color.setHex(palette.bg);
        inner.material.opacity = palette.innerOpacity;
        wireMesh.material.color.setHex(palette.primary);
        wireMesh.material.opacity = palette.wirePrimaryOpacity;
        wireAccent.material.color.setHex(palette.accent);
        wireAccent.material.opacity = palette.wireAccentOpacity;
        dotsMat.color.setHex(palette.primary);
        dotsMat.size = palette.dotsSize;
        dotsMat.opacity = palette.dotsOpacity;
        secondaryMat.color.setHex(palette.primary);
        if (borderMat) {
            borderMat.color.setHex(palette.primary);
            borderMat.opacity = palette.borderOpacity;
        }
        atmosphere.material.uniforms.uPrimary.value.setHex(glowColors.primary);
        atmosphere.material.uniforms.uAccent.value.setHex(glowColors.accent);
        atmosphere.material.uniforms.uIntensity.value = palette.atmosphereIntensity;
        atmosphere.material.uniforms.uRimPower.value = palette.rimPower;
        atmosphere.material.uniforms.uSoftHalo.value = palette.atmosphereSoftHalo;
        atmosphereOuter.material.uniforms.uPrimary.value.setHex(glowColors.primary);
        atmosphereOuter.material.uniforms.uAccent.value.setHex(glowColors.accent);
        atmosphereOuter.material.uniforms.uIntensity.value = palette.atmosphereIntensity * palette.atmosphereOuterMultiplier;
        atmosphereOuter.material.uniforms.uRimPower.value = palette.rimPower + 0.35;
        atmosphereOuter.material.uniforms.uSoftHalo.value = palette.atmosphereSoftHalo * 0.85;
        atmosphereOuter.visible = !document.documentElement.classList.contains('dark');
        hudRings[0].material.color.setHex(palette.accent);
        hudRings[1].material.color.setHex(palette.primary);
        hudRings[2].material.color.setHex(palette.tertiary);
        markedList.forEach((entry) => {
            applyMarkerVisual(entry, entry.active);
        });
        arcs.forEach((arc) => {
            arc.line.material.color.setHex(palette.primary);
            arc.head.material.color.setHex(palette.tertiary);
        });
        applyCardTheme();
    }

    document.addEventListener('themechange', applyGlobeTheme);

    animate();
}

const _borderVecA = new THREE.Vector3();
const _borderVecB = new THREE.Vector3();
const _borderPoint = new THREE.Vector3();

function latLonToUnitVec(lat, lon, target = _borderVecA) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return target.set(
        -Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
    );
}

function unwrapLongitude(lonA, lonB) {
    let lon = lonB;
    const delta = lon - lonA;
    if (delta > 180) lon -= 360;
    else if (delta < -180) lon += 360;
    return lon;
}

function slerpUnitVec(out, vA, vB, t, angle) {
    const sinAngle = Math.sin(angle);
    if (sinAngle < 1e-6) return out.copy(vA);
    const wA = Math.sin((1 - t) * angle) / sinAngle;
    const wB = Math.sin(t * angle) / sinAngle;
    return out.set(
        vA.x * wA + vB.x * wB,
        vA.y * wA + vB.y * wB,
        vA.z * wA + vB.z * wB
    );
}

function appendSphericalSegment(positions, lonA, latA, lonB, latB, radius) {
    const lonEnd = unwrapLongitude(lonA, lonB);
    latLonToUnitVec(latA, lonA, _borderVecA);
    latLonToUnitVec(latB, lonEnd, _borderVecB);

    let dot = _borderVecA.dot(_borderVecB);
    dot = Math.min(1, Math.max(-1, dot));
    const angle = Math.acos(dot);

    // Ignore arcs that would wrap the long way around the globe.
    if (angle > Math.PI * 0.67) return;

    const steps = Math.max(1, Math.ceil(angle / (Math.PI / 90)));

    for (let s = 0; s < steps; s += 1) {
        const t1 = s / steps;
        const t2 = (s + 1) / steps;
        slerpUnitVec(_borderPoint, _borderVecA, _borderVecB, t1, angle).multiplyScalar(radius);
        positions.push(_borderPoint.x, _borderPoint.y, _borderPoint.z);
        slerpUnitVec(_borderPoint, _borderVecA, _borderVecB, t2, angle).multiplyScalar(radius);
        positions.push(_borderPoint.x, _borderPoint.y, _borderPoint.z);
    }
}

async function fetchCountryAtlas() {
    const sources = [
        new URL('data/countries-50m.json', import.meta.url).href,
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json',
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
    ];

    let lastError = null;
    for (const url of sources) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.json();
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError ?? new Error('country atlas unavailable');
}

async function loadCountryBorders(globe, color, radius, opacity = 0.62) {
    try {
        const [{ mesh }, world] = await Promise.all([
            import('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm'),
            fetchCountryAtlas(),
        ]);

        const borders = mesh(world, world.objects.countries);
        const R = radius * 1.004;
        const positions = [];

        for (const line of borders.coordinates) {
            for (let i = 0; i < line.length - 1; i += 1) {
                const a = line[i];
                const b = line[i + 1];
                appendSphericalSegment(positions, a[0], a[1], b[0], b[1], R);
            }
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

        const mat = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity,
            depthWrite: false,
        });

        const lines = new THREE.LineSegments(geom, mat);
        lines.renderOrder = 1;
        globe.add(lines);
        return mat;
    } catch (e) {
        console.warn('[globe] country borders skipped:', e);
        return null;
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
