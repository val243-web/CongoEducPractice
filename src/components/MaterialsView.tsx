import React, { useState } from 'react';
import { MaterialItem } from '../types';

interface MaterialsViewProps {
  materials: MaterialItem[];
  onToggleAcquired: (materialId: string) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onToggleAcquired,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredMaterials = materials.filter((m) => {
    if (filterCategory === 'all') return true;
    return m.category.toLowerCase() === filterCategory.toLowerCase();
  });

  const acquiredCount = materials.filter((m) => m.isAcquired).length;
  const totalItems = materials.length;
  const progressPercent = totalItems > 0 ? Math.round((acquiredCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Bento Primary Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
              <i className="bx bx-wrench text-lg text-indigo-600"></i>
              <span>Équipement & Liste du Matériel Requis</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Outillage & Fournitures Requis
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Cochez les éléments que vous possédez déjà pour préparer votre atelier ou votre espace de travail.
            </p>
          </div>

          <div className="bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100 shrink-0 text-right">
            <div className="text-xs text-indigo-700 font-bold">Matériel prêt</div>
            <div className="text-xl font-black text-indigo-900">
              {acquiredCount} / {totalItems} <span className="text-xs font-bold text-indigo-700">({progressPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-extrabold mr-2 flex items-center gap-1">
            <i className="bx bx-filter text-indigo-600 text-base"></i>
            <span>Filtrer :</span>
          </span>
          {['all', 'Indispensable', 'Recommandé', 'Optionnel'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tout voir' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((item) => {
          const isEssential = item.category === 'Indispensable';
          const isRecommended = item.category === 'Recommandé';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between shadow-xs ${
                item.isAcquired
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-indigo-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        isEssential
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : isRecommended
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-2xl border border-slate-200 flex items-center gap-1">
                      <i className="bx bx-purchase-tag text-indigo-600"></i> {item.estimatedCost}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleAcquired(item.id)}
                    className="text-indigo-600 hover:text-indigo-700 transition-colors"
                    title={item.isAcquired ? 'Marquer comme non acquis' : 'Marquer comme acquis / en ma possession'}
                  >
                    {item.isAcquired ? (
                      <i className="bx bxs-check-circle text-2xl text-emerald-600"></i>
                    ) : (
                      <i className="bx bx-circle text-2xl text-slate-400 hover:text-indigo-600"></i>
                    )}
                  </button>
                </div>

                <h3 className={`text-base font-extrabold mt-3 ${item.isAcquired ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold text-[11px]">
                  {item.isAcquired ? '✓ En possession' : '🛒 À acquérir / fabriquer'}
                </span>

                <button
                  onClick={() => onToggleAcquired(item.id)}
                  className={`text-xs font-black px-3.5 py-1.5 rounded-2xl transition-colors ${
                    item.isAcquired
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  {item.isAcquired ? 'Annuler' : 'Marquer Possédé'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

