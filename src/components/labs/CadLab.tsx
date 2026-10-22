/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import {
  Square,
  Circle as CircleIcon,
  Minus,
  Maximize2,
  Minimize2,
  Box,
  RotateCw,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface SketchEntity {
  id: string;
  type: 'line' | 'rect' | 'circle';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  radius?: number;
  isConstrained?: boolean;
}

export const CadLab: React.FC = () => {
  // 2D Sketcher State
  const [activeTool, setActiveTool] = useState<'line' | 'rect' | 'circle' | 'select'>('line');
  const [sketchEntities, setSketchEntities] = useState<SketchEntity[]>([
    { id: 'base-line', type: 'line', x1: 50, y1: 150, x2: 250, y2: 150, isConstrained: true },
    { id: 'left-line', type: 'line', x1: 50, y1: 150, x2: 50, y2: 60, isConstrained: true },
    { id: 'top-line', type: 'line', x1: 50, y1: 60, x2: 250, y2: 60, isConstrained: false },
    { id: 'right-line', type: 'line', x1: 250, y1: 60, x2: 250, y2: 150, isConstrained: false },
    { id: 'hole', type: 'circle', x1: 150, y1: 105, x2: 180, y2: 105, radius: 25, isConstrained: true },
  ]);

  // Constraints state
  const [constraintsApplied, setConstraintsApplied] = useState<string[]>([
    'Horizontal (Base Edge)',
    'Vertical (Left Wall)',
    'Coincident (Corners)',
    'Concentric (Bore)',
  ]);
  const [degreesOfFreedom, setDegreesOfFreedom] = useState<number>(2);

  // 3D Extrude & Revolve parameters
  const [active3dOp, setActive3dOp] = useState<'extrude' | 'revolve'>('extrude');
  const [extrudeDepth, setExtrudeDepth] = useState<number>(45);
  const [draftAngle, setDraftAngle] = useState<number>(0);
  const [revolveAngle, setRevolveAngle] = useState<number>(360);
  const [hasCutHole, setHasCutHole] = useState<boolean>(true);

  // Three.js 3D Preview Canvas Ref
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const previewSceneRef = useRef<THREE.Scene | null>(null);
  const previewCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Add constraint handler
  const handleApplyConstraint = (constraintName: string) => {
    if (!constraintsApplied.includes(constraintName)) {
      setConstraintsApplied([...constraintsApplied, constraintName]);
      setDegreesOfFreedom((prev) => Math.max(0, prev - 1));
      setSketchEntities((prev) =>
        prev.map((e, idx) => (idx === prev.length - 1 ? { ...e, isConstrained: true } : e))
      );
    }
  };

  const handleResetSketch = () => {
    setSketchEntities([
      { id: 'base-line', type: 'line', x1: 50, y1: 150, x2: 250, y2: 150, isConstrained: true },
      { id: 'left-line', type: 'line', x1: 50, y1: 150, x2: 50, y2: 60, isConstrained: true },
      { id: 'top-line', type: 'line', x1: 50, y1: 60, x2: 250, y2: 60, isConstrained: false },
      { id: 'right-line', type: 'line', x1: 250, y1: 60, x2: 250, y2: 150, isConstrained: false },
    ]);
    setConstraintsApplied(['Horizontal (Base)', 'Vertical (Left)']);
    setDegreesOfFreedom(3);
  };

  // Build the 3D Solid from the parametric sketch profile
  const update3dSolidMesh = useCallback(() => {
    if (!previewSceneRef.current) return;
    if (meshRef.current) {
      previewSceneRef.current.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      meshRef.current = null;
    }

    // Create 2D profile shape in Three.js
    const shape = new THREE.Shape();
    shape.moveTo(-45, -30);
    shape.lineTo(45, -30);
    shape.lineTo(45, 30);
    shape.lineTo(-45, 30);
    shape.closePath();

    if (hasCutHole) {
      // Internal hole path for extrude cut
      const holePath = new THREE.Path();
      holePath.absarc(0, 0, 15, 0, Math.PI * 2, true);
      shape.holes.push(holePath);
    }

    let geometry: THREE.BufferGeometry;

    if (active3dOp === 'extrude') {
      geometry = new THREE.ExtrudeGeometry(shape, {
        depth: extrudeDepth,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 2,
        bevelThickness: 2,
      });
    } else {
      // Revolve operation around Y axis
      const points = [
        new THREE.Vector2(15, -30),
        new THREE.Vector2(35, -30),
        new THREE.Vector2(35, 30),
        new THREE.Vector2(15, 30),
      ];
      geometry = new THREE.LatheGeometry(
        points,
        36,
        0,
        (revolveAngle * Math.PI) / 180
      );
    }

    geometry.center();

    const material = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.4,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Add black CAD edges to solid
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 25),
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1.5 })
    );
    mesh.add(edges);

    previewSceneRef.current.add(mesh);
    meshRef.current = mesh;
  }, [active3dOp, extrudeDepth, hasCutHole, revolveAngle]);

  // Setup Three.js preview canvas
  useEffect(() => {
    if (!previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 340;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0f141c, 1);
    renderer.shadowMap.enabled = true;
    previewRendererRef.current = renderer;

    const scene = new THREE.Scene();
    previewSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
    camera.position.set(90, 80, 110);
    camera.lookAt(0, 0, 0);
    previewCameraRef.current = camera;

    // Studio Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(60, 100, 70);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    fillLight.position.set(-60, 40, -60);
    scene.add(fillLight);

    // Floor grid
    const grid = new THREE.GridHelper(180, 18, 0x334155, 0x1e293b);
    grid.position.y = -40;
    scene.add(grid);

    update3dSolidMesh();

    let reqId: number;
    let angle = 0;
    const loop = () => {
      reqId = requestAnimationFrame(loop);
      if (meshRef.current) {
        angle += 0.005;
        meshRef.current.rotation.y = angle;
      }
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(reqId);
      renderer.dispose();
    };
  }, [update3dSolidMesh]);

  useEffect(() => {
    update3dSolidMesh();
  }, [update3dSolidMesh]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
              BTU MODULE 6 & 7
            </span>
            <span className="text-xs text-slate-400 font-mono">2D SKETCHER → 3D MODELLING WORKBENCH</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Parametric CAD Sketcher & Solid Engine
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Create dimensioned 2D geometry, resolve degrees of freedom with geometric constraints, and generate 3D solids.
          </p>
        </div>

        {/* Constraint Status Badge */}
        <div className="flex items-center gap-2">
          {degreesOfFreedom === 0 ? (
            <span className="px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SKETCH FULLY CONSTRAINED (0 DOF)
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              UNDER-CONSTRAINED ({degreesOfFreedom} DOF REMAINING)
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: 2D Sketcher on Left, 3D Workbench on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Parametric Sketcher (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            {/* 2D CAD Toolbar */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded px-2 py-1">
                <span className="text-[10px] font-mono text-slate-400 font-semibold mr-1">ENTITIES:</span>
                <button
                  onClick={() => setActiveTool('line')}
                  className={`p-1.5 rounded flex items-center gap-1 text-xs font-mono ${
                    activeTool === 'line' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Draw Line"
                >
                  <Minus className="w-3.5 h-3.5" /> LINE
                </button>
                <button
                  onClick={() => setActiveTool('rect')}
                  className={`p-1.5 rounded flex items-center gap-1 text-xs font-mono ${
                    activeTool === 'rect' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Draw Rectangle"
                >
                  <Square className="w-3.5 h-3.5" /> RECT
                </button>
                <button
                  onClick={() => setActiveTool('circle')}
                  className={`p-1.5 rounded flex items-center gap-1 text-xs font-mono ${
                    activeTool === 'circle' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Draw Circle / Bore"
                >
                  <CircleIcon className="w-3.5 h-3.5" /> CIRCLE
                </button>
              </div>

              <button
                onClick={handleResetSketch}
                className="px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded border border-slate-800 flex items-center gap-1"
                title="Reset Sketch to default baseline"
              >
                <RefreshCw className="w-3 h-3" /> RESET
              </button>
            </div>

            {/* Interactive 2D Drawing Board SVG */}
            <div className="relative aspect-[4/3] w-full bg-[#0a0e17] rounded border border-slate-800 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 320 220">
                <defs>
                  <pattern id="sketchGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#161f30" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="320" height="220" fill="url(#sketchGrid)" />

                {/* Origin Datum Symbol (0,0) */}
                <circle cx="50" cy="150" r="4" fill="#ec4899" />
                <path d="M 40 150 L 60 150 M 50 140 L 50 160" stroke="#ec4899" strokeWidth="1" />
                <text x="32" y="165" fill="#ec4899" fontSize="9" fontFamily="monospace">
                  (0,0)
                </text>

                {/* Render Sketch Entities */}
                {sketchEntities.map((ent) => {
                  const color = ent.isConstrained ? '#10b981' : '#38bdf8';
                  if (ent.type === 'line') {
                    return (
                      <g key={ent.id}>
                        <line
                          x1={ent.x1}
                          y1={ent.y1}
                          x2={ent.x2}
                          y2={ent.y2}
                          stroke={color}
                          strokeWidth="2.5"
                        />
                        <circle cx={ent.x1} cy={ent.y1} r="3" fill={color} />
                        <circle cx={ent.x2} cy={ent.y2} r="3" fill={color} />
                      </g>
                    );
                  }
                  if (ent.type === 'circle') {
                    return (
                      <g key={ent.id}>
                        <circle
                          cx={ent.x1}
                          cy={ent.y1}
                          r={ent.radius || 20}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                        />
                        {/* Centerline Cross */}
                        <line x1={ent.x1 - 32} y1={ent.y1} x2={ent.x1 + 32} y2={ent.y1} stroke="#ec4899" strokeWidth="0.8" strokeDasharray="6,2,1,2" />
                        <line x1={ent.x1} y1={ent.y1 - 32} x2={ent.x1} y2={ent.y1 + 32} stroke="#ec4899" strokeWidth="0.8" strokeDasharray="6,2,1,2" />
                        <text x={ent.x1 + 10} y={ent.y1 - 10} fill={color} fontSize="9" fontFamily="monospace">
                          Ø{((ent.radius || 20) * 2).toFixed(0)}
                        </text>
                      </g>
                    );
                  }
                  return null;
                })}

                {/* Dimension Annotation: Width 200mm */}
                <g transform="translate(0, 175)">
                  <line x1="50" y1="0" x2="250" y2="0" stroke="#f59e0b" strokeWidth="1" />
                  <polygon points="50,0 56,-2 56,2" fill="#f59e0b" />
                  <polygon points="250,0 244,-2 244,2" fill="#f59e0b" />
                  <text x="150" y="-4" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    200.00 mm
                  </text>
                </g>

                {/* Dimension Annotation: Height 90mm */}
                <g transform="translate(275, 0)">
                  <line x1="0" y1="60" x2="0" y2="150" stroke="#f59e0b" strokeWidth="1" />
                  <polygon points="0,60 -2,66 2,66" fill="#f59e0b" />
                  <polygon points="0,150 -2,144 2,144" fill="#f59e0b" />
                  <text x="6" y="110" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                    90.0 mm
                  </text>
                </g>
              </svg>
            </div>

            {/* Constraints Workbench */}
            <div className="mt-3 p-3 bg-slate-950/70 border border-slate-800 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-300">
                  PARAMETRIC CONSTRAINTS
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {constraintsApplied.length} APPLIED
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  'Horizontal',
                  'Vertical',
                  'Perpendicular',
                  'Parallel',
                  'Concentric',
                  'Tangent',
                  'Equal Length',
                  'Coincident to Datum',
                ].map((c) => {
                  const isAdded = constraintsApplied.some((item) => item.toLowerCase().includes(c.toLowerCase()));
                  return (
                    <button
                      key={c}
                      onClick={() => handleApplyConstraint(`${c} (${c.toLowerCase()} relation)`)}
                      disabled={isAdded}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors flex items-center gap-1 ${
                        isAdded
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 opacity-80 cursor-default'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-300'
                      }`}
                    >
                      {isAdded ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3" />}
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3D Solid Feature Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-[#0c1017] p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                3D FEATURE WORKBENCH
              </span>

              {/* Feature Operation Switcher */}
              <div className="flex gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded">
                <button
                  onClick={() => setActive3dOp('extrude')}
                  className={`px-2 py-0.5 text-[11px] font-mono uppercase rounded ${
                    active3dOp === 'extrude' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EXTRUDE BOSS
                </button>
                <button
                  onClick={() => setActive3dOp('revolve')}
                  className={`px-2 py-0.5 text-[11px] font-mono uppercase rounded ${
                    active3dOp === 'revolve' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  REVOLVE BOSS
                </button>
              </div>
            </div>

            {/* 3D Solid Model Canvas */}
            <div className="relative aspect-[4/3] w-full bg-[#090d14] rounded border border-slate-800 overflow-hidden">
              <canvas ref={previewCanvasRef} className="w-full h-full block" />
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/80 rounded border border-slate-700/60 text-[10px] font-mono text-cyan-300">
                LIVE 3D CAD ROTATION
              </div>
            </div>

            {/* 3D Operation Parameters */}
            <div className="mt-4 space-y-3 font-mono text-xs">
              {active3dOp === 'extrude' ? (
                <>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>EXTRUSION DEPTH:</span>
                      <span className="text-cyan-400 font-bold">{extrudeDepth} mm</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="100"
                      value={extrudeDepth}
                      onChange={(e) => setExtrudeDepth(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>DRAFT ANGLE:</span>
                      <span className="text-cyan-400 font-bold">{draftAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={draftAngle}
                      onChange={(e) => setDraftAngle(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>REVOLUTION ANGLE:</span>
                    <span className="text-cyan-400 font-bold">{revolveAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="90"
                    max="360"
                    step="15"
                    value={revolveAngle}
                    onChange={(e) => setRevolveAngle(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              )}

              {/* Cut Extrude Toggle */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-rose-400" />
                  BORE CAVITY (CUT EXTRUDE)
                </span>
                <input
                  type="checkbox"
                  checked={hasCutHole}
                  onChange={(e) => setHasCutHole(e.target.checked)}
                  className="accent-cyan-400 cursor-pointer w-4 h-4"
                />
              </div>

              {/* CAD Educational Rule Note */}
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <span className="text-cyan-400 font-bold block mb-0.5">BTU CAD PRINCIPLE:</span>
                Parametric models maintain parent-child relationships. Changing the 2D sketch dimension immediately updates the downstream 3D solid geometry and associative 2D drawing projections.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
