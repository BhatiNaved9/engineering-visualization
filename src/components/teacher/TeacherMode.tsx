/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CAD_ENGINEERING_MODELS } from '../../utils/cadModelsData';
import { BTU_SYLLABUS_MODULES } from '../../utils/syllabusData';
import { ThreeCadViewport } from '../viewport/ThreeCadViewport';
import {
  Presentation,
  Maximize2,
  Minimize2,
  Layers,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Scissors,
  Eye,
  RotateCcw,
} from 'lucide-react';

export const TeacherMode: React.FC = () => {
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number>(3);
  const [selectedModelId, setSelectedModelId] = useState<string>('piston-cylinder');
  const [activeDemonstration, setActiveDemonstration] = useState<string>('orthographic');

  const selectedModel =
    CAD_ENGINEERING_MODELS.find((m) => m.id === selectedModelId) || CAD_ENGINEERING_MODELS[0];
  const selectedModule =
    BTU_SYLLABUS_MODULES.find((m) => m.id === selectedModuleId) || BTU_SYLLABUS_MODULES[2];

  return (
    <div className={`space-y-6 ${isPresentationMode ? 'fixed inset-0 z-50 bg-[#090d14] p-6 overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded font-semibold">
              INSTRUCTOR PLATFORM
            </span>
            <span className="text-xs text-slate-400 font-mono">CLASSROOM VISUALIZATION</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Teacher & Classroom Presentation Suite
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Demonstrate 3D spatial concepts, section planes, and kinematic exploded views live during lectures.
          </p>
        </div>

        {/* Presentation Mode Toggle */}
        <button
          onClick={() => setIsPresentationMode(!isPresentationMode)}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-2 ${
            isPresentationMode
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-slate-900 border border-purple-500/40 text-purple-300 hover:bg-slate-800'
          }`}
        >
          {isPresentationMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          {isPresentationMode ? 'EXIT PRESENTATION MODE' : 'ENTER PRESENTATION MODE'}
        </button>
      </div>

      {/* Classroom Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D CAD Stage (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-purple-300 flex items-center gap-1.5">
                  <Presentation className="w-3.5 h-3.5 text-purple-400" />
                  LECTURE STAGE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  MODEL: {selectedModel.name}
                </span>
              </div>

              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700 rounded px-2.5 py-1 outline-none"
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
              allowExplode={true}
              allowSection={true}
              allowMeasurement={true}
              heightClass={isPresentationMode ? 'h-[620px]' : 'h-[480px]'}
            />
          </div>

          {/* Quick Demonstration Actions */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'orthographic', label: '1. Orthographic Concept' },
              { id: 'section', label: '2. Section Cut Plane' },
              { id: 'explode', label: '3. Kinematic Explosion' },
              { id: 'iso', label: '4. Isometric Scale 0.816' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDemonstration(d.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  activeDemonstration === d.id
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Lesson Flow & Talking Points (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-lg bg-[#0c1017] border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-purple-400 font-bold">ACTIVE LESSON PLAN</span>
              <span className="text-slate-400">{selectedModule.code}</span>
            </div>

            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(Number(e.target.value))}
              className="w-full bg-slate-900 text-xs text-slate-200 border border-slate-700 rounded p-2 outline-none font-mono"
            >
              {BTU_SYLLABUS_MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  Module {m.id}: {m.title.slice(0, 32)}...
                </option>
              ))}
            </select>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 text-slate-300 text-[11px]">
              <span className="text-cyan-400 font-bold block">TALKING POINTS FOR STUDENTS:</span>
              <ul className="space-y-1 text-slate-400">
                {selectedModule.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-purple-400">▸</span> {obj}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded bg-purple-500/10 border border-purple-500/30 text-[11px] text-purple-300">
              <span className="font-bold block mb-1">RECOMMENDED EXERCISE:</span>
              Ask students to switch to Drawing Lab and sketch the front elevation and sectional plan on an A3 sheet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
