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
  FileText,
  CheckCircle2,
  Cpu,
  ArrowRight,
} from 'lucide-react';

export const CaseStudiesView: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('piston-cylinder');

  const selectedModel =
    CAD_ENGINEERING_MODELS.find((m) => m.id === selectedCaseId) || CAD_ENGINEERING_MODELS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-semibold">
              APPLIED ENGINEERING
            </span>
            <span className="text-xs text-slate-400 font-mono">INDUSTRIAL CASE STUDIES</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Engineering Case Studies & Component Library
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Examine real-world mechanical elements: function, materials, orthographic drawing interpretation, and manufacturing drawings.
          </p>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CAD_ENGINEERING_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedCaseId(model.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all border flex items-center gap-1.5 ${
              selectedCaseId === model.id
                ? 'bg-cyan-600 border-cyan-500 text-white font-bold shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            {model.name}
          </button>
        ))}
      </div>

      {/* Main Case Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-slate-300">
                3D CAD INSPECTION: {selectedModel.name}
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                MODULE {selectedModel.syllabusModule}
              </span>
            </div>

            <ThreeCadViewport
              model={selectedModel}
              allowExplode={true}
              allowSection={true}
              allowMeasurement={true}
              heightClass="h-[460px]"
            />
          </div>
        </div>

        {/* Right: Technical Dossier & Drawing Interpretation (5 cols) */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          <div className="p-4 rounded-lg bg-[#0c1017] border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold uppercase">TECHNICAL SPECIFICATIONS</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                {selectedModel.difficulty}
              </span>
            </div>

            <p className="text-slate-300 font-sans leading-relaxed text-sm">
              {selectedModel.description}
            </p>

            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="text-slate-400">ENVELOPE DIMENSIONS:</div>
              <div className="text-slate-200">
                Length: {selectedModel.dimensions.length} mm • Width: {selectedModel.dimensions.width} mm • Height: {selectedModel.dimensions.height} mm
              </div>
            </div>

            {/* Component Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Assembly Components & Parts:</span>
              <div className="space-y-1">
                {selectedModel.parts.map((p, idx) => (
                  <div key={p.id} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Part #{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawing Interpretation Guidance */}
            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1 text-slate-400 text-[11px]">
              <span className="text-cyan-400 font-bold block">DRAWING INTERPRETATION NOTES:</span>
              <ul className="space-y-1">
                {selectedModel.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-cyan-400">•</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
