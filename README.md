# Strange Attractors

Interactive 3D visualization of chaotic systems and strange attractors using Three.js.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## Features

- **8 Strange Attractors**: Lorenz, Thomas, Dadras, Rössler, Aizawa, Chen, Halvorsen, Sprott
- **Real-time 3D Rendering**: GPU-accelerated particle system with trails
- **Interactive Controls**: Rotate, zoom, pan with OrbitControls
- **Live Parameter Tuning**: Adjust attractor parameters in real-time
- **LaTeX Equations**: Beautiful mathematical equations rendered with KaTeX
- **Customizable Visuals**: Colors, particle count, trail length, speed

## 📁 Project Structure

```
strange-attractors/
├── index.html           # Entry HTML with KaTeX CDN
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite dev server config
└── src/
    ├── main.ts          # App entry, Three.js scene, UI controls
    ├── attractors.ts    # 8 attractor definitions with equations
    ├── particleSystem.ts # GPU particle renderer with trails
    ├── style.css        # Dark theme with glassmorphism
    └── vite-env.d.ts    # Type declarations
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd strange-attractors

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:xxxx** in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Controls

| Action | Control |
|--------|---------|
| Rotate | Left-click + drag |
| Zoom | Scroll wheel |
| Pan | Right-click + drag |
| Select attractor | Type dropdown |
| Adjust parameters | Sliders |

## Attractors

| Attractor | Year | Description |
|-----------|------|-------------|
| **Lorenz** | 1963 | The classic butterfly - atmospheric convection |
| **Thomas** | 1999 | Cyclically symmetric biological system |
| **Dadras** | 2010 | Multi-scroll chaotic system |
| **Rössler** | 1976 | Simplest continuous chaotic system |
| **Aizawa** | - | Toroidal spiral vortex |
| **Chen** | 1999 | Double-scroll pattern |
| **Halvorsen** | - | Three intertwined spirals |
| **Sprott** | 1994 | Auto-discovered minimal system |

## Tech Stack

- **[Three.js](https://threejs.org/)** - 3D rendering and WebGL
- **[Vite](https://vitejs.dev/)** - Fast development server and bundler
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[lil-gui](https://lil-gui.georgealways.com/)** - Lightweight GUI controls
- **[KaTeX](https://katex.org/)** - Fast LaTeX rendering

## 📄 License

MIT License - feel free to use this project for learning and experimentation.

