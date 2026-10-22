/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Box,
  Layers,
  Scissors,
  FileText,
  BookOpen,
  HelpCircle,
  Search,
  Sparkles,
  Presentation,
  Cpu,
  LayoutDashboard,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Dashboard } from './components/dashboard/Dashboard';
import { LandingHero } from './components/home/LandingHero';
import { ProjectionLab } from './components/labs/ProjectionLab';
import { CadLab } from './components/labs/CadLab';
import { SectionLab } from './components/labs/SectionLab';
import { AssemblyLab } from './components/labs/AssemblyLab';
import { DrawingLab } from './components/labs/DrawingLab';
import { CourseSyllabus } from './components/course/CourseSyllabus';
import { QuestionBankView } from './components/questions/QuestionBankView';
import { TeacherMode } from './components/teacher/TeacherMode';
import { CaseStudiesView } from './components/casestudies/CaseStudiesView';
import { EngineeringTutorModal } from './components/ai/EngineeringTutorModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Auto-close sidebar on mobile view selection
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Check URL query parameters (e.g. ?autostart=1 or direct view navigation)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setCurrentView('dashboard');
    }
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home / Overview', icon: Home, category: 'main' },
    { id: 'dashboard', label: 'Workspace Dashboard', icon: LayoutDashboard, category: 'main' },
    { id: 'course-syllabus', label: 'BTU 1FY2-28 Syllabus', icon: BookOpen, category: 'course' },
    { id: 'projection-lab', label: 'Projection Lab', icon: Compass, category: 'labs' },
    { id: 'cad-lab', label: 'CAD 2D/3D Lab', icon: Box, category: 'labs' },
    { id: 'section-lab', label: 'Section Analysis Lab', icon: Scissors, category: 'labs' },
    { id: 'assembly-lab', label: 'Assembly Lab', icon: Layers, category: 'labs' },
    { id: 'drawing-lab', label: 'Drawing Lab & Analyzer', icon: FileText, category: 'labs' },
    { id: 'case-studies', label: 'Engineering Case Studies', icon: Cpu, category: 'case-studies' },
    { id: 'questions', label: 'Questions & PYQs', icon: HelpCircle, category: 'practice' },
    { id: 'teacher-mode', label: 'Teacher Mode', icon: Presentation, category: 'teacher' },
  ];

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Application Bar */}
      <header className="h-14 border-b border-slate-800 bg-[#0c1017]/95 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Toggle Navigation Sidebar"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded bg-gradient-to-br from-cyan-500 to-sky-700 flex items-center justify-center shadow-md font-mono font-bold text-xs text-black">
              EV
            </div>
            <div>
              <div className="font-mono font-bold text-sm tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                ENGINEERING VISION
                <span className="text-[10px] text-cyan-400 font-normal px-1 rounded bg-cyan-500/10 border border-cyan-500/30">
                  BTU 1FY2-28
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2">
          {/* Global Search Shortcut Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-400 hover:text-slate-200 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search modules, CAD &amp; PYQs...</span>
            <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
              Ctrl+K
            </kbd>
          </button>

          {/* AI Academic Tutor Trigger */}
          <button
            onClick={() => setIsTutorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/25 text-xs font-mono font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI TUTOR</span>
          </button>
        </div>
      </header>

      {/* Main Body Shell */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Navigation Sidebar */}
        {isSidebarOpen && (
          <aside className="fixed inset-y-14 left-0 z-40 lg:relative lg:inset-y-0 w-64 border-r border-slate-800 bg-[#0b0f17] flex flex-col justify-between shrink-0 overflow-y-auto shadow-2xl lg:shadow-none">
            <div className="p-3 space-y-6">
              {/* Main Workspace Navigation */}
              <div>
                <div className="px-3 mb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  WORKSPACE
                </div>
                <div className="space-y-0.5">
                  {navItems
                    .filter((item) => item.category === 'main')
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center justify-between transition-colors ${
                            isActive
                              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Course & Curriculum */}
              <div>
                <div className="px-3 mb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  BTU CURRICULUM
                </div>
                <div className="space-y-0.5">
                  {navItems
                    .filter((item) => item.category === 'course')
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center justify-between transition-colors ${
                            isActive
                              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* 3D Engineering Labs */}
              <div>
                <div className="px-3 mb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  3D LABORATORIES
                </div>
                <div className="space-y-0.5">
                  {navItems
                    .filter((item) => item.category === 'labs')
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center justify-between transition-colors ${
                            isActive
                              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Case Studies & Exams */}
              <div>
                <div className="px-3 mb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  PRACTICE &amp; TEACHING
                </div>
                <div className="space-y-0.5">
                  {navItems
                    .filter((item) => ['case-studies', 'practice', 'teacher'].includes(item.category))
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center justify-between transition-colors ${
                            isActive
                              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Sidebar Bottom Technical Details */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 font-mono text-[10px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>BTU CODE:</span>
                <span className="text-slate-400">1FY2-28</span>
              </div>
              <div className="flex justify-between">
                <span>STANDARD:</span>
                <span className="text-slate-400">BIS SP 46:2003</span>
              </div>
              <div className="flex justify-between text-cyan-400/80 pt-0.5">
                <span>GRAPHICS ENGINE:</span>
                <span>THREE.JS WEBGL</span>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'home' && (
              <LandingHero onEnterLab={() => setCurrentView('projection-lab')} />
            )}
            {currentView === 'dashboard' && (
              <Dashboard onNavigate={(v) => setCurrentView(v)} />
            )}
            {currentView === 'course-syllabus' && <CourseSyllabus />}
            {currentView === 'projection-lab' && <ProjectionLab />}
            {currentView === 'cad-lab' && <CadLab />}
            {currentView === 'section-lab' && <SectionLab />}
            {currentView === 'assembly-lab' && <AssemblyLab />}
            {currentView === 'drawing-lab' && <DrawingLab />}
            {currentView === 'case-studies' && <CaseStudiesView />}
            {currentView === 'questions' && <QuestionBankView />}
            {currentView === 'teacher-mode' && <TeacherMode />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <EngineeringTutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(v) => setCurrentView(v)}
      />
    </div>
  );
}
