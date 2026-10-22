/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CAD_ENGINEERING_MODELS } from '../../utils/cadModelsData';
import { ThreeCadViewport } from '../viewport/ThreeCadViewport';
import {
  Compass,
  Layers,
  Box,
  Scissors,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Award,
} from 'lucide-react';

interface LandingHeroProps {
  onEnterLab: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterLab }) => {
  const heroModel = CAD_ENGINEERING_MODELS.find((m) => m.id === 'angle-bracket-rib') || CAD_ENGINEERING_MODELS[0];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <div className="relative rounded-2xl border border-slate-800 bg-[#0a0e17] overflow-hidden p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              BIKANER TECHNICAL UNIVERSITY • 1FY2-28
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100 font-mono leading-tight">
              ENGINEERING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
                VISION
              </span>
            </h1>

            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              &quot;See Engineering. Understand Geometry. Build in 3D.&quot;
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              A digital engineering visualization laboratory engineered around the BTU B.Tech 1st Year Engineering Visualization syllabus. Transition seamlessly from 2D orthographic drawings to 3D spatial solids.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onEnterLab}
                className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm font-bold transition-all shadow-lg flex items-center gap-2"
              >
                <span>ENTER ENGINEERING LAB</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 font-mono text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">STANDARD</div>
                <div className="text-slate-200 font-bold">BIS SP 46:2003</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">PROJECTION</div>
                <div className="text-cyan-400 font-bold">1ST & 3RD ANGLE</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">EVALUATION</div>
                <div className="text-slate-200 font-bold">100 MARKS (BTU)</div>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Hero 3D Viewport (6 cols) */}
          <div className="lg:col-span-6 space-y-2">
            <div className="rounded-xl border border-slate-800 bg-[#0d121c] p-2.5 shadow-xl relative">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Box className="w-3.5 h-3.5" />
                  INTERACTIVE HERO OBJECT: {heroModel.name}
                </span>
                <span className="text-[10px] text-slate-500">DRAG TO ROTATE 3D</span>
              </div>

              <ThreeCadViewport
                model={heroModel}
                allowExplode={true}
                allowSection={true}
                allowMeasurement={true}
                heightClass="h-[380px]"
              />

              <div className="p-2 text-center font-mono text-[11px] text-slate-400">
                Rotate camera to view Front Elevation, Plan (Top), and Profile (Side) projections live.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pillar Showcase */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            THE DIGITAL ENGINEERING LABORATORY
          </h2>
          <p className="text-2xl font-bold text-slate-100 font-mono">
            Designed for Real Technical Rigor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3 font-mono">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Projection Simulator</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Plot 3D points, straight lines, and polyhedra in space. Watch projection rays hit the Horizontal Plane (HP) and Vertical Plane (VP) and unfold into 2D engineering sheets.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3 font-mono">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Parametric CAD Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Practice 2D constraint solving: horizontal, vertical, tangent, and concentric relations. Eliminate degrees of freedom and generate 3D solids via Extrude and Revolve.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3 font-mono">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">AI Drawing Analyzer</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Audit engineering drawings against Bureau of Indian Standards (BIS SP 46:2003). Detect inverted First Angle views, missing hidden lines, and misaligned projectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
