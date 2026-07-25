import React, { useState } from 'react';
import { RoadmapPhase, QuizQuestion } from '../types';

interface QuizModalProps {
  phase: RoadmapPhase;
  skillName?: string;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ phase, skillName = 'Compétence', onClose }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(phase.quiz || []);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // States for Code Questions
  const [userCodes, setUserCodes] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    (phase.quiz || []).forEach((q, idx) => {
      if (q.type === 'code' && q.initialCode) {
        initial[idx] = q.initialCode;
      }
    });
    return initial;
  });

  const [codeEvaluations, setCodeEvaluations] = useState<Record<number, {
    passed: boolean;
    simulatedOutput?: string;
    feedback?: string;
    isLoading?: boolean;
  }>>({});

  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optIndex,
    }));
  };

  const handleRunCode = async (qIndex: number) => {
    const q = questions[qIndex];
    const code = userCodes[qIndex] || '';

    setCodeEvaluations((prev) => ({
      ...prev,
      [qIndex]: { passed: false, isLoading: true, feedback: 'Évaluation par le compilateur Gemma 4...' },
    }));

    try {
      const res = await fetch('/api/evaluate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillName,
          questionText: q.questionText,
          userCode: code,
        }),
      });

      const data = await res.json();
      if (res.ok && data.evaluation) {
        setCodeEvaluations((prev) => ({
          ...prev,
          [qIndex]: {
            passed: !!data.evaluation.passed,
            simulatedOutput: data.evaluation.simulatedOutput,
            feedback: data.evaluation.feedback,
            isLoading: false,
          },
        }));
        if (data.evaluation.passed) {
          setSelectedAnswers((prev) => ({ ...prev, [qIndex]: q.correctOptionIndex }));
        }
      } else {
        setCodeEvaluations((prev) => ({
          ...prev,
          [qIndex]: { passed: false, feedback: 'Erreur lors de l\'évaluation du code.', isLoading: false },
        }));
      }
    } catch (err: any) {
      setCodeEvaluations((prev) => ({
        ...prev,
        [qIndex]: { passed: false, feedback: 'Erreur serveur: ' + err.message, isLoading: false },
      }));
    }
  };

  const handleRegenerateQuestion = async (qIndex: number) => {
    const targetQuestion = questions[qIndex];
    setRegeneratingIndex(qIndex);

    try {
      const res = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillName,
          phaseTitle: phase.title,
          failedQuestionText: targetQuestion.questionText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.question) {
        setQuestions((prev) => {
          const next = [...prev];
          next[qIndex] = data.question;
          return next;
        });

        // Reset user choice for this question
        setSelectedAnswers((prev) => {
          const next = { ...prev };
          delete next[qIndex];
          return next;
        });

        if (data.question.type === 'code') {
          setUserCodes((prev) => ({ ...prev, [qIndex]: data.question.initialCode || '// Nouveau code' }));
          setCodeEvaluations((prev) => {
            const next = { ...prev };
            delete next[qIndex];
            return next;
          });
        }
      }
    } catch (err) {
      console.error('Erreur régénération question:', err);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  let correctCount = 0;
  if (isSubmitted) {
    questions.forEach((q, idx) => {
      if (q.type === 'code') {
        if (codeEvaluations[idx]?.passed) correctCount++;
      } else if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-slate-900 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-2xl hover:bg-slate-100 transition-colors"
        >
          <i className="bx bx-x text-2xl"></i>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-2xl">
            <i className="bx bx-award"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Quiz & Évaluation Pratique - Phase {phase.phaseNumber}
              </h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {questions.length} Questions
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">
              {phase.title} • {skillName}
            </p>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const userChoice = selectedAnswers[qIdx];
            const isMcqWrong = isSubmitted && q.type !== 'code' && userChoice !== undefined && userChoice !== q.correctOptionIndex;
            const isCodeFailed = isSubmitted && q.type === 'code' && codeEvaluations[qIdx] && !codeEvaluations[qIdx].passed;
            const hasFailed = isMcqWrong || isCodeFailed;

            return (
              <div key={q.id || qIdx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-2xs">
                
                {/* Question Header */}
                <div className="font-extrabold text-sm sm:text-base text-slate-900 mb-3 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-xs">
                    {qIdx + 1}
                  </span>
                  <div className="flex-1">
                    <span>{q.questionText}</span>
                    {q.type === 'code' && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        <i className="bx bx-code-alt text-xs"></i> Exercice Pratique de Code
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Type: Code / IDE */}
                {q.type === 'code' ? (
                  <div className="mt-3 space-y-3">
                    {q.codeInstructions && (
                      <div className="text-xs bg-indigo-50/80 text-indigo-900 p-3 rounded-xl border border-indigo-100 font-semibold">
                        <i className="bx bx-info-circle text-indigo-600 mr-1.5"></i>
                        {q.codeInstructions}
                      </div>
                    )}

                    {/* Integrated IDE Component */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 text-slate-100 shadow-inner">
                      {/* IDE Header */}
                      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                          <span className="ml-2 font-mono text-[11px] text-slate-300">script.js • IDE CongoPraticEduc</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRunCode(qIdx)}
                          disabled={codeEvaluations[qIdx]?.isLoading}
                          className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          {codeEvaluations[qIdx]?.isLoading ? (
                            <>
                              <i className="bx bx-loader-alt animate-spin"></i>
                              <span>Analyse...</span>
                            </>
                          ) : (
                            <>
                              <i className="bx bx-play text-base"></i>
                              <span>Exécuter & Tester</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code Editor Area */}
                      <textarea
                        value={userCodes[qIdx] || ''}
                        onChange={(e) => setUserCodes((prev) => ({ ...prev, [qIdx]: e.target.value }))}
                        rows={6}
                        placeholder="// Écrivez ou complétez votre code ici..."
                        className="w-full p-4 bg-slate-950 font-mono text-xs sm:text-sm text-emerald-400 focus:outline-none resize-y leading-relaxed"
                      />

                      {/* Console / Output Window */}
                      {codeEvaluations[qIdx] && (
                        <div className="bg-slate-900 p-3 border-t border-slate-800 text-xs font-mono">
                          <div className="text-slate-400 font-bold mb-1 flex items-center gap-1">
                            <i className="bx bx-terminal text-emerald-400"></i>
                            <span>Sortie Console & Feedback Gemma :</span>
                          </div>
                          {codeEvaluations[qIdx].simulatedOutput && (
                            <div className="p-2 rounded bg-black/60 text-slate-300 text-[11px] mb-2 font-mono">
                              {codeEvaluations[qIdx].simulatedOutput}
                            </div>
                          )}
                          <div className={`p-2.5 rounded-xl text-xs font-semibold ${codeEvaluations[qIdx].passed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                            {codeEvaluations[qIdx].feedback}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Standard MCQ options */
                  <div className="space-y-2 mt-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userChoice === optIdx;
                      let buttonStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100 font-semibold';

                      if (isSubmitted) {
                        if (optIdx === q.correctOptionIndex) {
                          buttonStyle = 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold shadow-xs';
                        } else if (isSelected) {
                          buttonStyle = 'bg-rose-50 text-rose-950 border-rose-300 font-bold';
                        }
                      } else if (isSelected) {
                        buttonStyle = 'bg-indigo-50 text-indigo-950 border-indigo-400 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm border transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && optIdx === q.correctOptionIndex && (
                            <i className="bx bx-check-circle text-lg text-emerald-600 shrink-0"></i>
                          )}
                          {isSubmitted && isSelected && optIdx !== q.correctOptionIndex && (
                            <i className="bx bx-x-circle text-lg text-rose-600 shrink-0"></i>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Explanation */}
                {isSubmitted && (
                  <div className="mt-3 text-xs text-indigo-950 bg-indigo-50/90 p-3.5 rounded-2xl border border-indigo-100 font-medium">
                    <strong className="text-indigo-700 font-bold">💡 Explication de Gemma 4 :</strong> {q.explanation}
                  </div>
                )}

                {/* Dynamic Question Regenerator on Failure */}
                {isSubmitted && hasFailed && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="text-amber-900 font-bold flex items-center gap-1.5">
                      <i className="bx bx-refresh text-amber-600 text-lg"></i>
                      <span>Vous avez échoué à cette question. Gemma 4 peut la remplacer par une nouvelle question !</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRegenerateQuestion(qIdx)}
                      disabled={regeneratingIndex === qIdx}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1"
                    >
                      {regeneratingIndex === qIdx ? (
                        <>
                          <i className="bx bx-loader-alt animate-spin"></i>
                          <span>Génération...</span>
                        </>
                      ) : (
                        <>
                          <i className="bx bx-repost"></i>
                          <span>Changer de question</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Results Banner */}
        {isSubmitted && (
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600 font-bold">Résultat de la phase :</span>
              <div className="text-base font-black text-indigo-950">
                {correctCount} / {questions.length} questions réussies
              </div>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-extrabold rounded-2xl text-xs transition-colors border border-slate-200 shadow-xs"
            >
              <i className="bx bx-reset text-base"></i>
              <span>Recommencer le Quiz</span>
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-sm hover:scale-[1.02] transition-all"
            >
              Valider mes réponses
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl transition-all"
            >
              Fermer l'Évaluation
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

