import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { attractors, attractorNames, Attractor, AttractorParams } from './attractors';
import { ParticleSystem } from './particleSystem';

// Settings
const settings = {
    attractor: 'lorenz',
    particleCount: 5000,
    trailLength: 50,
    speed: 1,
    colorStart: '#6366f1',
    colorEnd: '#ec4899',
    bloomStrength: 1.5,
    autoRotate: true,
    rotateSpeed: 0.2
};

// Scene setup
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
const initialPos = attractors[settings.attractor].cameraPosition;
camera.position.set(initialPos[0], initialPos[1], initialPos[2]);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = settings.autoRotate;
controls.autoRotateSpeed = settings.rotateSpeed;

// Add ambient fog for depth
scene.fog = new THREE.FogExp2(0x0a0a0f, 0.002);

// Create particle system
let particleSystem = new ParticleSystem(attractors[settings.attractor], {
    particleCount: settings.particleCount,
    trailLength: settings.trailLength,
    colorStart: new THREE.Color(settings.colorStart),
    colorEnd: new THREE.Color(settings.colorEnd)
});
scene.add(particleSystem.getObject());

// Axes helper (subtle)
const axesGroup = new THREE.Group();
const axisLength = 200;
const axisMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.1,
    transparent: true
});

const xGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-axisLength, 0, 0),
    new THREE.Vector3(axisLength, 0, 0)
]);
const yGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -axisLength, 0),
    new THREE.Vector3(0, axisLength, 0)
]);
const zGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, -axisLength),
    new THREE.Vector3(0, 0, axisLength)
]);

axesGroup.add(new THREE.Line(xGeom, axisMaterial));
axesGroup.add(new THREE.Line(yGeom, axisMaterial));
axesGroup.add(new THREE.Line(zGeom, axisMaterial));
scene.add(axesGroup);

// Update description
function updateDescription(): void {
    const descEl = document.getElementById('attractor-description');
    if (descEl) {
        const attractor = attractors[settings.attractor];
        descEl.innerHTML = `${attractor.description} <a href="${attractor.wikipediaUrl}" target="_blank" class="wiki-link">Learn more →</a>`;
    }
}
updateDescription();

// LaTeX equations for each attractor
const latexEquations: { [key: string]: string[] } = {
    lorenz: [
        '\\frac{dx}{dt} = \\sigma(y - x)',
        '\\frac{dy}{dt} = x(\\rho - z) - y',
        '\\frac{dz}{dt} = xy - \\beta z'
    ],
    thomas: [
        '\\frac{dx}{dt} = \\sin(y) - bx',
        '\\frac{dy}{dt} = \\sin(z) - by',
        '\\frac{dz}{dt} = \\sin(x) - bz'
    ],
    dadras: [
        '\\frac{dx}{dt} = y - ax + byz',
        '\\frac{dy}{dt} = cy - xz + z',
        '\\frac{dz}{dt} = dxy - ez'
    ],
    rossler: [
        '\\frac{dx}{dt} = -y - z',
        '\\frac{dy}{dt} = x + ay',
        '\\frac{dz}{dt} = b + z(x - c)'
    ],
    aizawa: [
        '\\frac{dx}{dt} = (z - b)x - dy',
        '\\frac{dy}{dt} = dx + (z - b)y',
        '\\frac{dz}{dt} = c + az - \\frac{z^3}{3} - (x^2 + y^2)(1 + ez) + fzx^3'
    ],
    chen: [
        '\\frac{dx}{dt} = a(y - x)',
        '\\frac{dy}{dt} = (c - a)x - xz + cy',
        '\\frac{dz}{dt} = xy - bz'
    ],
    halvorsen: [
        '\\frac{dx}{dt} = -ax - 4y - 4z - y^2',
        '\\frac{dy}{dt} = -ay - 4z - 4x - z^2',
        '\\frac{dz}{dt} = -az - 4x - 4y - x^2'
    ],
    sprott: [
        '\\frac{dx}{dt} = y + axy + xz',
        '\\frac{dy}{dt} = 1 - bx^2 + yz',
        '\\frac{dz}{dt} = x - x^2 - y^2'
    ]
};

// Declare KaTeX global type
declare const katex: {
    render: (tex: string, element: HTMLElement, options?: object) => void;
    renderToString: (tex: string, options?: object) => string;
};

