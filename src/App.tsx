import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ShoppingBag, 
  Calendar, 
  Youtube, 
  Bot, 
  Sparkles, 
  Plus, 
  Award,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { LearningPlan, SkillLevel, IntakeQuestion, RoadmapPhase } from './types';
import { PREMADE_PLANS } from './data/premadePlans';
import { Navbar } from './components/Navbar';
import { SkillIntakeHero } from './components/SkillIntakeHero';
import { DiagnosticModal } from './components/DiagnosticModal';
import { RoadmapView } from './components/RoadmapView';
import { MaterialsView } from './components/MaterialsView';
import { ScheduleView } from './components/ScheduleView';
import { YouTubeGuideView } from './components/YouTubeGuideView';
import { GemmaTutorChat } from './components/GemmaTutorChat';
import { QuizModal } from './components/QuizModal';
import { SavedPlansModal } from './components/SavedPlansModal';

type ActiveTab = 'roadmap' | 'materials' | 'schedule' | 'youtube' | 'tutor';

export default function App() {
  // Saved plans state
  const [savedPlans, setSavedPlans] = useState<LearningPlan[]>(() => {
    try {
      const stored = localStorage.getItem('gemmalearn_plans_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return PREMADE_PLANS;
  });

  const [activePlanId, setActivePlanId] = useState<string | null>(() => {
    return savedPlans[0]?.id || null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('roadmap');

  // Intake & Diagnostic states
  const [pendingSkillName, setPendingSkillName] = useState('');
  const [pendingLevel, setPendingLevel] = useState<SkillLevel>('debutant');
  const [pendingHours, setPendingHours] = useState('5');
  const [pendingAvailability, setPendingAvailability] = useState('');
  
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<IntakeQuestion[]>([]);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  
  const [isLoadingDiagnostic, setIsLoadingDiagnostic] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  // Modal states
  const [quizPhase, setQuizPhase] = useState<RoadmapPhase | null>(null);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('gemmalearn_plans_v1', JSON.stringify(savedPlans));
    } catch (e) {
      console.error('Erreur sauvegarde localStorage:', e);
    }
  }, [savedPlans]);

  const currentPlan = savedPlans.find((p) => p.id === activePlanId) || null;

  // 1. Submit initial skill -> Fetch diagnostic questions from Gemma 4
  const handleStartSkillIntake = async (
    skillName: string, 
    level: SkillLevel, 
    hoursPerWeek: string, 
    availabilityNote: string
  ) => {
    setPendingSkillName(skillName);
    setPendingLevel(level);
    setPendingHours(hoursPerWeek);
    setPendingAvailability(availabilityNote);

    setIsLoadingDiagnostic(true);

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du diagnostic.');

      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setDiagnosticQuestions(data.questions);
        setShowDiagnosticModal(true);
      } else {
        // Direct plan generation fallback
        handleGeneratePlan({});
      }
    } catch (err) {
      console.error(err);
      // Fallback: generate plan directly
      handleGeneratePlan({});
    } finally {
      setIsLoadingDiagnostic(false);
    }
  };

  // 2. Generate full plan from Gemma
  const handleGeneratePlan = async (diagnosticAnswers: Record<string, string>) => {
    setShowDiagnosticModal(false);
    setIsLoadingPlan(true);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillName: pendingSkillName,
          level: pendingLevel,
          answers: diagnosticAnswers,
          availability: `${pendingHours}h/semaine - ${pendingAvailability}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la génération du plan.');

      const newPlan: LearningPlan = data.plan;

      setSavedPlans((prev) => [newPlan, ...prev]);
      setActivePlanId(newPlan.id);
      setActiveTab('roadmap');
    } catch (err: any) {
      console.error(err);
      alert(`Erreur de génération : ${err.message || 'Vérifiez votre connexion et réessayez.'}`);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Update step completion
  const handleToggleStep = (phaseId: string, stepId: string) => {
    if (!currentPlan) return;

    setSavedPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id !== currentPlan.id) return plan;

        const updatedPhases = plan.phases.map((phase) => {
          if (phase.id !== phaseId) return phase;

          const updatedSteps = phase.steps.map((step) => {
            if (step.id !== stepId) return step;
            return { ...step, isCompleted: !step.isCompleted };
          });

          return { ...phase, steps: updatedSteps };
        });

        return { ...plan, phases: updatedPhases };
      })
    );
  };

  // Update material acquired
  const handleToggleAcquiredMaterial = (materialId: string) => {
    if (!currentPlan) return;

    setSavedPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id !== currentPlan.id) return plan;

        const updatedMaterials = plan.materials.map((m) => {
          if (m.id !== materialId) return m;
          return { ...m, isAcquired: !m.isAcquired };
        });

        return { ...plan, materials: updatedMaterials };
      })
    );
  };

  // Update schedule day completion
  const handleToggleDayDone = (weekNumber: number, dayId: string) => {
    if (!currentPlan) return;

    setSavedPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id !== currentPlan.id) return plan;

        const updatedSchedule = plan.weeklySchedule.map((week) => {
          if (week.weekNumber !== weekNumber) return week;

          const updatedDays = week.days.map((day) => {
            if (day.id !== dayId) return day;
            return { ...day, isDone: !day.isDone };
          });

          return { ...week, days: updatedDays };
        });

        return { ...plan, weeklySchedule: updatedSchedule };
      })
    );
  };

  // Delete plan
  const handleDeletePlan = (planId: string) => {
    setSavedPlans((prev) => {
      const filtered = prev.filter((p) => p.id !== planId);
      if (activePlanId === planId) {
        setActivePlanId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Navbar */}
      <Navbar
        currentPlan={currentPlan}
        savedPlans={savedPlans}
        onSelectPlan={(p) => setActivePlanId(p.id)}
        onNewPlanClick={() => setActivePlanId(null)}
        onOpenSavedModal={() => setShowSavedModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Loading Indicator for Plan Generation */}
        {isLoadingPlan && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-12 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-indigo-50/50 animate-pulse pointer-events-none" />
            
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto mb-6 animate-bounce shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gemma 4 conçoit votre plan bento...
            </h2>

            <p className="text-sm text-slate-600 max-w-md mx-auto mt-3 leading-relaxed">
              Création de la feuille de route, sélection des matériels indispensables et génération de votre emploi du temps avec recherches YouTube.
            </p>

            <div className="mt-8 flex justify-center items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-ping" />
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping delay-150" />
              <div className="w-3 h-3 bg-indigo-300 rounded-full animate-ping delay-300" />
            </div>
          </div>
        )}

        {/* 1. If No Plan Active OR user clicked "New Plan" -> Show Skill Intake Hero */}
        {!isLoadingPlan && !currentPlan && (
          <SkillIntakeHero
            onSubmitSkill={handleStartSkillIntake}
            isLoading={isLoadingDiagnostic}
            onSelectPremade={(planId) => {
              setActivePlanId(planId);
              setActiveTab('roadmap');
            }}
          />
        )}

        {/* 2. If Plan Active -> Show Dashboard with Navigation Tabs */}
        {!isLoadingPlan && currentPlan && (
          <div className="space-y-6">
            
            {/* Dashboard Tabs Bar */}
            <div className="bg-white border border-slate-200 p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-sm">
              
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'roadmap'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <i className="bx bx-map-alt text-base"></i>
                <span>1. Feuille de Route</span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'materials'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <i className="bx bx-wrench text-base"></i>
                <span>2. Matériel Requis ({currentPlan.materials.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'schedule'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <i className="bx bx-calendar text-base"></i>
                <span>3. Emploi du Temps</span>
              </button>

              <button
                onClick={() => setActiveTab('youtube')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'youtube'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <i className="bx bxl-youtube text-base text-red-500"></i>
                <span>4. Guide YouTube</span>
              </button>

              <button
                onClick={() => setActiveTab('tutor')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ml-auto ${
                  activeTab === 'tutor'
                    ? 'bg-indigo-900 text-white shadow-md'
                    : 'bg-indigo-900/90 text-white hover:bg-indigo-900 border border-indigo-800'
                }`}
              >
                <i className="bx bx-bot text-base text-indigo-300"></i>
                <span>Tuteur IA Gemma 4</span>
              </button>

            </div>

            {/* Tab Views */}
            {activeTab === 'roadmap' && (
              <RoadmapView
                plan={currentPlan}
                onToggleStep={handleToggleStep}
                onOpenQuiz={(phase) => setQuizPhase(phase)}
              />
            )}

            {activeTab === 'materials' && (
              <MaterialsView
                materials={currentPlan.materials}
                onToggleAcquired={handleToggleAcquiredMaterial}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleView
                plan={currentPlan}
                onToggleDayDone={handleToggleDayDone}
              />
            )}

            {activeTab === 'youtube' && (
              <YouTubeGuideView
                resources={currentPlan.youtubeResources}
                skillName={currentPlan.skillName}
              />
            )}

            {activeTab === 'tutor' && (
              <GemmaTutorChat plan={currentPlan} />
            )}

          </div>
        )}

      </main>

      {/* Modals */}
      {showDiagnosticModal && (
        <DiagnosticModal
          skillName={pendingSkillName}
          questions={diagnosticQuestions}
          onConfirmAnswers={handleGeneratePlan}
          onSkipDiagnostic={() => handleGeneratePlan({})}
          isLoading={isLoadingPlan}
        />
      )}

      {quizPhase && (
        <QuizModal
          phase={quizPhase}
          skillName={currentPlan?.skillName}
          onClose={() => setQuizPhase(null)}
        />
      )}

      {showSavedModal && (
        <SavedPlansModal
          plans={savedPlans}
          activePlanId={activePlanId}
          onSelectPlan={(p) => setActivePlanId(p.id)}
          onDeletePlan={handleDeletePlan}
          onClose={() => setShowSavedModal(false)}
          onNewPlanClick={() => setActivePlanId(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              <i className="bx bx-wrench"></i>
            </div>
            <div>
              <div className="font-black text-slate-900 text-sm tracking-tight">
                Congo<span className="text-indigo-600">PraticEduc</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Plateforme d'Apprentissage des Métiers Pratiques & Code guidée par Gemma 4
              </p>
            </div>
          </div>

          <div className="text-center md:text-right text-slate-600 font-semibold space-y-1">
            <div className="flex items-center justify-center md:justify-end gap-1.5 text-slate-800 font-bold">
              <i className="bx bx-code-block text-indigo-600 text-base"></i>
              <span>Développé en collaboration avec <strong className="text-indigo-700 font-extrabold underline decoration-indigo-300">Valery IRAGI</strong></span>
            </div>
            <div className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} CongoPraticEduc • Propulsé par Gemma 4 & Google AI Studio
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
