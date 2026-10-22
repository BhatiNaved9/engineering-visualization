/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Point3D,
  ProjectionSystem,
} from '../../types/cad';
import {
  calculatePointProjection,
  analyzeLineProjection,
} from '../../utils/projection';
import { CAD_ENGINEERING_MODELS } from '../../utils/cadModelsData';
import { ThreeCadViewport } from '../viewport/ThreeCadViewport';
import {
  Compass,
  Layers,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const ProjectionLab: React.FC = () => {
  const [projectionSystem, setProjectionSystem] = useState<ProjectionSystem>('first-angle');
  const [labMode, setLabMode] = useState<'point' | 'line' | 'solid'>('solid');
  const [selectedModelId, setSelectedModelId] = useState<string>('hexagonal-prism');

  // Point projection state
  const [point, setPoint] = useState<Point3D>({ x: 40, y: 35, z: 45 });

  // Line projection state
  const [lineP1, setLineP1] = useState<Point3D>({ x: 20, y: 20, z: 15 });
  const [lineP2, setLineP2] = useState<Point3D>({ x: 75, y: 55, z: 60 });

  const selectedModel = CAD_ENGINEERING_MODELS.find((m) => m.id === selectedModelId) || CAD_ENGINEERING_MODELS[0];
  const pointProjection = calculatePointProjection(point, projectionSystem);
  const lineAnalysis = analyzeLineProjection(lineP1, lineP2);

  return (
    <div className="space-y-6">
      {/* Header & Concept Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
              BTU MODULE 3 & 4
            </span>
            <span className="text-xs text-slate-400 font-mono">1FY2-28 / BIS SP 46:2003</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Projection Simulator & Orthographic Laboratory
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Visualize how 3D spatial geometry projects perpendicularly onto Horizontal Plane (HP) and Vertical Plane (VP).
          </p>
        </div>

        {/* First Angle vs Third Angle System Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
          <button
            onClick={() => setProjectionSystem('first-angle')}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all ${
              projectionSystem === 'first-angle'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FIRST ANGLE (BIS / India)
          </button>
          <button
            onClick={() => setProjectionSystem('third-angle')}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all ${
              projectionSystem === 'third-angle'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            THIRD ANGLE (USA / ANSI)
          </button>
        </div>
      </div>

      {/* Lab Mode Selector */}
      <div className="flex gap-2 border-b border-slate-800/80 pb-3">
        {(['solid', 'line', 'point'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setLabMode(mode)}
            className={`px-4 py-2 text-xs font-mono uppercase rounded-md transition-colors flex items-center gap-2 ${
              labMode === mode
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {mode === 'solid' && <Layers className="w-3.5 h-3.5" />}
            {mode === 'line' && <Compass className="w-3.5 h-3.5" />}
            {mode === 'point' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {mode} PROJECTION
          </button>
        ))}
      </div>

      {/* Main Interactive Stage: 3D Viewport on Left, 2D Drawing Sheet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D CAD Viewport & Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                3D SPATIAL VIEWPORT (HP & VP PLANES)
              </span>

              {labMode === 'solid' && (
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700 rounded px-2 py-1 outline-none focus:border-cyan-500"
                >
                  {CAD_ENGINEERING_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <ThreeCadViewport
              model={selectedModel}
              projectionSystem={projectionSystem}
              heightClass="h-[440px]"
            />
          </div>

          {/* Interactive Parameters Panel */}
          {labMode === 'point' && (
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-semibold text-slate-200">
                  POINT P COORDINATES IN SPACE
                </h4>
                <span className="text-[11px] font-mono text-cyan-400">
                  {pointProjection.description}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    X (Distance from Profile Plane): {point.x} mm
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={point.x}
                    onChange={(e) => setPoint({ ...point, x: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Y (Height from HP): {point.y} mm
                  </label>
                  <input
                    type="range"
                    min="-60"
                    max="80"
                    value={point.y}
                    onChange={(e) => setPoint({ ...point, y: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Z (Distance from VP): {point.z} mm
                  </label>
                  <input
                    type="range"
                    min="-60"
                    max="80"
                    value={point.z}
                    onChange={(e) => setPoint({ ...point, z: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {labMode === 'line' && (
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-semibold text-slate-200">
                  STRAIGHT LINE AB MATHEMATICAL ANALYSIS
                </h4>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  TRUE LENGTH (TL): {lineAnalysis.trueLength} mm
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Point A: ({lineP1.x}, {lineP1.y}, {lineP1.z}) mm</div>
                  <div className="text-slate-400">Point B: ({lineP2.x}, {lineP2.y}, {lineP2.z}) mm</div>
                  <div className="text-emerald-400 font-semibold">
                    Inclination with HP (θ): {lineAnalysis.angleWithHP_Degrees}°
                  </div>
                  <div className="text-sky-400 font-semibold">
                    Inclination with VP (φ): {lineAnalysis.angleWithVP_Degrees}°
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="text-slate-300">
                    Elevation Length (Front View): <span className="text-cyan-400 font-semibold">{lineAnalysis.apparentElevationLength} mm</span>
                  </div>
                  <div className="text-slate-300">
                    Plan Length (Top View): <span className="text-amber-400 font-semibold">{lineAnalysis.apparentPlanLength} mm</span>
                  </div>
                  <div className="text-slate-400 text-[11px] pt-1">
                    {lineAnalysis.isParallelToHP ? 'Parallel to HP | ' : ''}
                    {lineAnalysis.isParallelToVP ? 'Parallel to VP | ' : ''}
                    {!lineAnalysis.isParallelToHP && !lineAnalysis.isParallelToVP ? 'Inclined to both planes' : ''}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    End B Height (Y): {lineP2.y} mm
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={lineP2.y}
                    onChange={(e) => setLineP2({ ...lineP2, y: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    End B Distance from VP (Z): {lineP2.z} mm
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={lineP2.z}
                    onChange={(e) => setLineP2({ ...lineP2, z: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {labMode === 'solid' && (
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-slate-100">{selectedModel.name}</div>
                <p className="text-slate-400">{selectedModel.description}</p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                  {selectedModel.features.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                      • {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Unfolded 2D Drawing Sheet (The Core Engineering Concept) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-[#0c1017] p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-amber-400" />
                2D DRAWING SHEET PROJECTION (UNFOLDED)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                SCALE 1:1 | BIS SP 46
              </span>
            </div>

            {/* SVG Engineering Drawing Canvas */}
            <div className="relative aspect-[4/3] w-full bg-[#0a0d14] rounded border border-slate-800 p-2 flex flex-col justify-between overflow-hidden">
              {/* Technical Drawing Paper Grid Background */}
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <defs>
                  <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#172033" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="400" height="300" fill="url(#cadGrid)" />

                {/* Reference XY Ground Line */}
                <line x1="20" y1="150" x2="380" y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="none" />
                <text x="25" y="145" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  X
                </text>
                <text x="370" y="145" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  Y
                </text>

                {/* First Angle vs Third Angle Labels on Drawing Sheet */}
                {projectionSystem === 'first-angle' ? (
                  <>
                    <text x="25" y="30" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      VERTICAL PLANE (VP) — ELEVATION / FRONT VIEW
                    </text>
                    <text x="25" y="280" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      HORIZONTAL PLANE (HP ROTATED DOWN) — PLAN / TOP VIEW
                    </text>
                  </>
                ) : (
                  <>
                    <text x="25" y="30" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      HORIZONTAL PLANE (HP) — PLAN / TOP VIEW
                    </text>
                    <text x="25" y="280" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      VERTICAL PLANE (VP) — ELEVATION / FRONT VIEW
                    </text>
                  </>
                )}

                {/* Point Projection Mode Rendering */}
                {labMode === 'point' && (
                  <g>
                    {/* Projector Line */}
                    <line
                      x1={180}
                      y1={150 - (projectionSystem === 'first-angle' ? point.y : -point.y)}
                      x2={180}
                      y2={150 + (projectionSystem === 'first-angle' ? point.z : -point.z)}
                      stroke="#64748b"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />

                    {/* Front View Point a' */}
                    <circle
                      cx={180}
                      cy={150 - (projectionSystem === 'first-angle' ? point.y : -point.y)}
                      r="4"
                      fill="#38bdf8"
                    />
                    <text
                      x={190}
                      y={150 - (projectionSystem === 'first-angle' ? point.y : -point.y) + 4}
                      fill="#38bdf8"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      a&apos; (Front: {point.y}mm)
                    </text>

                    {/* Top View Point a */}
                    <circle
                      cx={180}
                      cy={150 + (projectionSystem === 'first-angle' ? point.z : -point.z)}
                      r="4"
                      fill="#10b981"
                    />
                    <text
                      x={190}
                      y={150 + (projectionSystem === 'first-angle' ? point.z : -point.z) + 4}
                      fill="#10b981"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      a (Top: {point.z}mm)
                    </text>
                  </g>
                )}

                {/* Line Projection Mode Rendering */}
                {labMode === 'line' && (
                  <g>
                    {/* Elevation Front View Line a'b' */}
                    <line
                      x1={100}
                      y1={150 - lineP1.y}
                      x2={220}
                      y2={150 - lineP2.y}
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />
                    <circle cx={100} cy={150 - lineP1.y} r="3" fill="#38bdf8" />
                    <circle cx={220} cy={150 - lineP2.y} r="3" fill="#38bdf8" />
                    <text x={90} y={150 - lineP1.y - 6} fill="#38bdf8" fontSize="10" fontFamily="monospace">
                      a&apos;
                    </text>
                    <text x={225} y={150 - lineP2.y - 6} fill="#38bdf8" fontSize="10" fontFamily="monospace">
                      b&apos;
                    </text>

                    {/* Plan Top View Line ab */}
                    <line
                      x1={100}
                      y1={150 + lineP1.z}
                      x2={220}
                      y2={150 + lineP2.z}
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                    <circle cx={100} cy={150 + lineP1.z} r="3" fill="#10b981" />
                    <circle cx={220} cy={150 + lineP2.z} r="3" fill="#10b981" />
                    <text x={90} y={150 + lineP1.z + 14} fill="#10b981" fontSize="10" fontFamily="monospace">
                      a
                    </text>
                    <text x={225} y={150 + lineP2.z + 14} fill="#10b981" fontSize="10" fontFamily="monospace">
                      b
                    </text>

                    {/* Projector thin dashed lines */}
                    <line x1={100} y1={150 - lineP1.y} x2={100} y2={150 + lineP1.z} stroke="#475569" strokeDasharray="3,3" />
                    <line x1={220} y1={150 - lineP2.y} x2={220} y2={150 + lineP2.z} stroke="#475569" strokeDasharray="3,3" />
                  </g>
                )}

                {/* Solid Orthographic Projection Rendering */}
                {labMode === 'solid' && (
                  <g>
                    {/* Front Elevation View (Above XY in 1st Angle) */}
                    <g transform={`translate(110, ${projectionSystem === 'first-angle' ? 50 : 170})`}>
                      <rect x="0" y="0" width="80" height="70" fill="none" stroke="#38bdf8" strokeWidth="2" />
                      <line x1="20" y1="0" x2="20" y2="70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
                      <line x1="60" y1="0" x2="60" y2="70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
                      <line x1="40" y1="-10" x2="40" y2="80" stroke="#ec4899" strokeWidth="1" strokeDasharray="10,3,2,3" />
                      <text x="40" y="-12" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                        FRONT VIEW
                      </text>
                    </g>

                    {/* Top Plan View (Below XY in 1st Angle) */}
                    <g transform={`translate(110, ${projectionSystem === 'first-angle' ? 170 : 50})`}>
                      <rect x="0" y="0" width="80" height="60" fill="none" stroke="#10b981" strokeWidth="2" />
                      <circle cx="40" cy="30" r="20" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                      <line x1="40" y1="-8" x2="40" y2="68" stroke="#ec4899" strokeWidth="1" strokeDasharray="10,3,2,3" />
                      <line x1="-8" y1="30" x2="88" y2="30" stroke="#ec4899" strokeWidth="1" strokeDasharray="10,3,2,3" />
                      <text x="40" y="75" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                        TOP VIEW (PLAN)
                      </text>
                    </g>

                    {/* Side View (End Elevation) */}
                    <g transform={`translate(240, ${projectionSystem === 'first-angle' ? 50 : 170})`}>
                      <rect x="0" y="0" width="60" height="70" fill="none" stroke="#a855f7" strokeWidth="2" />
                      <circle cx="30" cy="35" r="16" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
                      <text x="30" y="-12" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                        {projectionSystem === 'first-angle' ? 'L.H.S. VIEW' : 'R.H.S. VIEW'}
                      </text>
                    </g>

                    {/* Alignment Projectors between Front and Top */}
                    <line x1="110" y1="50" x2="110" y2="230" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.8" />
                    <line x1="190" y1="50" x2="190" y2="230" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.8" />
                  </g>
                )}

                {/* Drawing Sheet Title Block (Standard BTU Lab Format) */}
                <g transform="translate(250, 245)">
                  <rect x="0" y="0" width="140" height="50" fill="#0d131f" stroke="#334155" strokeWidth="1" />
                  <text x="6" y="14" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                    BTU B.TECH EVALUATION
                  </text>
                  <text x="6" y="27" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    PROJECTION LAB 1FY2-28
                  </text>
                  <text x="6" y="40" fill="#64748b" fontSize="8" fontFamily="monospace">
                    {projectionSystem === 'first-angle' ? 'FIRST ANGLE PROJ' : 'THIRD ANGLE PROJ'}
                  </text>
                </g>
              </svg>
            </div>

            {/* Educational Takeaway Box */}
            <div className="mt-3 p-3 bg-slate-900/60 rounded border border-slate-800 text-xs text-slate-300 space-y-1.5 font-mono">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" />
                KEY PRINCIPLE: {projectionSystem === 'first-angle' ? 'FIRST ANGLE (BIS SP 46)' : 'THIRD ANGLE (ANSI)'}
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {projectionSystem === 'first-angle'
                  ? 'Object lies between observer and plane. Front view is ABOVE reference XY line; Top view is BELOW XY line. Left side view is projected to the RIGHT of front view.'
                  : 'Plane lies between observer and object. Top view is ABOVE reference XY line; Front view is BELOW XY line. Left side view is placed to the LEFT of front view.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