// Update equation display with KaTeX
function updateEquation(): void {
    const eqEl = document.getElementById('equation-content');
    if (eqEl && typeof katex !== 'undefined') {
        const equations = latexEquations[settings.attractor] || [];
        eqEl.innerHTML = equations.map(eq => {
            try {
                return `<span class="equation-line">${katex.renderToString(eq, { displayMode: true, throwOnError: false })}</span>`;
            } catch {
                return `<span class="equation-line">${eq}</span>`;
            }
        }).join('');
    }
}

// Wait for KaTeX to load, then render
setTimeout(updateEquation, 100);

// Update particles count display
function updateParticlesDisplay(): void {
    const countEl = document.getElementById('particles-count');
    if (countEl) {
        countEl.textContent = `${particleSystem.getParticleCount().toLocaleString()} particles`;
    }
}
updateParticlesDisplay();

// Recreate particle system
function recreateParticleSystem(): void {
    scene.remove(particleSystem.getObject());
    particleSystem.dispose();

    particleSystem = new ParticleSystem(attractors[settings.attractor], {
        particleCount: settings.particleCount,
        trailLength: settings.trailLength,
        colorStart: new THREE.Color(settings.colorStart),
        colorEnd: new THREE.Color(settings.colorEnd)
    });
    scene.add(particleSystem.getObject());
    updateParticlesDisplay();
}

// GUI setup
const gui = new GUI({ title: '⚙️ Controls' });

// Attractor selection
const attractorFolder = gui.addFolder('Attractor');
attractorFolder.add(settings, 'attractor', attractorNames)
    .name('Type')
    .onChange((value: string) => {
        // Remove old param controllers
        if (paramFolder) {
            paramFolder.destroy();
        }

        // Update camera position
        const pos = attractors[value].cameraPosition;
        camera.position.set(pos[0], pos[1], pos[2]);
        controls.update();

        // Recreate system
        recreateParticleSystem();
        updateDescription();
        updateEquation();

        // Rebuild param folder
        createParamFolder(attractors[value]);
    });

// Parameters folder (dynamic)
let paramFolder: GUI | null = null;

function createParamFolder(attractor: Attractor): void {
    paramFolder = gui.addFolder('Parameters');
    const params: AttractorParams = { ...attractor.params };

    for (const key of Object.keys(attractor.params)) {
        const range = attractor.paramRanges[key];
        paramFolder.add(params, key, range[0], range[1], range[2])
            .name(key)
            .onChange(() => {
                particleSystem.setParams(params);
            });
    }
    paramFolder.open();
}

createParamFolder(attractors[settings.attractor]);

// Visual settings
const visualFolder = gui.addFolder('Visual');
visualFolder.add(settings, 'speed', 0.1, 3, 0.1).name('Speed');
visualFolder.addColor(settings, 'colorStart').name('Color Start').onChange(() => {
    particleSystem.setColors(
        new THREE.Color(settings.colorStart),
        new THREE.Color(settings.colorEnd)
    );
});
visualFolder.addColor(settings, 'colorEnd').name('Color End').onChange(() => {
    particleSystem.setColors(
        new THREE.Color(settings.colorStart),
        new THREE.Color(settings.colorEnd)
    );
});

// Particle settings
const particleFolder = gui.addFolder('Particles');
particleFolder.add(settings, 'particleCount', 1000, 20000, 1000)
    .name('Count')
    .onFinishChange(recreateParticleSystem);
particleFolder.add(settings, 'trailLength', 10, 100, 5)
    .name('Trail Length')
    .onFinishChange(recreateParticleSystem);

// Camera controls
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(settings, 'autoRotate').name('Auto Rotate').onChange((v: boolean) => {
    controls.autoRotate = v;
});
cameraFolder.add(settings, 'rotateSpeed', 0.1, 2, 0.1).name('Rotate Speed').onChange((v: number) => {
    controls.autoRotateSpeed = v;
});
cameraFolder.add({
    reset: () => {
        const pos = attractors[settings.attractor].cameraPosition;
        camera.position.set(pos[0], pos[1], pos[2]);
        controls.target.set(0, 0, 0);
        controls.update();
    }
}, 'reset').name('Reset View');

// FPS counter
let frameCount = 0;
let lastTime = performance.now();
const fpsEl = document.getElementById('fps');

function updateFPS(): void {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
        if (fpsEl) {
            fpsEl.textContent = `${frameCount} FPS`;
        }
        frameCount = 0;
        lastTime = now;
    }
}

// Animation loop
function animate(): void {
    requestAnimationFrame(animate);

    // Update particles
    particleSystem.update(settings.speed);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Update FPS
    updateFPS();
}

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start
animate();

console.log('Strange Attractors loaded'); // it works

