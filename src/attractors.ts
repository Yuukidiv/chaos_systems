export interface AttractorParams {
    [key: string]: number;
}

export interface Attractor {
    name: string;
    description: string;
    wikipediaUrl: string;
    equation: string; // HTML formatted equation
    params: AttractorParams;
    paramRanges: { [key: string]: [number, number, number] }; // [min, max, step]
    dt: number;
    scale: number;
    cameraPosition: [number, number, number];
    step: (x: number, y: number, z: number, params: AttractorParams, dt: number) => [number, number, number];
}

// Lorenz Attractor - The classic butterfly
export const lorenz: Attractor = {
    name: 'Lorenz',
    description: 'The iconic butterfly-shaped attractor discovered by Edward Lorenz in 1963 while modeling atmospheric convection. It sparked the modern study of chaos theory.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Lorenz_system',
    equation: `
        <span class="equation-line"><span class="derivative">dx/dt</span> = <span class="param">σ</span>(<span class="variable">y</span> - <span class="variable">x</span>)</span>
        <span class="equation-line"><span class="derivative">dy/dt</span> = <span class="variable">x</span>(<span class="param">ρ</span> - <span class="variable">z</span>) - <span class="variable">y</span></span>
        <span class="equation-line"><span class="derivative">dz/dt</span> = <span class="variable">x</span><span class="variable">y</span> - <span class="param">β</span><span class="variable">z</span></span>
    `,
    params: { sigma: 10, rho: 28, beta: 8 / 3 },
    paramRanges: {
        sigma: [0, 20, 0.1],
        rho: [0, 50, 0.1],
        beta: [0, 10, 0.01]
    },
    dt: 0.005,
    scale: 1.5,
    cameraPosition: [60, 60, 60],
    step: (x, y, z, p, dt) => {
        const dx = p.sigma * (y - x);
        const dy = x * (p.rho - z) - y;
        const dz = x * y - p.beta * z;
        return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
};

// Thomas Attractor - Cyclically symmetric
export const thomas: Attractor = {
    name: 'Thomas',
    description: 'A cyclically symmetric attractor with beautiful spiraling patterns. Discovered by René Thomas while studying biological systems and their feedback loops.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Thomas%27_cyclically_symmetric_attractor',
    equation: `
        <span class="equation-line"><span class="derivative">dx/dt</span> = sin(<span class="variable">y</span>) - <span class="param">b</span><span class="variable">x</span></span>
        <span class="equation-line"><span class="derivative">dy/dt</span> = sin(<span class="variable">z</span>) - <span class="param">b</span><span class="variable">y</span></span>
        <span class="equation-line"><span class="derivative">dz/dt</span> = sin(<span class="variable">x</span>) - <span class="param">b</span><span class="variable">z</span></span>
    `,
    params: { b: 0.208186 },
    paramRanges: {
        b: [0.1, 0.3, 0.001]
    },
    dt: 0.04,
    scale: 8,
    cameraPosition: [15, 15, 15],
    step: (x, y, z, p, dt) => {
        const dx = Math.sin(y) - p.b * x;
        const dy = Math.sin(z) - p.b * y;
        const dz = Math.sin(x) - p.b * z;
        return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
};

// Dadras Attractor
export const dadras: Attractor = {
    name: 'Dadras',
    description: 'A complex chaotic system discovered by Sara Dadras in 2010. It produces intricate patterns with multiple scrolls and wings.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Multiscroll_attractor',
    equation: `
        <span class="equation-line"><span class="derivative">dx/dt</span> = <span class="variable">y</span> - <span class="param">a</span><span class="variable">x</span> + <span class="param">b</span><span class="variable">yz</span></span>
        <span class="equation-line"><span class="derivative">dy/dt</span> = <span class="param">c</span><span class="variable">y</span> - <span class="variable">xz</span> + <span class="variable">z</span></span>
        <span class="equation-line"><span class="derivative">dz/dt</span> = <span class="param">d</span><span class="variable">xy</span> - <span class="param">e</span><span class="variable">z</span></span>
    `,
    params: { a: 3, b: 2.7, c: 1.7, d: 2, e: 9 },
    paramRanges: {
        a: [1, 5, 0.1],
        b: [1, 5, 0.1],
        c: [0.5, 3, 0.1],
        d: [1, 4, 0.1],
        e: [5, 15, 0.1]
    },
    dt: 0.004,
    scale: 2,
    cameraPosition: [40, 40, 40],
    step: (x, y, z, p, dt) => {
        const dx = y - p.a * x + p.b * y * z;
        const dy = p.c * y - x * z + z;
        const dz = p.d * x * y - p.e * z;
        return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
};

// Rossler Attractor - Simple elegance
export const rossler: Attractor = {
    name: 'Rössler',
    description: 'Designed by Otto Rössler in 1976 to be the simplest possible continuous chaotic system. Its elegant spiral structure reveals chaos arising from minimal equations.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/R%C3%B6ssler_attractor',
    equation: `
        <span class="equation-line"><span class="derivative">dx/dt</span> = -<span class="variable">y</span> - <span class="variable">z</span></span>
        <span class="equation-line"><span class="derivative">dy/dt</span> = <span class="variable">x</span> + <span class="param">a</span><span class="variable">y</span></span>
        <span class="equation-line"><span class="derivative">dz/dt</span> = <span class="param">b</span> + <span class="variable">z</span>(<span class="variable">x</span> - <span class="param">c</span>)</span>
    `,
    params: { a: 0.2, b: 0.2, c: 5.7 },
    paramRanges: {
        a: [0.1, 0.5, 0.01],
        b: [0.1, 0.5, 0.01],
        c: [3, 10, 0.1]
    },
    dt: 0.01,
    scale: 2.5,
    cameraPosition: [40, 40, 40],
    step: (x, y, z, p, dt) => {
        const dx = -y - z;
        const dy = x + p.a * y;
        const dz = p.b + z * (x - p.c);
        return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
};

// Aizawa Attractor - Beautiful spiral
export const aizawa: Attractor = {
    name: 'Aizawa',
    description: 'A mesmerizing attractor that creates intricate toroidal patterns. Its spiraling structure unfolds like a cosmic vortex, revealing hidden order within chaos.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Aizawa_attractor',
    equation: `
        <span class="equation-line"><span class="derivative">dx/dt</span> = (<span class="variable">z</span> - <span class="param">b</span>)<span class="variable">x</span> - <span class="param">d</span><span class="variable">y</span></span>
        <span class="equation-line"><span class="derivative">dy/dt</span> = <span class="param">d</span><span class="variable">x</span> + (<span class="variable">z</span> - <span class="param">b</span>)<span class="variable">y</span></span>
        <span class="equation-line"><span class="derivative">dz/dt</span> = <span class="param">c</span> + <span class="param">a</span><span class="variable">z</span> - <span class="variable">z</span>³/3 - (<span class="variable">x</span>² + <span class="variable">y</span>²)(1 + <span class="param">e</span><span class="variable">z</span>) + <span class="param">f</span><span class="variable">zx</span>³</span>
    `,
    params: { a: 0.95, b: 0.7, c: 0.6, d: 3.5, e: 0.25, f: 0.1 },
    paramRanges: {
        a: [0.5, 1.5, 0.01],
        b: [0.3, 1.0, 0.01],
        c: [0.3, 1.0, 0.01],
        d: [2.0, 5.0, 0.1],
        e: [0.1, 0.5, 0.01],
        f: [0.05, 0.3, 0.01]
    },
    dt: 0.005,
    scale: 10,
    cameraPosition: [8, 8, 8],
    step: (x, y, z, p, dt) => {
        const dx = (z - p.b) * x - p.d * y;
        const dy = p.d * x + (z - p.b) * y;
        const dz = p.c + p.a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + p.e * z) + p.f * z * x * x * x;
        return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
};

// Chen Attractor - Double scroll
export const chen: Attractor = {
    name: 'Chen',
    description: 'Discovered by Guanrong Chen in 1999, this attractor generates a distinctive double-scroll pattern. It bridges the gap between Lorenz-like and other chaotic systems.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Multiscroll_attractor#Chen_attractor',
    equation: `
        <span class="equation-line"><span class="derivative">dx/dt</span> = <span class="param">a</span>(<span class="variable">y</span> - <span class="variable">x</span>)</span>
        <span class="equation-line"><span class="derivative">dy/dt</span> = (<span class="param">c</span> - <span class="param">a</span>)<span class="variable">x</span> - <span class="variable">xz</span> + <span class="param">c</span><span class="variable">y</span></span>
        <span class="equation-line"><span class="derivative">dz/dt</span> = <span class="variable">xy</span> - <span class="param">b</span><span class="variable">z</span></span>
    `,
    params: { a: 40, b: 3, c: 28 },
    paramRanges: {
        a: [30, 50, 0.5],
        b: [1, 5, 0.1],
        c: [20, 35, 0.5]
    },
    dt: 0.002,
    scale: 1.2,
    cameraPosition: [80, 80, 80],
    step: (x, y, z, p, dt) => {
        const dx = p.a * (y - x);
        const dy = (p.c - p.a) * x - x * z + p.c * y;
        const dz = x * y - p.b * z;
        return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
};

// Halvorsen Attractor
export const halvorsen: Attractor = {
    name: 'Halvorsen',
    description: 'A cyclically symmetric attractor creating three intertwined spirals. Its elegant form demonstrates how simple equations can produce extraordinarily complex behavior.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Halvorsen_attractor',
    equation: `
        <span class="equation-line"><span class="derivative">dx/dt</span> = -<span class="param">a</span><span class="variable">x</span> - 4<span class="variable">y</span> - 4<span class="variable">z</span> - <span class="variable">y</span>²</span>
        <span class="equation-line"><span class="derivative">dy/dt</span> = -<span class="param">a</span><span class="variable">y</span> - 4<span class="variable">z</span> - 4<span class="variable">x</span> - <span class="variable">z</span>²</span>
        <span class="equation-line"><span class="derivative">dz/dt</span> = -<span class="param">a</span><span class="variable">z</span> - 4<span class="variable">x</span> - 4<span class="variable">y</span> - <span class="variable">x</span>²</span>
    `,
    params: { a: 1.89 },
    paramRanges: {
        a: [1.0, 3.0, 0.01]
    },
    dt: 0.005,
    scale: 4,
    cameraPosition: [30, 30, 30],
    step: (x, y, z, p, dt) => {
        const dx = -p.a * x - 4 * y - 4 * z - y * y;
        const dy = -p.a * y - 4 * z - 4 * x - z * z;
        const dz = -p.a * z - 4 * x - 4 * y - x * x;
        return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
};

// Sprott Attractor
export const sprott: Attractor = {
    name: 'Sprott',
    description: 'One of many systems discovered by Julien Clinton Sprott through automated search. This variant produces an elegant spiral with remarkable sensitivity to initial conditions.',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Sprott_attractor',
    equation: `
        <span class="equation-line"><span class="derivative">dx/dt</span> = <span class="variable">y</span> + <span class="param">a</span><span class="variable">xy</span> + <span class="variable">xz</span></span>
        <span class="equation-line"><span class="derivative">dy/dt</span> = 1 - <span class="param">b</span><span class="variable">x</span>² + <span class="variable">yz</span></span>
        <span class="equation-line"><span class="derivative">dz/dt</span> = <span class="variable">x</span> - <span class="variable">x</span>² - <span class="variable">y</span>²</span>
    `,
    params: { a: 2.07, b: 1.79 },
    paramRanges: {
        a: [1.5, 3.0, 0.01],
        b: [1.0, 2.5, 0.01]
    },
    dt: 0.02,
    scale: 5,
    cameraPosition: [20, 20, 20],
    step: (x, y, z, p, dt) => {
        const dx = y + p.a * x * y + x * z;
        const dy = 1 - p.b * x * x + y * z;
        const dz = x - x * x - y * y;
        return [x + dx * dt, y + dy * dt, z + dz * dt];
    }
};

// Collection of all attractors
export const attractors: { [key: string]: Attractor } = {
    lorenz,
    thomas,
    dadras,
    rossler,
    aizawa,
    chen,
    halvorsen,
    sprott
};

export const attractorNames = Object.keys(attractors);
