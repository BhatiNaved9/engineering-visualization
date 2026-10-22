/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CAD_ENGINEERING_MODELS } from '../../utils/cadModelsData';
import { ThreeCadViewport } from '../viewport/ThreeCadViewport';
import {
  Layers,
  Box,
  CheckCircle2,
  FileSpreadsheet,
  Link2,
} from 'lucide-react';

export const AssemblyLab: React.FC = () => {
  const [selectedAssemblyId, setSelectedAssemblyId] = useState<string>('piston-cylinder');
  const [activeTab, setActiveTab] = useState<'bom' | 'mates'>('bom');

  const assemblyModels = CAD_ENGINEERING_MODELS.filter((m) => m.category === 'assemblies');
  const currentAssembly =
    assemblyModels.find((m) => m.id === selectedAssemblyId) || assemblyModels[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
              BTU MODULE 10
            </span>
            <span className="text-xs text-slate-400 font-mono">KINEMATIC MATES & EXPLODED VIEWS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Assembly Laboratory & Kinematic Mates
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Assemble multi-component engineering systems, simulate exploded sequences, and manage standard Bill of Materials (BOM).
          </p>
        </div>

        {/* Assembly Model Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
          {assemblyModels.map((asm) => (
            <button
              key={asm.id}
              onClick={() => setSelectedAssemblyId(asm.id)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all ${
                selectedAssemblyId === asm.id
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {asm.name.split(' ')[0]} {asm.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport & Assembly Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Exploded Assembly Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-cyan-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                ASSEMBLY 3D EXPLODE STAGE
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {currentAssembly.parts.length} COMPONENTS LOADED
              </span>
            </div>

            <ThreeCadViewport
              model={currentAssembly}
              allowExplode={true}
              heightClass="h-[460px]"
            />
          </div>

          {/* Quick Assembly Advice */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-100 block mb-0.5">EXPLODED VIEW HIERARCHY:</span>
              Fasteners and retainer pins explode first along their axial direction, followed by sub-assemblies (piston skirt, connecting rod shank, and cap).
            </div>
          </div>
        </div>

        {/* Right: Bill of Materials (BOM) & Kinematic Mates */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-[#0c1017] p-4">
            {/* Tab switch: BOM vs Mates */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('bom')}
                  className={`text-xs font-mono pb-1 border-b-2 font-semibold flex items-center gap-1 transition-colors ${
                    activeTab === 'bom'
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> BILL OF MATERIALS (BOM)
                </button>
                <button
                  onClick={() => setActiveTab('mates')}
                  className={`text-xs font-mono pb-1 border-b-2 font-semibold flex items-center gap-1 transition-colors ${
                    activeTab === 'mates'
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" /> MECHANICAL MATES
                </button>
              </div>
            </div>

            {activeTab === 'bom' ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                        <th className="py-1.5 px-2">Item</th>
                        <th className="py-1.5 px-2">Part Name</th>
                        <th className="py-1.5 px-2">Color</th>
                        <th className="py-1.5 px-2 text-right">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      {currentAssembly.parts.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-900/50">
                          <td className="py-2 px-2 text-cyan-400 font-bold">#{idx + 1}</td>
                          <td className="py-2 px-2 text-slate-200">{p.name}</td>
                          <td className="py-2 px-2">
                            <span
                              className="inline-block w-3 h-3 rounded-full border border-slate-700"
                              style={{ backgroundColor: p.color }}
                            />
                          </td>
                          <td className="py-2 px-2 text-right text-slate-400">1</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-bold block mb-0.5">BOM STANDARD (BIS):</span>
                  Balloon numbers correspond directly to numbered leader lines on the engineering assembly sheet.
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-cyan-300 font-bold">
                      <span>REVOLUTE MATE (1 DOF)</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Wrist pin / gudgeon pin inside small-end bushing allows pure rotation about Z-axis.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-cyan-300 font-bold">
                      <span>FASTENED MATE (0 DOF)</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Big-end cap secured to connecting rod shank with 2x M8 high-tensile studs.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-cyan-300 font-bold">
                      <span>CYLINDRICAL MATE (2 DOF)</span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        SLIDER BOUND
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Piston skirt sliding reciprocally inside engine cylinder sleeve bore.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
