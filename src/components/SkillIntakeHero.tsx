import React, { useState } from 'react';
import { SkillLevel } from '../types';
import { PREMADE_PLANS } from '../data/premadePlans';

interface SkillIntakeHeroProps {
  onSubmitSkill: (skillName: string, level: SkillLevel, hoursPerWeek: string, availabilityNote: string) => void;
  isLoading: boolean;
  onSelectPremade: (planId: string) => void;
}

const SAMPLE_SUGGESTIONS = [
  { name: 'Menuiserie & Mobilier Bois', tag: 'Artisanat', icon: 'bx-cut' },
  { name: 'Guitare Acoustique Débutant', tag: 'Musique', icon: 'bx-music' },
  { name: 'Développement Web React & Node', tag: 'Informatique', icon: 'bx-code-alt' },
  { name: 'Pâtisserie & Viennoiserie', tag: 'Cuisine', icon: 'bx-cake' },
  { name: 'Électricité & Entretien Maison', tag: 'Bricolage', icon: 'bx-bulb' },
  { name: 'Photographie Numérique', tag: 'Art Visuel', icon: 'bx-camera' },
  { name: 'Entretien & Réparation Vélo', tag: 'Mécanique', icon: 'bx-cycling' },
  { name: 'Couture & Création Vêtements', tag: 'Mode', icon: 'bx-closet' },
];

export const SkillIntakeHero: React.FC<SkillIntakeHeroProps> = ({
  onSubmitSkill,
  isLoading,
  onSelectPremade,
}) => {
  const [skillInput, setSkillInput] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>('debutant');
  const [hoursPerWeek, setHoursPerWeek] = useState('5');
  const [availabilityNote, setAvailabilityNote] = useState('1h par jour en semaine + weekends');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    onSubmitSkill(skillInput.trim(), selectedLevel, hoursPerWeek, availabilityNote);
  };

  const handleSuggestionClick = (name: string) => {
    setSkillInput(name);
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 text-slate-900 py-10 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 shadow-xs">
          <i className="bx bx-atom text-indigo-600 text-sm animate-spin"></i>
          <span>CongoPraticEduc • Plateforme de Formation Pratique par Gemma 4 IA</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Quelle <span className="text-indigo-600">compétence pratique</span> souhaitez-vous apprendre ?
        </h1>
        
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
          Entrez un métier ou un savoir-faire. Notre tuteur <strong>Gemma 4</strong> prépare votre <strong>feuille de route</strong>, la liste exacte du <strong>matériel nécessaire</strong>, votre <strong>emploi du temps YouTube</strong> et vos <strong>quiz pratiques & code</strong>.
        </p>

        {/* Main Input Form Card */}
        <form 
          onSubmit={handleSubmit}
          className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-left"
        >
          {/* Skill Name Field */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-indigo-700 mb-2">
              1. Entrez le métier ou la compétence pratique :
            </label>
            <div className="relative">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Ex: Développement Web React, Menuiserie Bois, Couture, Électricité, Guitare..."
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm sm:text-base transition-all"
              />
              <i className="bx bx-wrench text-xl text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Skill Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Niveau initial :
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as SkillLevel)}
                className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold focus:border-indigo-600 outline-none"
              >
                <option value="debutant">🌱 Débutant complet</option>
                <option value="intermediaire">🌿 Intermédiaire (quelques bases)</option>
                <option value="avance">🌳 Avancé (perfectionnement)</option>
              </select>
            </div>

            {/* Hours Per Week */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <i className="bx bx-time text-indigo-600"></i>
                <span>Heures par semaine :</span>
              </label>
              <select
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold focus:border-indigo-600 outline-none"
              >
                <option value="2-3">2 à 3 heures (Rythme léger)</option>
                <option value="5">5 heures (Rythme régulier)</option>
                <option value="8-10">8 à 10 heures (Intensif)</option>
                <option value="15+">15+ heures (Immersion)</option>
              </select>
            </div>

            {/* Daily availability details */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Emploi du temps souhaité :
              </label>
              <input
                type="text"
                value={availabilityNote}
                onChange={(e) => setAvailabilityNote(e.target.value)}
                placeholder="Ex: Soirs à 20h, Weekend..."
                className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold focus:border-indigo-600 outline-none placeholder-slate-400"
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
              <i className="bx bx-check-shield text-emerald-600 text-base shrink-0"></i>
              <span>Génération de feuille de route + Matériels + YouTube + Quiz Gemma 4</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !skillInput.trim()}
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <i className="bx bx-loader-alt animate-spin text-lg"></i>
                  <span>Gemma 4 génère votre parcours...</span>
                </>
              ) : (
                <>
                  <i className="bx bx-rocket text-lg"></i>
                  <span>Générer ma Formation</span>
                  <i className="bx bx-right-arrow-alt text-xl"></i>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-8 text-left">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <i className="bx bx-trending-up text-indigo-600 text-base"></i>
            <span>Suggestions de compétences à apprendre :</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SUGGESTIONS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleSuggestionClick(item.name)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-indigo-50/80 text-slate-800 border border-slate-200 text-xs font-bold transition-colors hover:border-indigo-300 shadow-2xs"
              >
                <i className={`bx ${item.icon} text-indigo-600 text-sm`}></i>
                <span>{item.name}</span>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-extrabold">
                  {item.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery of Featured Premade Courses with Images */}
        <div className="mt-12 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <i className="bx bx-grid-alt text-indigo-600 text-2xl"></i>
                <span>Galerie des Formations Exemples</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Découvrez nos programmes complets pré-configurés avec photos, tutoriels YouTube et quiz d'évaluation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PREMADE_PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => onSelectPremade(plan.id)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-indigo-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Cover */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={plan.imageUrl}
                      alt={plan.skillName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-slate-800 shadow-xs border border-white/50 flex items-center gap-1">
                      <i className="bx bx-time text-indigo-600"></i>
                      <span>{plan.totalEstimatedWeeks} sem. ({plan.totalHoursPerWeek}h/sem)</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                      {plan.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {plan.skillName}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {plan.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 flex items-center gap-1">
                    <i className="bx bx-layer text-indigo-600"></i>
                    {plan.phases.length} Phases • {plan.materials.length} Matériels
                  </span>
                  <span className="font-extrabold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explorer <i className="bx bx-right-arrow-alt text-base"></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

