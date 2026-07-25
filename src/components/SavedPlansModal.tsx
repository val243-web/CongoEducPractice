import React from 'react';
import { LearningPlan } from '../types';

interface SavedPlansModalProps {
  plans: LearningPlan[];
  activePlanId: string | null;
  onSelectPlan: (plan: LearningPlan) => void;
  onDeletePlan: (planId: string) => void;
  onClose: () => void;
  onNewPlanClick: () => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  plans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onClose,
  onNewPlanClick,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 text-slate-900 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-2xl hover:bg-slate-100 transition-colors"
        >
          <i className="bx bx-x text-2xl"></i>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
            <i className="bx bx-bookmarks"></i>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Mes Formations Sauvegardées
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Basculez facilement d'un métier ou savoir-faire à un autre.
            </p>
          </div>
        </div>

        {/* Plans list */}
        <div className="space-y-3">
          {plans.map((plan) => {
            const isActive = plan.id === activePlanId;
            return (
              <div
                key={plan.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-indigo-50/80 border-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectPlan(plan);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{plan.skillName}</h4>
                    {isActive && (
                      <span className="text-[10px] bg-indigo-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                        En cours
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1 font-medium">
                    {plan.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold mt-2">
                    <span className="flex items-center gap-1">
                      <i className="bx bx-calendar text-indigo-600"></i> {plan.totalEstimatedWeeks} sem.
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="bx bx-time text-indigo-600"></i> {plan.totalHoursPerWeek}h/sem
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectPlan(plan);
                      onClose();
                    }}
                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50 rounded-xl transition-colors"
                    title="Ouvrir cette formation"
                  >
                    <i className="bx bx-right-arrow-alt text-xl"></i>
                  </button>

                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Supprimer la formation"
                  >
                    <i className="bx bx-trash text-lg"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              onNewPlanClick();
            }}
            className="text-xs text-indigo-600 font-extrabold hover:underline flex items-center gap-1"
          >
            <i className="bx bx-plus-circle text-base"></i>
            <span>Nouvelle compétence</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-2xl transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

