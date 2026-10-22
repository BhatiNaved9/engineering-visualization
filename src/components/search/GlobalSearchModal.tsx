/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Compass,
  Box,
  Layers,
  Scissors,
  FileText,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { BTU_SYLLABUS_MODULES, LINE_TYPES_CATALOG } from '../../utils/syllabusData';
import { CAD_ENGINEERING_MODELS } from '../../utils/cadModelsData';
import { ALL_VERIFIED_QUESTIONS } from '../../utils/questionBankData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search through modules
  const matchingModules = BTU_SYLLABUS_MODULES.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.topics.some((t) => t.title.toLowerCase().includes(q))
  );

  // Search through CAD models
  const matchingModels = CAD_ENGINEERING_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.features.some((f) => f.toLowerCase().includes(q))
  );

  // Search through Line types
  const matchingLines = LINE_TYPES_CATALOG.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.bisCode.toLowerCase().includes(q)
  );

  // Search through Questions
  const matchingQuestions = ALL_VERIFIED_QUESTIONS.filter(
    (item) =>
      item.questionText.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q)
  );

  const handleSelect = (destination: string) => {
    onNavigate(destination);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-xl bg-[#0c1017] border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-mono text-xs flex flex-col max-h-[500px]">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-2 bg-slate-900/80">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search syllabus modules, CAD operations, line types, PYQs..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 outline-none text-xs"
          />
          <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ESC
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Quick Lab Shortcuts */}
          <div>
            <div className="text-[10px] text-slate-500 uppercase px-2 mb-1">
              ENGINEERING LABS
            </div>
            <div className="space-y-1">
              {[
                { id: 'projection-lab', title: 'Projection Simulator', icon: Compass },
                { id: 'cad-lab', title: '2D CAD Sketcher & 3D Extrude', icon: Box },
                { id: 'section-lab', title: 'Section Analysis Lab', icon: Scissors },
                { id: 'assembly-lab', title: 'Assembly & Kinematic Mates', icon: Layers },
                { id: 'drawing-lab', title: 'Drawing Analyzer (BIS SP 46)', icon: FileText },
              ].map((lab) => {
                const Icon = lab.icon;
                return (
                  <button
                    key={lab.id}
                    onClick={() => handleSelect(lab.id)}
                    className="w-full p-2 rounded hover:bg-slate-800/80 text-left flex items-center justify-between text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lab.title}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Syllabus Modules */}
          {matchingModules.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 uppercase px-2 mb-1">
                BTU SYLLABUS MODULES ({matchingModules.length})
              </div>
              <div className="space-y-1">
                {matchingModules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelect('course-syllabus')}
                    className="w-full p-2 rounded hover:bg-slate-800/80 text-left flex items-center justify-between text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    <div>
                      <span className="text-cyan-400 font-bold">{m.code}:</span> {m.title}
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CAD Models */}
          {matchingModels.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 uppercase px-2 mb-1">
                CAD ENGINEERING MODELS ({matchingModels.length})
              </div>
              <div className="space-y-1">
                {matchingModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelect('case-studies')}
                    className="w-full p-2 rounded hover:bg-slate-800/80 text-left flex items-center justify-between text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Box className="w-3 h-3 text-emerald-400" />
                      <span>{m.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{m.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Line Types */}
          {matchingLines.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 uppercase px-2 mb-1">
                BIS LINE CONVENTIONS ({matchingLines.length})
              </div>
              <div className="space-y-1">
                {matchingLines.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect('course-syllabus')}
                    className="w-full p-2 rounded hover:bg-slate-800/80 text-left flex items-center justify-between text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    <div>
                      <span className="text-cyan-400 font-bold">{l.bisCode}:</span> {l.name}
                    </div>
                    <span className="text-[10px] text-slate-500">{l.thickness}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
