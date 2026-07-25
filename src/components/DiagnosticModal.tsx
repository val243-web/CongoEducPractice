import React, { useState } from 'react';
import { IntakeQuestion } from '../types';

interface DiagnosticModalProps {
  skillName: string;
  questions: IntakeQuestion[];
  onConfirmAnswers: (answers: Record<string, string>) => void;
  onSkipDiagnostic: () => void;
  isLoading: boolean;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  skillName,
  questions,
  onConfirmAnswers,
  onSkipDiagnostic,
  isLoading,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleSelectOption = (qId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmAnswers(selectedAnswers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close / Skip */}
        <button
          onClick={onSkipDiagnostic}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-2xl hover:bg-slate-100 transition-colors"
          title="Passer et générer directement"
        >
          <i className="bx bx-x text-2xl"></i>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
            <i className="bx bx-slider-alt"></i>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Affinage Pédagogique par Gemma 4
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Pour la compétence : <span className="text-indigo-600 font-bold">{skillName}</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">
          Pour adapter au mieux votre <strong>emploi du temps YouTube</strong> et votre <strong>liste d'équipements</strong>, répondez à ces questions de diagnostic :
        </p>

        {/* Questions List Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id || idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <label className="block text-sm font-extrabold text-slate-900 mb-3 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{q.questionText}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-7">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id || q.questionText] === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => handleSelectOption(q.id || q.questionText, opt)}
                      className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-900 border-indigo-300 shadow-2xs font-extrabold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <i className="bx bxs-check-circle text-lg text-indigo-600 shrink-0"></i>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onSkipDiagnostic}
              className="text-xs text-slate-500 hover:text-slate-900 underline font-semibold"
            >
              Passer cette étape (utiliser les réglages par défaut)
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <i className="bx bx-loader-alt animate-spin text-lg"></i>
                  <span>Génération du plan personnalisé...</span>
                </>
              ) : (
                <>
                  <i className="bx bx-check-shield text-lg"></i>
                  <span>Générer ma Feuille de Route & Emploi du Temps</span>
                  <i className="bx bx-right-arrow-alt text-lg"></i>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

