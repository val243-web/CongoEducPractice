import React, { useState } from 'react';
import { LearningPlan } from '../types';

interface ScheduleViewProps {
  plan: LearningPlan;
  onToggleDayDone: (weekNumber: number, dayId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  plan,
  onToggleDayDone,
}) => {
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);

  const activeWeek = plan.weeklySchedule[activeWeekIndex] || plan.weeklySchedule[0];

  const handleOpenYouTubeSearch = (query: string) => {
    const encoded = encodeURIComponent(query);
    window.open(`https://www.youtube.com/results?search_query=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Bento Primary Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
              <i className="bx bx-calendar text-lg text-indigo-600"></i>
              <span>Emploi du Temps Adapté à Votre Disponibilité</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Planning d'Étude & Recherches YouTube
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Disponibilité configurée : <strong className="text-indigo-700">{plan.userAvailabilityNote || `${plan.totalHoursPerWeek}h / semaine`}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {plan.weeklySchedule.map((week, idx) => (
              <button
                key={week.weekNumber || idx}
                onClick={() => setActiveWeekIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeWeekIndex === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Semaine {week.weekNumber || idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Week Theme Banner */}
      {activeWeek && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between text-xs text-indigo-950 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center shrink-0">
              S{activeWeek.weekNumber}
            </span>
            <div>
              <span className="text-indigo-600 uppercase text-[10px] font-black block">Thème Hebdomadaire</span>
              <strong className="text-sm text-indigo-900 font-black">{activeWeek.theme}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Days Schedule Cards - Bento Cards */}
      <div className="space-y-4">
        {activeWeek?.days.map((day) => (
          <div
            key={day.id}
            className={`p-6 rounded-3xl border transition-all shadow-xs ${
              day.isDone
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-white border-slate-200 hover:border-indigo-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 border-l-4 border-indigo-600 pl-3">
                <button
                  type="button"
                  onClick={() => onToggleDayDone(activeWeek.weekNumber, day.id)}
                  className="text-indigo-600 hover:text-indigo-700 transition-colors shrink-0"
                  title={day.isDone ? 'Marquer comme non fait' : 'Marquer comme fait'}
                >
                  {day.isDone ? (
                    <i className="bx bxs-check-circle text-2xl text-emerald-600"></i>
                  ) : (
                    <i className="bx bx-circle text-2xl text-slate-400 hover:text-indigo-600"></i>
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">{day.dayName}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      <i className="bx bx-time text-indigo-600 text-sm"></i>
                      {day.timeSlot}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-indigo-600 mt-0.5">
                    {day.topic}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => handleOpenYouTubeSearch(day.youtubeQuery)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all hover:scale-[1.02] shrink-0"
              >
                <i className="bx bxl-youtube text-lg"></i>
                <span>Chercher sur YouTube</span>
                <i className="bx bx-external-link text-sm"></i>
              </button>
            </div>

            {/* Practical Activity & Youtube Query Details */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Activity Description */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-extrabold text-slate-800 block mb-1">
                  🎯 Consigne d'entraînement du jour :
                </span>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {day.activityDescription}
                </p>
              </div>

              {/* Targeted Youtube Query */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="font-extrabold text-slate-800 block mb-1 flex items-center gap-1">
                    <i className="bx bx-tv text-red-500 text-base"></i>
                    <span>Mots-clés YouTube suggérés par Gemma :</span>
                  </span>
                  <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-indigo-700 text-xs mt-1">
                    "{day.youtubeQuery}"
                  </div>
                </div>

                {day.keyChannelIdeas && day.keyChannelIdeas.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-semibold">
                    💡 Types de chaînes : <span className="text-slate-800 font-bold">{day.keyChannelIdeas.join(', ')}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

