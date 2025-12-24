
import React, { useState, useMemo } from 'react';
import { Recommendation, AggregatedData } from '../types';

interface Props {
  recommendations: Recommendation[];
  isLoading: boolean;
  stats: AggregatedData | null;
}

type SortOption = 'priority' | 'category' | 'action';
type HorizonFilter = 'all' | 'weekly' | 'monthly';

const Recommendations: React.FC<Props> = ({ recommendations, isLoading, stats }) => {
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [horizonFilter, setHorizonFilter] = useState<HorizonFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedRecommendations = useMemo(() => {
    let filtered = recommendations.filter(rec => {
      const matchesSearch = rec.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHorizon = horizonFilter === 'all' || rec.horizon === horizonFilter;
      return matchesSearch && matchesHorizon;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityMap = { high: 0, medium: 1, low: 2 };
        return priorityMap[a.priority] - priorityMap[b.priority];
      }
      if (sortBy === 'category') return a.category.localeCompare(b.category, 'ar');
      if (sortBy === 'action') return a.action.localeCompare(b.action, 'ar');
      return 0;
    });
  }, [recommendations, sortBy, searchTerm, horizonFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <h3 className="text-xl font-black text-gray-800 mt-6">جاري تجهيز النصايح.. دقيقة واحدة</h3>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-12 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">كيف <br/><span className="text-indigo-400">تحسن شغل الدكان</span></h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-2xl">
            دي شوية اقتراحات عشان تزيد مبيعاتك وتنظم بضاعتك بناءً على حركة البيع الحاصلة في الأيام الفاتت.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[3rem] shadow-sm border border-gray-100">
         <div className="flex bg-slate-50 p-2 rounded-[2rem] w-full xl:w-auto">
            {['all', 'weekly', 'monthly'].map(id => (
              <button 
                key={id}
                onClick={() => setHorizonFilter(id as HorizonFilter)}
                className={`flex-1 xl:flex-none px-10 py-3 rounded-[1.5rem] font-black text-sm transition-all ${horizonFilter === id ? 'bg-white text-indigo-600 shadow-xl scale-105' : 'text-gray-400'}`}
              >
                {id === 'all' ? 'الكل' : id === 'weekly' ? 'حقت الأسبوع' : 'حقت الشهر'}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-4 w-full xl:w-auto">
            <input 
              type="text" 
              placeholder="فتش عن منتج.."
              className="w-full sm:w-64 pr-12 pl-6 py-4 bg-slate-50 rounded-[1.75rem] text-sm font-bold border-none outline-none focus:ring-4 focus:ring-indigo-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {sortedRecommendations.map((rec, index) => (
          <div key={index} className="group bg-white rounded-[3.5rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-700 flex flex-col overflow-hidden relative border-t-8 border-t-indigo-600">
            <div className="p-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${rec.horizon === 'weekly' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                  {rec.horizon === 'weekly' ? 'قريب' : 'بعيد شويه'}
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${rec.priority === 'high' ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                  {rec.priority === 'high' ? '⚠️ ضروري' : 'عادي'}
                </span>
              </div>
              
              <h4 className="text-2xl font-black text-gray-900 mb-6 leading-tight">{rec.product}</h4>
              
              {/* Decision Rational */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex-grow mb-6">
                <span className="text-[10px] font-black text-indigo-400 uppercase mb-2 block">ليه قلنا ليك كدا؟</span>
                <p className="text-gray-700 text-sm font-bold leading-relaxed">{rec.reason}</p>
              </div>

              {/* Impact Analysis Section */}
              <div className="bg-indigo-600 p-6 rounded-[2.5rem] shadow-lg shadow-indigo-100 group-hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-xl">💰</span>
                   <span className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">الفائدة حتكون شنو؟</span>
                </div>
                <p className="text-white text-sm font-black leading-relaxed">
                   {rec.expectedImpact}
                </p>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${rec.action === 'increase' ? 'bg-emerald-600' : rec.action === 'decrease' ? 'bg-rose-600' : 'bg-sky-600'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                   </div>
                   <span className="text-xs font-black text-gray-800 uppercase">
                     {rec.action === 'increase' ? 'زيد البضاعة' : rec.action === 'decrease' ? 'نقص البضاعة' : 'خلك مراقب'}
                   </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
