import React from 'react';
import { YouTubeResource } from '../types';

interface YouTubeGuideViewProps {
  resources: YouTubeResource[];
  skillName: string;
}

export const YouTubeGuideView: React.FC<YouTubeGuideViewProps> = ({
  resources,
  skillName,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleOpenYouTubeSearch = (query: string) => {
    const encoded = encodeURIComponent(query);
    window.open(`https://www.youtube.com/results?search_query=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyQuery = (id: string, query: string) => {
    navigator.clipboard.writeText(query);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Bento Primary Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600">
              <i className="bx bxl-youtube text-lg text-red-600"></i>
              <span>Guide de Recherche YouTube Cœur</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Recherches YouTube Ciblées pour {skillName}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Gemma 4 a sélectionné les requêtes de recherche les plus efficaces pour trouver directement des cours et tutoriels pertinents sans perdre de temps.
            </p>
          </div>

          <button
            onClick={() => handleOpenYouTubeSearch(`tuto ${skillName} débutant cours complet`)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 shrink-0 hover:scale-[1.02]"
          >
            <i className="bx bx-search text-base"></i>
            <span>Lancer la Recherche Globale</span>
          </button>
        </div>
      </div>

      {/* Resource Cards - Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((res) => (
          <div
            key={res.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-200 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                  <i className="bx bx-time text-indigo-600"></i> Durée conseillée : {res.recommendedDuration}
                </span>
                
                <button
                  onClick={() => handleCopyQuery(res.id, res.searchQuery)}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors font-bold"
                  title="Copier les mots-clés"
                >
                  {copiedId === res.id ? (
                    <>
                      <i className="bx bx-check text-emerald-600 text-base"></i>
                      <span className="text-emerald-600 font-extrabold">Copié !</span>
                    </>
                  ) : (
                    <>
                      <i className="bx bx-copy text-sm"></i>
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mt-3">
                {res.topicTitle}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                {res.targetContentDescription}
              </p>

              {/* Exact Search String Box */}
              <div className="mt-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Recherche YouTube exacte à lancer :
                </span>
                <div className="text-xs font-mono font-bold text-indigo-700 select-all">
                  "{res.searchQuery}"
                </div>
              </div>

              {/* Tag Keywords */}
              {res.suggestedKeywords && res.suggestedKeywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {res.suggestedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Launch Search Button */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleOpenYouTubeSearch(res.searchQuery)}
                className="w-full py-2.5 bg-slate-100 hover:bg-red-600 text-slate-800 hover:text-white font-extrabold text-xs rounded-2xl border border-slate-200 hover:border-red-600 transition-all flex items-center justify-center gap-2"
              >
                <i className="bx bx-play-circle text-base"></i>
                <span>Ouvrir les résultats sur YouTube</span>
                <i className="bx bx-external-link text-sm"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

