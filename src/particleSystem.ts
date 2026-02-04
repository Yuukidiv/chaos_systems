import * as THREE from 'three';
import { Attractor, AttractorParams } from './attractors';

export interface ParticleSystemOptions {
    particleCount: number;
    trailLength: number;
    colorStart: THREE.Color;
    colorEnd: THREE.Color;
}

export class ParticleSystem {
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;
    private points: THREE.Points;
    private positions: Float32Array;
    private colors: Float32Array;
    private sizes: Float32Array;

    private trailPositions: Float32Array[];
    private trailIndex: number = 0;

    private particleCount: number;
    private trailLength: number;
    private colorStart: THREE.Color;
    private colorEnd: THREE.Color;

    private currentAttractor: Attractor;
    private currentParams: AttractorParams;

    constructor(attractor: Attractor, options: ParticleSystemOptions) {
        this.particleCount = options.particleCount;
        this.trailLength = options.trailLength;
        this.colorStart = options.colorStart;
        this.colorEnd = options.colorEnd;
        this.currentAttractor = attractor;
        this.currentParams = { ...attractor.params };

        const totalPoints = this.particleCount * this.trailLength;

        this.positions = new Float32Array(totalPoints * 3);
        this.colors = new Float32Array(totalPoints * 3);
        this.sizes = new Float32Array(totalPoints);

        // Initialize trail storage
        this.trailPositions = [];
        for (let i = 0; i < this.trailLength; i++) {
            this.trailPositions.push(new Float32Array(this.particleCount * 3));
        }

        // Create geometry FIRST (before initializeParticles)
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

        // Custom shader material for better looking particles
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: this.createParticleTexture() }
            },
            vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (150.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord;
          float dist = length(uv - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });

        this.points = new THREE.Points(this.geometry, this.material);

        // Initialize particles AFTER geometry is created
        this.initializeParticles();
    }

    private createParticleTexture(): THREE.Texture {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;

        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    private initializeParticles(): void {
        const scale = this.currentAttractor.scale;

        for (let i = 0; i < this.particleCount; i++) {
            // Random starting position near the attractor
            const x = (Math.random() - 0.5) * 2 * scale;
            const y = (Math.random() - 0.5) * 2 * scale;
            const z = (Math.random() - 0.5) * 2 * scale + 25;

            // Initialize all trail positions to the same point
            for (let t = 0; t < this.trailLength; t++) {
                this.trailPositions[t][i * 3] = x;
                this.trailPositions[t][i * 3 + 1] = y;
                this.trailPositions[t][i * 3 + 2] = z;
            }
        }

        this.updateBuffers();
    }

    private updateBuffers(): void {
        const scale = this.currentAttractor.scale;

        for (let i = 0; i < this.particleCount; i++) {
            for (let t = 0; t < this.trailLength; t++) {
                const trailIdx = (this.trailIndex + t) % this.trailLength;
                const bufferIdx = (i * this.trailLength + t) * 3;

                this.positions[bufferIdx] = this.trailPositions[trailIdx][i * 3] * scale;
                this.positions[bufferIdx + 1] = this.trailPositions[trailIdx][i * 3 + 1] * scale;
                this.positions[bufferIdx + 2] = this.trailPositions[trailIdx][i * 3 + 2] * scale;

                // Color gradient based on trail position
                const trailFactor = t / this.trailLength;
                const color = new THREE.Color().lerpColors(this.colorEnd, this.colorStart, trailFactor);
                this.colors[bufferIdx] = color.r;
                this.colors[bufferIdx + 1] = color.g;
                this.colors[bufferIdx + 2] = color.b;

                // Size decreases along trail
                this.sizes[i * this.trailLength + t] = 2.5 * (1 - trailFactor * 0.7);
            }
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
    }

    update(speed: number = 1): void {
        const dt = this.currentAttractor.dt * speed;
        const currentTrail = this.trailPositions[this.trailIndex];
        const nextIndex = (this.trailIndex + this.trailLength - 1) % this.trailLength;
        const nextTrail = this.trailPositions[nextIndex];

        for (let i = 0; i < this.particleCount; i++) {
            const x = currentTrail[i * 3];
            const y = currentTrail[i * 3 + 1];
            const z = currentTrail[i * 3 + 2];

            const [nx, ny, nz] = this.currentAttractor.step(x, y, z, this.currentParams, dt);

            // Check for NaN/Infinity and reset if needed
            if (!isFinite(nx) || !isFinite(ny) || !isFinite(nz)) {
                const scale = this.currentAttractor.scale;
                nextTrail[i * 3] = (Math.random() - 0.5) * 2 * scale;
                nextTrail[i * 3 + 1] = (Math.random() - 0.5) * 2 * scale;
                nextTrail[i * 3 + 2] = (Math.random() - 0.5) * 2 * scale + 25;
            } else {
                nextTrail[i * 3] = nx;
                nextTrail[i * 3 + 1] = ny;
                nextTrail[i * 3 + 2] = nz;
            }
        }

        this.trailIndex = nextIndex;
        this.updateBuffers();
    }

    setAttractor(attractor: Attractor): void {
        this.currentAttractor = attractor;
        this.currentParams = { ...attractor.params };
        this.initializeParticles();
    }

    setParams(params: AttractorParams): void {
        this.currentParams = { ...params };
    }

    setColors(start: THREE.Color, end: THREE.Color): void {
        this.colorStart = start;
        this.colorEnd = end;
    }

    getObject(): THREE.Points {
        return this.points;
    }

    getParticleCount(): number {
        return this.particleCount * this.trailLength;
    }

    dispose(): void {
        this.geometry.dispose();
        this.material.dispose();
    }
}
