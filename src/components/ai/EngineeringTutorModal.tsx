/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  BookOpen,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface EngineeringTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'tutor';
  text: string;
  moduleRef?: number;
}

export const EngineeringTutorModal: React.FC<EngineeringTutorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'tutor',
      text: 'Welcome to the Engineering Vision Academic Tutor. Ask any technical question regarding the BTU Engineering Visualization (1FY2-28) curriculum, BIS SP 46 drawing standards, or CAD geometry.',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');

  if (!isOpen) return null;

  const quickQuestions = [
    'What is First Angle projection vs Third Angle?',
    'Why is Isometric scale ratio 0.816?',
    'Which parts must NEVER be section-hatched?',
    'What is the standard arrowhead ratio in dimensioning?',
  ];

  const handleAsk = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = { sender: 'user', text: query };
    const lower = query.toLowerCase();

    let responseText = '';
    let modRef: number | undefined;

    if (lower.includes('first angle') || lower.includes('third angle')) {
      modRef = 3;
      responseText =
        'In First Angle Projection (BIS standard in India):\n• The object is placed in the 1st quadrant (above HP, in front of VP).\n• The Front View (Elevation) appears ABOVE the reference XY line.\n• The Top View (Plan) appears BELOW the reference XY line.\n• The Left Side View is drawn on the RIGHT side of the front view.\n\nIn Third Angle Projection (US/ANSI standard):\n• The object is placed in the 3rd quadrant.\n• Top view is ABOVE XY line, Front view is BELOW XY line, and Left view is on the LEFT.';
    } else if (lower.includes('isometric') || lower.includes('0.816')) {
      modRef = 5;
      responseText =
        'The Isometric Scale reduction ratio is derived mathematically:\nFrom the geometry of standard 30° isometric axes and 45° true angle on a square:\n\nIsometric Length / True Length = cos(45°) / cos(30°)\n= (1 / √2) / (√3 / 2) = 2 / (√2 × √3) = √2 / √3 ≈ 0.81649 (approx. 82%).\n\nWhen drawing an "Isometric View / Isometric Drawing", true scale is used. When drawing an "Isometric Projection", the isometric scale factor (0.816) is strictly applied.';
    } else if (lower.includes('hatch') || lower.includes('never') || lower.includes('section')) {
      modRef = 9;
      responseText =
        'According to Bureau of Indian Standards (BIS SP 46:2003 / ISO 128):\nSolid shafts, bolts, nuts, keys, pins, rivets, spokes of wheels, and thin stiffener ribs are NEVER cross-hatched when cut longitudinally along their axis. Hatching them would mislead the reader into believing the machine component is hollow or thin.';
    } else if (lower.includes('arrowhead') || lower.includes('dimension')) {
      modRef = 2;
      responseText =
        'Standard dimensioning rules (BIS SP 46):\n• Arrowheads should be closed and filled with length-to-width ratio of 3:1.\n• Dimension lines should never cross extension lines.\n• Extension lines must extend 2 to 3 mm beyond the dimension line.\n• In the Aligned system, dimensions are placed perpendicular to the dimension line and read from bottom or right.';
    } else {
      modRef = 1;
      responseText =
        `Under BTU Course 1FY2-28, "${query}" is grounded in standard engineering visualization principles. Please review the corresponding syllabus module or use the interactive 3D labs to inspect the geometry directly.`;
    }

    const tutorMsg: Message = { sender: 'tutor', text: responseText, moduleRef: modRef };
    setMessages((prev) => [...prev, userMsg, tutorMsg]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0c1017] border border-slate-800 rounded-xl shadow-2xl flex flex-col h-[580px] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                ENGINEERING ACADEMIC TUTOR
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                BTU 1FY2-28 • BIS SP 46:2003 Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-lg whitespace-pre-wrap leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {m.moduleRef && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-cyan-400 font-bold">
                  <BookOpen className="w-3 h-3" /> Sourced from BTU Syllabus Module {m.moduleRef}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-500 shrink-0">SUGGESTIONS:</span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAsk(q)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(inputText)}
            placeholder="Ask a question about First Angle, line types, traces, section cuts..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleAsk(inputText)}
            className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
