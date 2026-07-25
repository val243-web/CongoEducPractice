import React from 'react';
import { LearningPlan } from '../types';

interface NavbarProps {
  currentPlan: LearningPlan | null;
  savedPlans: LearningPlan[];
  onSelectPlan: (plan: LearningPlan) => void;
  onNewPlanClick: () => void;
  onOpenSavedModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPlan,
  savedPlans,
  onSelectPlan,
  onNewPlanClick,
  onOpenSavedModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={onNewPlanClick}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
            <i className="bx bx-wrench text-2xl text-white"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 font-extrabold text-lg text-slate-900 tracking-tight">
              <span>Congo<span className="text-indigo-600">PraticEduc</span></span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <i className="bx bx-chip text-xs"></i> Gemma 4 IA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-1 hidden sm:block font-medium">
              Formation Métiers & Pratique Autonome
            </p>
          </div>
        </div>

        {/* Current Active Plan or Selector */}
        <div className="flex items-center gap-3">
          {savedPlans.length > 0 && (
            <button
              onClick={onOpenSavedModal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-2xl transition-colors"
            >
              <i className="bx bx-bookmark-star text-base text-indigo-600"></i>
              <span className="hidden md:inline">Mes Formations ({savedPlans.length})</span>
            </button>
          )}

          {currentPlan && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-indigo-900 bg-indigo-50/80 px-3.5 py-2 rounded-2xl border border-indigo-100 font-bold">
              <i className="bx bx-book-reader text-base text-indigo-600"></i>
              <span className="max-w-[180px] truncate">
                {currentPlan.skillName}
              </span>
            </div>
          )}

          <button
            onClick={onNewPlanClick}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <i className="bx bx-plus-circle text-lg"></i>
            <span>Nouvelle Compétence</span>
          </button>
        </div>

      </div>
    </header>
  );
};

