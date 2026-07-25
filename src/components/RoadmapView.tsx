import React from 'react';
import { LearningPlan, RoadmapPhase, RoadmapStep } from '../types';

interface RoadmapViewProps {
  plan: LearningPlan;
  onToggleStep: (phaseId: string, stepId: string) => void;
  onOpenQuiz: (phase: RoadmapPhase) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  plan,
  onToggleStep,
  onOpenQuiz,
}) => {
  const [expandedPhases, setExpandedPhases] = React.useState<Record<string, boolean>>({
    [plan.phases[0]?.id || '']: true,
  });

  const togglePhaseExpand = (phaseId: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  // Compute total progress
  let totalStepsCount = 0;
  let completedStepsCount = 0;

  plan.phases.forEach((p) => {
    p.steps.forEach((s) => {
      totalStepsCount++;
      if (s.isCompleted) completedStepsCount++;
    });
  });

  const progressPercent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Progress Header Card - Bento Primary Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
              <i className="bx bx-map-alt text-lg text-indigo-600"></i>
              <span>Feuille de Route Pédagogique Gemma 4</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {plan.skillName}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Durée totale estimée : <strong className="text-slate-800">{plan.totalEstimatedWeeks} semaines</strong> ({plan.totalHoursPerWeek}h/semaine)
            </p>
          </div>

          <div className="bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100 flex items-center gap-4 shrink-0">
            <div>
              <div className="text-xs text-indigo-700 font-bold">Progression globale</div>
              <div className="text-xl font-black text-indigo-900">{progressPercent}% accompli</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-900 relative">
              <svg className="w-12 h-12 absolute -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-indigo-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-600 transition-all duration-500"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="font-black text-[11px]">{completedStepsCount}/{totalStepsCount}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100 leading-relaxed font-medium italic">
          "{plan.summary}"
        </p>
      </div>

      {/* Phased Roadmap Timeline */}
      <div className="space-y-4">
        {plan.phases.map((phase, pIdx) => {
          const isExpanded = expandedPhases[phase.id] ?? (pIdx === 0);
          const phaseCompletedSteps = phase.steps.filter((s) => s.isCompleted).length;
          const phaseIsDone = phase.steps.length > 0 && phaseCompletedSteps === phase.steps.length;

          return (
            <div
              key={phase.id}
              className={`bg-white border rounded-3xl transition-all overflow-hidden shadow-xs ${
                phaseIsDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-indigo-200'
              }`}
            >
              {/* Phase Header */}
              <div
                onClick={() => togglePhaseExpand(phase.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 shadow-2xs ${
                      phaseIsDone
                        ? 'bg-emerald-600 text-white font-extrabold'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {phaseIsDone ? <i className="bx bx-check text-xl"></i> : phase.phaseNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                        Phase {phase.phaseNumber} ({phase.durationWeeks} semaine{phase.durationWeeks > 1 ? 's' : ''})
                      </span>
                      {phaseIsDone && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                          Phase Terminée !
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {phase.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                    {phaseCompletedSteps}/{phase.steps.length} étapes
                  </span>
                  {isExpanded ? (
                    <i className="bx bx-chevron-up text-2xl text-slate-400"></i>
                  ) : (
                    <i className="bx bx-chevron-down text-2xl text-slate-400"></i>
                  )}
                </div>
              </div>

              {/* Phase Content */}
              {isExpanded && (
                <div className="p-5 pt-3 border-t border-slate-100 space-y-4">
                  {/* Objective */}
                  {phase.objective && (
                    <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5 font-medium">
                      <i className="bx bx-target-lock text-lg text-indigo-600 shrink-0 mt-0.5"></i>
                      <div>
                        <strong className="text-indigo-900 font-black">Objectif de la phase : </strong>
                        <span>{phase.objective}</span>
                      </div>
                    </div>
                  )}

                  {/* Steps List */}
                  <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-indigo-200">
                    {phase.steps.map((step) => (
                      <div
                        key={step.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          step.isCompleted
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-600'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => onToggleStep(phase.id, step.id)}
                            className="mt-0.5 text-indigo-600 hover:text-indigo-700 transition-colors shrink-0"
                            title={step.isCompleted ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
                          >
                            {step.isCompleted ? (
                              <i className="bx bxs-check-circle text-2xl text-emerald-600"></i>
                            ) : (
                              <i className="bx bx-circle text-2xl text-slate-400 hover:text-indigo-600"></i>
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h4
                                className={`text-sm font-extrabold ${
                                  step.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                                }`}
                              >
                                {step.title}
                              </h4>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                                <i className="bx bx-time text-indigo-600 text-sm"></i>
                                <span>~{step.estimatedHours}h estimées</span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                              {step.description}
                            </p>

                            {step.outputDeliverable && (
                              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-[11px] text-indigo-900 font-black shadow-2xs">
                                <i className="bx bx-briefcase text-indigo-600 text-sm"></i>
                                <span>Livrable pratique :</span>
                                <span className="text-slate-700 font-bold">{step.outputDeliverable}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Phase Quiz Button */}
                  {phase.quiz && phase.quiz.length > 0 && (
                    <div className="pt-3 flex justify-end">
                      <button
                        onClick={() => onOpenQuiz(phase)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xs transition-all hover:scale-[1.02]"
                      >
                        <i className="bx bx-help-circle text-lg"></i>
                        <span>Quiz de validation (4 questions + IDE) - Phase {phase.phaseNumber}</span>
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

