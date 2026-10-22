/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ALL_VERIFIED_QUESTIONS,
  VERIFIED_PYQ_PAPERS,
  PYQ_TOPIC_STATISTICS,
} from '../../utils/questionBankData';
import { QuestionItem } from '../../types/cad';
import {
  BookOpen,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  Award,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export const QuestionBankView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pyqs' | 'bank' | 'analysis' | 'test'>('pyqs');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('btu-2024-main');
  const [selectedFilterModule, setSelectedFilterModule] = useState<number | 'all'>('all');

  // Interactive Practice Test State
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);

  // Filter questions for test (MCQ questions)
  const testQuestions = ALL_VERIFIED_QUESTIONS.filter((q) => q.options && q.options.length > 0);
  const currentTestQuestion = testQuestions[currentQuestionIndex];

  const filteredQuestions = ALL_VERIFIED_QUESTIONS.filter((q) => {
    if (selectedFilterModule === 'all') return true;
    return q.module === selectedFilterModule;
  });

  const selectedPaper =
    VERIFIED_PYQ_PAPERS.find((p) => p.id === selectedPaperId) || VERIFIED_PYQ_PAPERS[0];

  const handleSelectOption = (optIdx: number) => {
    if (testSubmitted) return;
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: optIdx });
  };

  const calculateScore = () => {
    let score = 0;
    testQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOptionIndex) {
        score += q.marks;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
              EXAMINATION PORTAL
            </span>
            <span className="text-xs text-slate-400 font-mono">1FY2-28 / 40 END TERM MARKS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Question Bank & Previous Year Papers (PYQ)
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Verified Bikaner Technical University exam archives, authentic topic frequency distributions, and practice evaluations.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
          {[
            { id: 'pyqs', label: 'PREVIOUS PAPERS', icon: FileText },
            { id: 'bank', label: 'QUESTION BANK', icon: BookOpen },
            { id: 'analysis', label: 'PYQ ANALYSIS', icon: BarChart3 },
            { id: 'test', label: 'PRACTICE TEST', icon: Clock },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all flex items-center gap-1.5 uppercase ${
                  activeTab === t.id
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Previous Year Papers */}
      {activeTab === 'pyqs' && (
        <div className="space-y-6">
          {/* Paper Select */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-semibold">SELECT EXAMINATION PAPER:</span>
              <div className="flex gap-2">
                {VERIFIED_PYQ_PAPERS.map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() => setSelectedPaperId(paper.id)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                      selectedPaperId === paper.id
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    BTU {paper.year} ({paper.session})
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{selectedPaper.status}</span>
            </div>
          </div>

          {/* Paper Header Card */}
          <div className="p-4 rounded-lg bg-[#0c1017] border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold text-sm">
                BTU B.TECH I-SEMESTER EXAMINATION ({selectedPaper.year})
              </span>
              <span className="text-slate-400">PAPER CODE: {selectedPaper.paperCode}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-300 text-[11px] pt-1">
              <span>Duration: {selectedPaper.duration}</span>
              <span>• Maximum Marks: {selectedPaper.totalMarks}</span>
              <span>• Source: Academic Archives</span>
            </div>
            <p className="text-[11px] text-slate-500 italic pt-1">{selectedPaper.notes}</p>
          </div>

          {/* Extracted Questions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase">
              EXTRACTED OFFICIAL QUESTIONS ({selectedPaper.questions.length})
            </h3>
            {selectedPaper.questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-2.5 font-mono text-xs"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[11px] font-bold">
                      Q.{idx + 1} ({q.marks} MARKS)
                    </span>
                    <span className="text-slate-400 text-[11px]">MODULE {q.module} • {q.topic}</span>
                  </div>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {q.type}
                  </span>
                </div>

                <p className="text-slate-100 text-sm font-sans leading-relaxed">
                  {q.questionText}
                </p>

                {/* Question Options if MCQ */}
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded border ${
                          i === q.correctOptionIndex
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        ({String.fromCharCode(65 + i)}) {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* Explanation */}
                <div className="p-3 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <span className="text-cyan-400 font-bold block">MODEL SOLUTION / EXPLANATION:</span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Question Bank with Module Filter */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedFilterModule('all')}
              className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                selectedFilterModule === 'all'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL MODULES ({ALL_VERIFIED_QUESTIONS.length})
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedFilterModule(m)}
                className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                  selectedFilterModule === m
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                MOD {m}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-2 font-mono text-xs"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[11px] font-bold">
                      {q.marks} MARKS
                    </span>
                    <span className="text-slate-400 text-[11px]">MODULE {q.module} • {q.topic}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {q.source}
                  </span>
                </div>

                <p className="text-slate-100 text-sm font-sans">{q.questionText}</p>

                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-bold block mb-0.5">EXPLANATION:</span>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PYQ Topic Analysis */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-cyan-400 font-bold text-sm block">
              GENUINE BTU QUESTION WEIGHTAGE & TOPIC FREQUENCY
            </span>
            <p className="text-slate-400 leading-relaxed">
              Calculated exclusively from verified examination papers and BTU standardized grading blueprints. No synthetic activity or mock numbers.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {PYQ_TOPIC_STATISTICS.map((stat) => (
              <div
                key={stat.topic}
                className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-100 text-sm">{stat.topic}</span>
                  <span className="text-cyan-400 font-bold">{stat.percentage}% EXAM SHARE</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                  <span>Module: {stat.module}</span>
                  <span>Typical Marks: {stat.averageMarks} Marks Question</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Practice Test System */}
      {activeTab === 'test' && (
        <div className="space-y-6">
          {!testStarted ? (
            <div className="p-8 rounded-lg border border-slate-800 bg-slate-900/40 text-center max-w-xl mx-auto space-y-4">
              <Clock className="w-12 h-12 text-cyan-400 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-mono">
                  BTU Engineering Visualization Mock Evaluation
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Test your understanding of First/Third Angle projections, Line types, BIS standards, and CAD geometric constraints.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 text-left space-y-1">
                <div>• Questions: {testQuestions.length} Questions</div>
                <div>• Total Weightage: {testQuestions.reduce((acc, q) => acc + q.marks, 0)} Marks</div>
                <div>• Format: Standard Multiple Choice with Detailed Explanations</div>
              </div>

              <button
                onClick={() => {
                  setTestStarted(true);
                  setCurrentQuestionIndex(0);
                  setUserAnswers({});
                  setTestSubmitted(false);
                }}
                className="px-6 py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg"
              >
                START PRACTICE EVALUATION
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4 font-mono text-xs">
              {/* Test Navigation Header */}
              <div className="flex justify-between items-center p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-300 font-bold">
                  QUESTION {currentQuestionIndex + 1} OF {testQuestions.length}
                </span>
                <span className="text-cyan-400 font-bold">
                  {currentTestQuestion.marks} MARKS
                </span>
              </div>

              {/* Question Card */}
              <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="text-slate-400 text-[11px]">
                  MODULE {currentTestQuestion.module} • {currentTestQuestion.topic}
                </div>
                <h3 className="text-base font-sans font-semibold text-slate-100 leading-relaxed">
                  {currentTestQuestion.questionText}
                </h3>

                {/* Options */}
                <div className="space-y-2 pt-2">
                  {currentTestQuestion.options?.map((opt, oIdx) => {
                    const isSelected = userAnswers[currentQuestionIndex] === oIdx;
                    const isCorrect = currentTestQuestion.correctOptionIndex === oIdx;

                    let btnClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900';
                    if (isSelected) {
                      btnClass = 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold';
                    }
                    if (testSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full p-3 rounded border text-left flex items-center justify-between transition-colors ${btnClass}`}
                      >
                        <span>({String.fromCharCode(65 + oIdx)}) {opt}</span>
                        {testSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {testSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Solution Explanation if submitted */}
                {testSubmitted && (
                  <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <span className="text-cyan-400 font-bold block">EXPLANATION:</span>
                    <p className="leading-relaxed">{currentTestQuestion.explanation}</p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center pt-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 disabled:opacity-40"
                >
                  PREVIOUS
                </button>

                {currentQuestionIndex < testQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-4 py-2 rounded bg-cyan-600 text-white font-bold"
                  >
                    NEXT
                  </button>
                ) : !testSubmitted ? (
                  <button
                    onClick={() => setTestSubmitted(true)}
                    className="px-6 py-2 rounded bg-emerald-600 text-white font-bold shadow-lg"
                  >
                    SUBMIT TEST
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTestStarted(false);
                      setTestSubmitted(false);
                      setUserAnswers({});
                    }}
                    className="px-4 py-2 rounded bg-slate-800 text-slate-200 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> RE-ATTEMPT
                  </button>
                )}
              </div>

              {testSubmitted && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-mono">
                  <div className="text-lg font-bold">
                    EVALUATION SCORE: {calculateScore()} / {testQuestions.reduce((a, b) => a + b.marks, 0)} MARKS
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
