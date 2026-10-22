/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CAD_ENGINEERING_MODELS } from '../../utils/cadModelsData';
import { ThreeCadViewport } from '../viewport/ThreeCadViewport';
import {
  Scissors,
  Layers,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const SectionLab: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('sectioned-cylinder');
  const [sectionType, setSectionType] = useState<'full' | 'half' | 'offset'>('full');
  const [hatchAngle, setHatchAngle] = useState<number>(45);

  const selectedModel =
    CAD_ENGINEERING_MODELS.find((m) => m.id === selectedModelId) ||
    CAD_ENGINEERING_MODELS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded">
              BTU MODULE 9
            </span>
            <span className="text-xs text-slate-400 font-mono">SECTIONING OF MACHINE ELEMENTS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Section Analysis Laboratory & Cutting Planes
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Reveal internal geometries, eliminate confusing hidden lines, and inspect 45° cross-hatching conventions per BIS SP 46:2003.
          </p>
        </div>

        {/* Section Type Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
          {(['full', 'half', 'offset'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSectionType(t)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all uppercase ${
                sectionType === t
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t} SECTION
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: 3D Section Viewport on Left, 2D Section View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Sectioning Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-rose-300 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-rose-400" />
                3D CAD CUTTING PLANE VIEWPORT
              </span>

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
            </div>

            <ThreeCadViewport
              model={selectedModel}
              allowSection={true}
              heightClass="h-[440px]"
            />
          </div>

          {/* Sectioning Rules Card per BIS SP 46 */}
          <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              BIS SP 46:2003 SECTIONING RULES & CONVENTIONS
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs text-slate-300 font-mono">
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-bold block">1. Cutting Plane Line (Type H):</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Long-dashed dotted line, THICK at ends and bends (0.5mm), thin in middle (0.25mm), with bold arrows indicating line of sight.
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">2. Hatching Standards:</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Continuous thin lines drawn at 45° to the main outline with uniform spacing (1.5mm to 3mm).
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>CRITICAL EXAM EXCEPTION:</strong> Solid shafts, bolts, nuts, keys, pins, rivets, spokes, and thin stiffener ribs are NEVER hatched longitudinally.
              </span>
            </div>
          </div>
        </div>

        {/* Right: 2D Sectional View with 45° Hatching Pattern */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-[#0c1017] p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-rose-500" />
                2D SECTIONAL ELEVATION (A-A)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                SECTION A-A | HATCH: {hatchAngle}°
              </span>
            </div>

            {/* SVG Sectional View */}
            <div className="relative aspect-[4/3] w-full bg-[#0a0d14] rounded border border-slate-800 p-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 360 270">
                <defs>
                  {/* 45 Degree Cross Hatch Pattern */}
                  <pattern
                    id="sectionHatch"
                    width="10"
                    height="10"
                    patternTransform={`rotate(${hatchAngle})`}
                    patternUnits="userSpaceOnUse"
                  >
                    <line x1="0" y1="0" x2="0" y2="10" stroke="#f43f5e" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Technical Drawing Border */}
                <rect x="15" y="15" width="330" height="240" fill="none" stroke="#334155" strokeWidth="1" />

                {/* Section Title */}
                <text x="30" y="38" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  SECTIONAL ELEVATION ON A-A
                </text>

                {/* Outer Profile of Sectioned Part */}
                <path
                  d="M 60 70 L 300 70 L 300 120 L 250 120 L 250 200 L 110 200 L 110 120 L 60 120 Z"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Left Hatched Cut Section */}
                <path
                  d="M 60 70 L 140 70 L 140 200 L 110 200 L 110 120 L 60 120 Z"
                  fill="url(#sectionHatch)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />

                {/* Right Hatched Cut Section */}
                <path
                  d="M 220 70 L 300 70 L 300 120 L 250 120 L 250 200 L 220 200 Z"
                  fill="url(#sectionHatch)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />

                {/* Center Bore (Uncut Hollow Air Passage - Zero Hatch) */}
                <rect x="140" y="70" width="80" height="130" fill="#080b12" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="180" y="140" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  INTERNAL BORE (AIR)
                </text>

                {/* Symmetry Centerline Type G */}
                <line x1="180" y1="50" x2="180" y2="220" stroke="#ec4899" strokeWidth="1" strokeDasharray="12,3,2,3" />

                {/* Cutting Plane Line Indicator on Top */}
                <line x1="40" y1="240" x2="320" y2="240" stroke="#f43f5e" strokeWidth="1" strokeDasharray="12,3,2,3" />
                {/* Thick ends */}
                <line x1="30" y1="240" x2="50" y2="240" stroke="#f43f5e" strokeWidth="3" />
                <line x1="310" y1="240" x2="330" y2="240" stroke="#f43f5e" strokeWidth="3" />
                {/* Arrows pointing up */}
                <polygon points="40,240 37,230 43,230" fill="#f43f5e" />
                <text x="40" y="224" fill="#f43f5e" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  A
                </text>
                <polygon points="320,240 317,230 323,230" fill="#f43f5e" />
                <text x="320" y="224" fill="#f43f5e" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  A
                </text>
              </svg>
            </div>

            {/* Hatch Angle Controller */}
            <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>HATCH LINE INCLINATION:</span>
                <span className="text-rose-400 font-bold">{hatchAngle}°</span>
              </div>
              <input
                type="range"
                min="30"
                max="60"
                value={hatchAngle}
                onChange={(e) => setHatchAngle(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <span className="text-[10px] text-slate-400 block">
                Standard ISO/BIS orientation is strictly 45° to principal horizontal boundary lines.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
