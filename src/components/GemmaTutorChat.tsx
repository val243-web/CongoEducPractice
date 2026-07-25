import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LearningPlan } from '../types';

interface GemmaTutorChatProps {
  plan: LearningPlan;
}

export const GemmaTutorChat: React.FC<GemmaTutorChatProps> = ({ plan }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Bonjour ! Je suis votre tuteur IA Gemma 4 pour votre formation en **${plan.skillName}**. Posez-moi vos questions pratiques, demandez un schéma explicatif visuel ou des conseils sur les vidéos YouTube !`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [svgIllustration, setSvgIllustration] = useState<string | null>(null);
  const [isGeneratingSvg, setIsGeneratingSvg] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, svgIllustration]);

  const handleGenerateIllustration = async (conceptPrompt?: string) => {
    const prompt = conceptPrompt || input.trim() || plan.skillName;
    setIsGeneratingSvg(true);

    try {
      const res = await fetch('/api/generate-illustration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          skillName: plan.skillName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.svgContent) {
        setSvgIllustration(data.svgContent);
        setMessages((prev) => [
          ...prev,
          {
            id: 'svg-' + Date.now(),
            sender: 'assistant',
            text: `Voici un schéma technique explicatif généré par Gemma 4 pour "${prompt}" :`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSvg(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    // Check if user specifically requested a image/schema/diagram
    if (/schéma|dessin|illustration|diagramme|image|visuel/i.test(query)) {
      handleGenerateIllustration(query);
    }

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillName: plan.skillName,
          message: query,
          chatHistory: messages.slice(-6),
          planContext: {
            summary: plan.summary,
            level: plan.skillLevel,
            hoursPerWeek: plan.totalHoursPerWeek,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur lors de la réponse du tuteur.');

      const botMsg: ChatMessage = {
        id: 'a-' + Date.now(),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'assistant',
        text: "Désolé, j'ai rencontré une petite interruption. Pouvez-vous reformuler votre question ?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const SUGGESTED_PROMPTS = [
    `💡 Erreurs classiques à éviter en ${plan.skillName} ?`,
    `🎨 Génère-moi un schéma visuel explicatif`,
    `📺 Quelle première vidéo YouTube regarder ?`,
    `📅 Comment adapter mon emploi du temps si j'ai un imprévu ?`,
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 text-slate-900 shadow-xs flex flex-col h-[650px]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            <i className="bx bx-bot"></i>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>Tuteur IA Gemma 4</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> En ligne
              </span>
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Assistance & Schémas pour : <strong className="text-indigo-600">{plan.skillName}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleGenerateIllustration()}
          disabled={isGeneratingSvg}
          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-2xl border border-indigo-200 transition-colors flex items-center gap-1.5"
        >
          {isGeneratingSvg ? (
            <i className="bx bx-loader-alt animate-spin text-base"></i>
          ) : (
            <i className="bx bx-image-add text-base"></i>
          )}
          <span className="hidden sm:inline">Schéma Visuel</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isUser ? <i className="bx bx-user"></i> : <i className="bx bx-bot"></i>}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-xs'
                    : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-none font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 font-bold text-right ${
                    isUser ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* SVG Illustration Container */}
        {svgIllustration && (
          <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-800 my-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-300 mb-2 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <i className="bx bx-palette text-indigo-400 text-base"></i>
                Schéma Pédagogique Interactif Gemma 4
              </span>
              <button
                onClick={() => setSvgIllustration(null)}
                className="text-slate-400 hover:text-white"
              >
                <i className="bx bx-x text-lg"></i>
              </button>
            </div>
            <div
              className="w-full flex justify-center bg-slate-950 p-2 rounded-2xl overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: svgIllustration }}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <i className="bx bx-bot text-sm"></i>
            </div>
            <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2">
              <i className="bx bx-loader-alt animate-spin text-indigo-600 text-base"></i>
              <span>Gemma 4 formule votre explication...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="pt-2 pb-3 border-t border-slate-100">
        <div className="text-[11px] font-extrabold text-slate-500 mb-2 flex items-center gap-1">
          <i className="bx bx-bulb text-indigo-600 text-sm"></i>
          <span>Prompts suggérés :</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUGGESTED_PROMPTS.map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(promptText)}
              disabled={isLoading}
              className="shrink-0 px-3.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 text-xs rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors whitespace-nowrap font-bold"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-100"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question à Gemma 4..."
          disabled={isLoading}
          className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs sm:text-sm font-bold transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xs transition-all disabled:opacity-50 flex items-center justify-center shrink-0 hover:scale-[1.02]"
        >
          <i className="bx bx-send text-lg"></i>
        </button>
      </form>

    </div>
  );
};

