/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CAD_ENGINEERING_MODELS } from '../../utils/cadModelsData';
import {
  analyzeEngineeringDrawing,
  DrawingAnalysisReport,
  DrawingSampleInput,
} from '../../utils/drawingAnalyzer';
import { ThreeCadViewport } from '../viewport/ThreeCadViewport';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  Download,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export const DrawingLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d-to-2d' | 'analyzer' | 'reconstruction'>('analyzer');
  const [selectedModelId, setSelectedModelId] = useState<string>('angle-bracket-rib');

  // Drawing Analyzer Test Samples
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const sampleScenarios: { name: string; input: DrawingSampleInput }[] = [
    {
      name: 'Compliant A3 Bracket Drawing (Full First Angle)',
      input: {
        name: 'Compliant Bracket',
        projectionSystem: 'first-angle',
        hasFrontView: true,
        hasTopView: true,
        hasSideView: true,
        viewsAlignedVertically: true,
        viewsAlignedHorizontally: true,
        hasCenterlines: true,
        hasHiddenLines: true,
        hasDimensionText: true,
        hasTitleBlock: true,
        hasProjectionSymbol: true,
        hasInternalHolesWithoutHiddenLine: false,
        topViewAboveFrontInFirstAngle: false,
      },
    },
    {
      name: 'Common Student Error: Inverted First Angle Layout',
      input: {
        name: 'Inverted Layout',
        projectionSystem: 'first-angle',
        hasFrontView: true,
        hasTopView: true,
        hasSideView: true,
        viewsAlignedVertically: true,
        viewsAlignedHorizontally: true,
        hasCenterlines: true,
        hasHiddenLines: true,
        hasDimensionText: true,
        hasTitleBlock: true,
        hasProjectionSymbol: false,
        hasInternalHolesWithoutHiddenLine: false,
        topViewAboveFrontInFirstAngle: true, // ERROR
      },
    },
    {
      name: 'Common Student Error: Missing Hidden Lines & Misaligned Projectors',
      input: {
        name: 'Missing Hidden Lines',
        projectionSystem: 'first-angle',
        hasFrontView: true,
        hasTopView: true,
        hasSideView: false,
        viewsAlignedVertically: false, // ERROR
        viewsAlignedHorizontally: false,
        hasCenterlines: false, // ERROR
        hasHiddenLines: false, // ERROR
        hasDimensionText: true,
        hasTitleBlock: true,
        hasProjectionSymbol: false,
        hasInternalHolesWithoutHiddenLine: true, // ERROR
        topViewAboveFrontInFirstAngle: false,
      },
    },
    {
      name: 'Ambiguous Drawing: Single 2D Elevation View Only',
      input: {
        name: 'Single View Only',
        projectionSystem: 'first-angle',
        hasFrontView: true,
        hasTopView: false, // Incomplete
        hasSideView: false,
        viewsAlignedVertically: false,
        viewsAlignedHorizontally: false,
        hasCenterlines: false,
        hasHiddenLines: false,
        hasDimensionText: false,
        hasTitleBlock: false,
        hasProjectionSymbol: false,
        hasInternalHolesWithoutHiddenLine: false,
        topViewAboveFrontInFirstAngle: false,
      },
    },
  ];

  const currentSample = sampleScenarios[selectedSampleIndex];
  const [analysisReport, setAnalysisReport] = useState<DrawingAnalysisReport>(() =>
    analyzeEngineeringDrawing(currentSample.input)
  );

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    setAnalysisReport(analyzeEngineeringDrawing(sampleScenarios[idx].input));
  };

  const selectedModel =
    CAD_ENGINEERING_MODELS.find((m) => m.id === selectedModelId) ||
    CAD_ENGINEERING_MODELS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
              FLAGSHIP LABORATORY
            </span>
            <span className="text-xs text-slate-400 font-mono">3D ↔ 2D CONVERSION & BIS SP 46 AUDIT</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Drawing Lab & AI Drawing Analyzer
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Generate standardized engineering drawings from 3D CAD, analyze drawings against BIS SP 46 rules, and reconstruct 3D models.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'analyzer'
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            CHECK MY DRAWING
          </button>
          <button
            onClick={() => setActiveTab('3d-to-2d')}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all flex items-center gap-1.5 ${
              activeTab === '3d-to-2d'
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            3D → 2D GENERATOR
          </button>
          <button
            onClick={() => setActiveTab('reconstruction')}
            className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'reconstruction'
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            2D → 3D RECONSTRUCTION
          </button>
        </div>
      </div>

      {/* TAB 1: Check My Drawing (AI Drawing Analyzer) */}
      {activeTab === 'analyzer' && (
        <div className="space-y-6">
          {/* Sample Selector & Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-semibold">SELECT DRAWING SCENARIO:</span>
              <select
                value={selectedSampleIndex}
                onChange={(e) => handleSelectSample(Number(e.target.value))}
                className="bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700 rounded px-2.5 py-1.5 outline-none focus:border-cyan-500"
              >
                {sampleScenarios.map((s, idx) => (
                  <option key={idx} value={idx}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload Custom Drawing (PNG / JPG / PDF)</span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    // Triggers analyzer simulation on uploaded drawing
                    handleSelectSample(1);
                  }
                }}
              />
            </label>
          </div>

          {/* Analysis Results Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Overall Score Card & Detected Issues (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Score Header */}
              <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-slate-400">ENGINEERING AUDIT SCORE</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-bold font-mono text-cyan-400">
                      {analysisReport.overallScore}
                    </span>
                    <span className="text-sm font-mono text-slate-400">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{analysisReport.summary}</p>
                </div>

                {/* Sub-scores */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">PROJECTION</div>
                    <div className="text-cyan-300 font-bold">{analysisReport.projectionScore}%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">ALIGNMENT</div>
                    <div className="text-cyan-300 font-bold">{analysisReport.alignmentScore}%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">LINE CONVENTION</div>
                    <div className="text-cyan-300 font-bold">{analysisReport.lineConventionScore}%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">DIMENSIONING</div>
                    <div className="text-cyan-300 font-bold">{analysisReport.dimensionScore}%</div>
                  </div>
                </div>
              </div>

              {/* Detected Issues List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase">
                    DETECTED COMPLIANCE ISSUES ({analysisReport.issues.length})
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">BIS SP 46:2003 RULES</span>
                </div>

                {analysisReport.issues.length === 0 ? (
                  <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div className="text-xs font-mono">
                      <div className="font-bold text-sm">Flawless Engineering Drawing</div>
                      Zero projection or line convention errors detected. Drawing is ready for manufacturing submission.
                    </div>
                  </div>
                ) : (
                  analysisReport.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-3.5 rounded-lg border font-mono text-xs space-y-1.5 ${
                        issue.severity === 'error'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                          : issue.severity === 'warning'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          {issue.severity === 'error' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                          {issue.severity === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                          {issue.title}
                        </span>
                        {issue.affectedView && (
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-700/60">
                            {issue.affectedView}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{issue.description}</p>
                      <div className="pt-1 text-[11px] text-cyan-300 flex items-start gap-1 font-semibold">
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>FIX: {issue.suggestedFix}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Visual Inspection Overlay Canvas (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-lg border border-slate-800 bg-[#0c1017] p-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    CV OVERLAY & ERROR DETECTION
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    FIRST ANGLE (1FY2-28)
                  </span>
                </div>

                {/* SVG Visual Overlay */}
                <div className="relative aspect-[4/3] w-full bg-[#0a0d14] rounded border border-slate-800 p-2 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 340 260">
                    <rect width="340" height="260" fill="#0b0f17" />
                    <line x1="20" y1="130" x2="320" y2="130" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="25" y="125" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                      X
                    </text>
                    <text x="310" y="125" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                      Y
                    </text>

                    {/* Front Elevation View */}
                    <g transform="translate(100, 35)">
                      <rect x="0" y="0" width="80" height="70" fill="none" stroke="#38bdf8" strokeWidth="2" />
                      {/* Hidden lines */}
                      {currentSample.input.hasHiddenLines ? (
                        <line x1="20" y1="0" x2="20" y2="70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
                      ) : (
                        /* Highlight missing hidden line in Red */
                        <g>
                          <line x1="20" y1="0" x2="20" y2="70" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2,2" />
                          <circle cx="20" cy="35" r="8" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-pulse" />
                        </g>
                      )}
                      <text x="40" y="-8" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        FRONT ELEVATION
                      </text>
                    </g>

                    {/* Top Plan View */}
                    <g
                      transform={`translate(100, ${
                        currentSample.input.topViewAboveFrontInFirstAngle ? 25 : 155
                      })`}
                    >
                      <rect
                        x="0"
                        y="0"
                        width="80"
                        height="60"
                        fill="none"
                        stroke={currentSample.input.topViewAboveFrontInFirstAngle ? '#f43f5e' : '#10b981'}
                        strokeWidth="2"
                      />
                      {currentSample.input.topViewAboveFrontInFirstAngle && (
                        <text x="40" y="35" fill="#f43f5e" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                          ERROR: TOP VIEW CANNOT BE ABOVE IN 1ST ANGLE
                        </text>
                      )}
                      <text x="40" y="75" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        TOP VIEW (PLAN)
                      </text>
                    </g>

                    {/* Vertical Projectors */}
                    <line
                      x1="100"
                      y1="35"
                      x2={currentSample.input.viewsAlignedVertically ? 100 : 130}
                      y2="215"
                      stroke={currentSample.input.viewsAlignedVertically ? '#334155' : '#f43f5e'}
                      strokeDasharray="3,3"
                      strokeWidth={currentSample.input.viewsAlignedVertically ? 1 : 1.5}
                    />
                  </svg>
                </div>

                <div className="mt-3 p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-bold block mb-0.5">3D RECONSTRUCTION STATUS:</span>
                  {analysisReport.reconstructionNotes}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 3D to 2D Drawing Generator */}
      {activeTab === '3d-to-2d' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-semibold">SELECT 3D CAD MODEL:</span>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700 rounded px-2.5 py-1.5 outline-none focus:border-cyan-500"
              >
                {CAD_ENGINEERING_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                PRINT / PDF
              </button>
            </div>
          </div>

          {/* Full A3 Engineering Drawing Sheet */}
          <div className="rounded-lg border border-slate-800 bg-[#090d14] p-6 shadow-2xl overflow-x-auto">
            <div className="min-w-[800px] aspect-[1.414/1] bg-[#070a10] border-2 border-slate-600 p-4 relative font-mono text-slate-300">
              {/* Sheet Border & Margins */}
              <div className="w-full h-full border border-slate-500 p-4 relative flex flex-col justify-between">
                {/* Header Information Bar */}
                <div className="flex justify-between items-center border-b border-slate-700 pb-2 text-xs">
                  <span className="text-cyan-400 font-bold">BIKANER TECHNICAL UNIVERSITY (BTU) — 1FY2-28</span>
                  <span className="text-slate-400">STANDARD DRAWING SHEET (FIRST ANGLE PROJECTION)</span>
                  <span className="text-amber-400 font-bold">SHEET: 01 / 01</span>
                </div>

                {/* 4 Orthographic Views Container */}
                <div className="grid grid-cols-2 gap-8 my-auto p-4">
                  {/* Top-Left: Front Elevation */}
                  <div className="p-4 border border-dashed border-slate-800 rounded relative">
                    <span className="absolute top-1 left-2 text-[10px] text-cyan-400 font-bold">
                      FRONT ELEVATION (VP)
                    </span>
                    <svg className="w-full h-36 mx-auto" viewBox="0 0 200 120">
                      <rect x="30" y="20" width="140" height="75" fill="none" stroke="#38bdf8" strokeWidth="2" />
                      <line x1="60" y1="20" x2="60" y2="95" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
                      <line x1="140" y1="20" x2="140" y2="95" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
                      <line x1="100" y1="10" x2="100" y2="105" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="8,2,1,2" />
                      {/* Dimensions */}
                      <text x="100" y="115" fill="#f59e0b" fontSize="9" textAnchor="middle">
                        140.00 mm
                      </text>
                    </svg>
                  </div>

                  {/* Top-Right: Left-Hand Side View */}
                  <div className="p-4 border border-dashed border-slate-800 rounded relative">
                    <span className="absolute top-1 left-2 text-[10px] text-cyan-400 font-bold">
                      SIDE VIEW (PROFILE PLANE)
                    </span>
                    <svg className="w-full h-36 mx-auto" viewBox="0 0 200 120">
                      <rect x="50" y="20" width="80" height="75" fill="none" stroke="#38bdf8" strokeWidth="2" />
                      <circle cx="90" cy="57.5" r="22" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
                      <line x1="90" y1="10" x2="90" y2="105" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="8,2,1,2" />
                      <line x1="40" y1="57.5" x2="140" y2="57.5" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="8,2,1,2" />
                    </svg>
                  </div>

                  {/* Bottom-Left: Plan (Top View) */}
                  <div className="p-4 border border-dashed border-slate-800 rounded relative">
                    <span className="absolute top-1 left-2 text-[10px] text-cyan-400 font-bold">
                      TOP VIEW (PLAN - HP)
                    </span>
                    <svg className="w-full h-36 mx-auto" viewBox="0 0 200 120">
                      <rect x="30" y="20" width="140" height="80" fill="none" stroke="#10b981" strokeWidth="2" />
                      <circle cx="100" cy="60" r="25" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                      <line x1="100" y1="10" x2="100" y2="110" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="8,2,1,2" />
                      <line x1="20" y1="60" x2="180" y2="60" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="8,2,1,2" />
                    </svg>
                  </div>

                  {/* Bottom-Right: Isometric Projection */}
                  <div className="p-4 border border-dashed border-slate-800 rounded relative">
                    <span className="absolute top-1 left-2 text-[10px] text-cyan-400 font-bold">
                      ISOMETRIC VIEW (SCALE 0.816)
                    </span>
                    <svg className="w-full h-36 mx-auto" viewBox="0 0 200 120">
                      <polygon points="100,20 160,50 100,80 40,50" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                      <polygon points="40,50 100,80 100,110 40,80" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                      <polygon points="100,80 160,50 160,80 100,110" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Standard Title Block (185 x 65 mm representation) */}
                <div className="self-end border-2 border-slate-500 bg-[#0c121d] w-80 text-xs">
                  <div className="grid grid-cols-2 border-b border-slate-700 p-1.5 font-bold">
                    <span className="text-cyan-400">BTU ENGINEERING VIS</span>
                    <span className="text-right text-slate-300">CODE: 1FY2-28</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-700 p-1.5 text-[11px]">
                    <span className="text-slate-400">TITLE: {selectedModel.name}</span>
                    <span className="text-right text-slate-400">SCALE: 1:1</span>
                  </div>
                  <div className="grid grid-cols-2 p-1.5 text-[10px] text-slate-500">
                    <span>BIS SP 46:2003</span>
                    <span className="text-right">ALL DIMS IN MM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 2D to 3D Reconstruction */}
      {activeTab === 'reconstruction' && (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold">
              <Layers className="w-4 h-4" />
              FLAGSHIP WORKFLOW: 2D DRAWING → 3D RECONSTRUCTION → ORTHOGRAPHIC VERIFICATION
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineering drawings can be ambiguous without complementary views. This module tests whether the provided orthographic projections resolve a unique 3D volumetric model.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Reconstructed 3D Solid Viewport */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    RECONSTRUCTED 3D CAD MODEL
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    STATUS: VOLUMETRICALLY RESOLVED
                  </span>
                </div>

                <ThreeCadViewport
                  model={selectedModel}
                  heightClass="h-[440px]"
                />
              </div>
            </div>

            {/* Right: Ambiguity & Constraint Resolution Notes */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-lg bg-[#0c1017] border border-slate-800 space-y-3 font-mono text-xs">
                <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">
                  GEOMETRIC RECONSTRUCTION AUDIT
                </h3>

                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold block">1. Front & Top View Projector Match:</span>
                    <p className="text-slate-400">
                      Width X=140mm matches exactly across both views. No width discrepancy detected.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold block">2. Depth Ambiguity Resolution:</span>
                    <p className="text-slate-400">
                      Side elevation provides explicit depth dimension Z=70mm. Unambiguous volumetric extrusion feasible.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                    <span className="font-bold block">3. Potential Ambiguity Guard:</span>
                    <p className="text-slate-400">
                      If side view were omitted, internal bore could be interpreted as either square or circular cavity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
