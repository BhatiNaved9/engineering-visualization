/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BTU_COURSE_INFO,
  COURSE_OBJECTIVES,
  COURSE_OUTCOMES,
  BTU_SYLLABUS_MODULES,
  LINE_TYPES_CATALOG,
  PENCIL_GRADES,
  DRAWING_SHEET_SIZES,
  PRACTICAL_ROADMAP_14_WEEKS,
} from '../../utils/syllabusData';
import {
  BookOpen,
  Calendar,
  Layers,
  Ruler,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
} from 'lucide-react';

export const CourseSyllabus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'practical' | 'line-types' | 'sheets'>('modules');
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(1);
  const [selectedLineTypeId, setSelectedLineTypeId] = useState<string>('continuous-thick');

  const selectedLineType =
    LINE_TYPES_CATALOG.find((l) => l.id === selectedLineTypeId) || LINE_TYPES_CATALOG[0];

  return (
    <div className="space-y-6">
      {/* Header & Course Metadata */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-semibold">
                COURSE CODE: {BTU_COURSE_INFO.courseCode}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {BTU_COURSE_INFO.university}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              {BTU_COURSE_INFO.courseName}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {BTU_COURSE_INFO.degree} • {BTU_COURSE_INFO.branches}
            </p>
          </div>

          {/* Academic Assessment Breakdown */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">CREDITS / CONTACT</div>
              <div className="text-cyan-400 font-bold">{BTU_COURSE_INFO.credits} / {BTU_COURSE_INFO.contactHours}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">INTERNAL / EXAM</div>
              <div className="text-slate-200 font-bold">{BTU_COURSE_INFO.internalAssessment} / {BTU_COURSE_INFO.endTermExamination} MARKS</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">EXAM DURATION</div>
              <div className="text-amber-400 font-bold">{BTU_COURSE_INFO.examDuration}</div>
            </div>
          </div>
        </div>

        {/* Course Outcomes & Objectives Pill Grid */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {COURSE_OUTCOMES.map((co) => (
            <div key={co.code} className="p-2.5 rounded bg-slate-900/40 border border-slate-800 flex items-start gap-2">
              <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-300">{co.code}:</span>{' '}
                <span className="text-slate-400">{co.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'modules', label: '10 COURSE MODULES', icon: BookOpen },
          { id: 'practical', label: '14-WEEK PRACTICAL ROADMAP', icon: Calendar },
          { id: 'line-types', label: 'LINE TYPES LAB (BIS SP 46)', icon: Layers },
          { id: 'sheets', label: 'DRAWING SHEETS & PENCILS', icon: Ruler },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-mono uppercase rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: 10 Course Modules */}
      {activeTab === 'modules' && (
        <div className="space-y-3">
          {BTU_SYLLABUS_MODULES.map((mod) => {
            const isExpanded = expandedModuleId === mod.id;
            return (
              <div
                key={mod.id}
                className="rounded-lg border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                      {mod.code}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">
                        Module {mod.id}: {mod.title}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Duration: {mod.lectureHours} • Practical Weeks: {mod.practicalWeek.join(', ')}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/60 space-y-4">
                    {/* Objectives */}
                    <div className="mt-3 p-3 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                      <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                        Module Learning Objectives:
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {mod.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-cyan-400 mt-1">•</span> {obj}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Topics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mod.topics.map((top, idx) => (
                        <div key={idx} className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1.5">
                          <h4 className="text-xs font-bold text-slate-200">{top.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{top.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {top.keyPoints.map((kp, kIdx) => (
                              <span
                                key={kIdx}
                                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                              >
                                {kp}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Lab Exercises */}
                    <div className="p-3 rounded bg-cyan-950/20 border border-cyan-800/40 text-xs font-mono space-y-1">
                      <span className="text-cyan-300 font-bold block">
                        BTU HANDS-ON LABORATORY TASKS:
                      </span>
                      <div className="flex flex-wrap gap-2 text-slate-300 pt-1">
                        {mod.labExercises.map((task, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-900 rounded border border-slate-700">
                            ✓ {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: 14-Week Practical Lab Roadmap */}
      {activeTab === 'practical' && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>OFFICIAL BTU PRACTICAL SYLLABUS — 14 WEEKS (0L + 0T + 3P)</span>
            <span className="text-cyan-400 font-bold">100% COVERAGE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRACTICAL_ROADMAP_14_WEEKS.map((w) => (
              <div
                key={w.week}
                className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                    WEEK {w.week}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">LAB SESSION</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">{w.title}</h3>
                <p className="text-xs text-slate-400">{w.goal}</p>

                <div className="pt-2 border-t border-slate-800/60 space-y-1 font-mono text-[11px]">
                  <span className="text-slate-400 text-[10px] block uppercase">Laboratory Deliverables:</span>
                  {w.labTasks.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-cyan-400">▸</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Line Types Lab (BIS SP 46:2003) */}
      {activeTab === 'line-types' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Line Type Selection Catalog */}
          <div className="lg:col-span-5 space-y-2">
            <h3 className="text-xs font-mono font-semibold text-slate-400 mb-2">
              BUREAU OF INDIAN STANDARDS (BIS SP 46) LINE CLASSIFICATION
            </h3>
            {LINE_TYPES_CATALOG.map((line) => (
              <button
                key={line.id}
                onClick={() => setSelectedLineTypeId(line.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  selectedLineTypeId === line.id
                    ? 'bg-slate-800 border-cyan-500/50 shadow-md'
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-100">{line.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400">{line.bisCode}</span>
                </div>
                {/* SVG Visual line representation */}
                <svg className="w-full h-4" viewBox="0 0 200 12">
                  <line
                    x1="0"
                    y1="6"
                    x2="200"
                    y2="6"
                    stroke={line.color}
                    strokeWidth={line.thickness.includes('0.5') ? 2.5 : 1.2}
                    strokeDasharray={line.dashPattern !== 'none' ? line.dashPattern : undefined}
                  />
                </svg>
              </button>
            ))}
          </div>

          {/* Right: Line Inspection & Engineering Usage */}
          <div className="lg:col-span-7 p-5 rounded-lg border border-slate-800 bg-[#0c1017] space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                  BIS TYPE {selectedLineType.bisCode}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">
                  {selectedLineType.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
                Thickness: {selectedLineType.thickness}
              </span>
            </div>

            {/* High-res Line Visualizer */}
            <div className="p-4 rounded bg-[#070a10] border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-2">HIGH RESOLUTION CAD PREVIEW:</span>
              <svg className="w-full h-8" viewBox="0 0 400 24">
                <line
                  x1="10"
                  y1="12"
                  x2="390"
                  y2="12"
                  stroke={selectedLineType.color}
                  strokeWidth={selectedLineType.thickness.includes('0.5') ? 3.5 : 1.8}
                  strokeDasharray={selectedLineType.dashPattern !== 'none' ? selectedLineType.dashPattern : undefined}
                />
              </svg>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {selectedLineType.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800 font-mono text-xs">
              <span className="text-slate-400 text-[10px] uppercase block font-bold">Standard Engineering Applications:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedLineType.usage.map((u, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                    <span className="text-cyan-400">✓</span> {u}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400">
              <span className="text-amber-400 font-bold block mb-0.5">PRACTICAL CONTEXT:</span>
              {selectedLineType.exampleContext}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Drawing Sheets & Pencil Grades */}
      {activeTab === 'sheets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Drawing Sheet Sizes (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono font-semibold text-slate-400">
              STANDARD ISO / BIS DRAWING SHEET SIZES (SP 46:2003)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase bg-slate-950/60">
                    <th className="p-3">Designation</th>
                    <th className="p-3">Dimensions (W x H)</th>
                    <th className="p-3">Left Margin</th>
                    <th className="p-3">Borders</th>
                    <th className="p-3 text-right">Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {DRAWING_SHEET_SIZES.map((sheet) => (
                    <tr key={sheet.name} className="hover:bg-slate-800/30">
                      <td className="p-3 text-cyan-400 font-bold">{sheet.name}</td>
                      <td className="p-3 text-slate-200">{sheet.width} x {sheet.height} mm</td>
                      <td className="p-3 text-slate-400">{sheet.margin} mm</td>
                      <td className="p-3 text-slate-400">{sheet.border} mm</td>
                      <td className="p-3 text-right text-amber-400 font-semibold">{sheet.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 leading-relaxed">
              <span className="text-cyan-400 font-bold block mb-1">BTU LAB STANDARD:</span>
              A3 size (297 x 420 mm) is the prescribed sheet for all weekly laboratory exercises and university end-term examinations. The left binding margin is strictly 20 mm.
            </div>
          </div>

          {/* Pencil Grades Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono font-semibold text-slate-400">
              PENCIL HARDNESS SCALE & APPLICATION
            </h3>
            <div className="space-y-2.5 font-mono text-xs">
              {PENCIL_GRADES.map((p) => (
                <div key={p.grade} className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300 font-bold text-sm">{p.grade}</span>
                    <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                      {p.hardness}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{p.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
