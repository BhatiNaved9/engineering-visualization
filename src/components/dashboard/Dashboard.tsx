/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  Layers,
  Box,
  Scissors,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  Clock,
  Plus,
  FolderOpen,
} from 'lucide-react';
import { BTU_COURSE_INFO } from '../../utils/syllabusData';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner with Engineering Precision Aesthetic */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-slate-950 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-semibold">
              BTU 1FY2-28
            </span>
            <span className="text-xs text-slate-400 font-mono">
              B.Tech Engineering Visualization Laboratory
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 font-mono">
            ENGINEERING VISION
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            From 2D Engineering Drawings to 3D Understanding. Master orthographic projections, parametric CAD sketching, section planes, and assembly kinematic mates.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('projection-lab')}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              ENTER PROJECTION LAB
            </button>
            <button
              onClick={() => onNavigate('drawing-lab')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              CHECK MY DRAWING
            </button>
            <button
              onClick={() => onNavigate('cad-lab')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <Box className="w-4 h-4 text-cyan-400" />
              2D CAD SKETCHER
            </button>
          </div>
        </div>
      </div>

      {/* Core Engineering Laboratories Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            INTERACTIVE 3D ENGINEERING LABORATORIES
          </h2>
          <span className="text-xs text-slate-500 font-mono">100% HARDWARE ACCELERATED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'projection-lab',
              title: 'Projection Simulator',
              subtitle: 'Module 3 & 4: Point, Line & Solid Projections',
              icon: Compass,
              color: 'text-cyan-400',
              badge: 'FIRST / THIRD ANGLE',
            },
            {
              id: 'cad-lab',
              title: '2D Sketcher & 3D Solids',
              subtitle: 'Module 6 & 7: Parametric Constraints & Extrude',
              icon: Box,
              color: 'text-emerald-400',
              badge: 'DOF CONSTRAINT SOLVER',
            },
            {
              id: 'section-lab',
              title: 'Section Analysis Lab',
              subtitle: 'Module 9: Cutting Planes & 45° Hatching',
              icon: Scissors,
              color: 'text-rose-400',
              badge: 'BIS SP 46 RULES',
            },
            {
              id: 'assembly-lab',
              title: 'Assembly & Kinematics',
              subtitle: 'Module 10: Multi-part Exploded Views & BOM',
              icon: Layers,
              color: 'text-purple-400',
              badge: 'EXPLODED MATES',
            },
          ].map((lab) => {
            const Icon = lab.icon;
            return (
              <button
                key={lab.id}
                onClick={() => onNavigate(lab.id)}
                className="p-5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-slate-700 text-left transition-all group flex flex-col justify-between h-44"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <Icon className={`w-5 h-5 ${lab.color}`} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      {lab.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {lab.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {lab.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Engineering Models & Activity — Genuine Empty States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved CAD Models */}
        <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              MY SAVED ENGINEERING MODELS
            </h3>
            <span className="text-[11px] font-mono text-slate-500">0 MODELS</span>
          </div>

          <div className="p-8 rounded-lg bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-2">
            <Box className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-xs font-mono text-slate-300 font-semibold">
              No models created yet.
            </div>
            <p className="text-[11px] font-mono text-slate-500 max-w-xs mx-auto">
              Your engineering workspace is ready. Launch the 2D CAD Sketcher to create and save your first parametric part.
            </p>
            <button
              onClick={() => onNavigate('cad-lab')}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Create First Model
            </button>
          </div>
        </div>

        {/* Drawing Analysis Activity */}
        <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              DRAWING AUDIT HISTORY
            </h3>
            <span className="text-[11px] font-mono text-slate-500">0 AUDITS</span>
          </div>

          <div className="p-8 rounded-lg bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-xs font-mono text-slate-300 font-semibold">
              No drawings submitted yet.
            </div>
            <p className="text-[11px] font-mono text-slate-500 max-w-xs mx-auto">
              Upload your engineering drawing or test standard scenarios in the Drawing Analyzer to check BIS SP 46 rule compliance.
            </p>
            <button
              onClick={() => onNavigate('drawing-lab')}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Audit a Drawing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
