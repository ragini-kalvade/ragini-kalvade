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

    // Featured cities — the places that matter
    const markedCities = [
        { name: 'Chicago',   lat: 41.8781,  lon: -87.6298 },
        { name: 'Indore',    lat: 22.7196,  lon:  75.8577 },
        { name: 'Mumbai',    lat: 19.0760,  lon:  72.8777 },
        { name: 'Pune',      lat: 18.5204,  lon:  73.8567 },
        { name: 'Singapore', lat:  1.3521,  lon: 103.8198 },
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
        label.textContent = c.name;
        label.style.cssText = [
            'position:absolute',
            'transform:translate(-50%, -130%)',
            'pointer-events:none',
            'font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace',
            'font-size:10px',
            'letter-spacing:0.16em',
            'text-transform:uppercase',
            'color:#4de082',
            'background:rgba(11,19,38,0.72)',
            'border:1px solid rgba(77,224,130,0.35)',
            'padding:3px 8px',
            'border-radius:4px',
            'white-space:nowrap',
            'backdrop-filter:blur(6px)',
            'transition:opacity 120ms ease',
            'will-change:transform,opacity',
        ].join(';');
        labelLayer.appendChild(label);

        return { city: c, pos, worldPos: new THREE.Vector3(), dot, ring, halo, label };
    });

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

        // Pulse the marked-city rings + halos
        markedList.forEach((m, i) => {
            const pulse = 1 + Math.sin(t * 2 + i) * 0.25;
            m.ring.scale.setScalar(pulse);
            m.ring.material.opacity = 0.6 + Math.sin(t * 2 + i) * 0.25;

            const haloPulse = 1 + ((t * 0.6 + i * 0.2) % 1) * 1.2;
            m.halo.scale.setScalar(haloPulse);
            m.halo.material.opacity = Math.max(0, 0.3 - ((t * 0.6 + i * 0.2) % 1) * 0.3);
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
                return;
            }

            const projected = m.worldPos.clone().project(camera);
            const x = (projected.x * 0.5 + 0.5) * canvasSize;
            const y = (-projected.y * 0.5 + 0.5) * canvasSize;
            m.label.style.left = `${x}px`;
            m.label.style.top = `${y}px`;
            m.label.style.opacity = '1';
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
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
