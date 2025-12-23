
import React, { useState, useMemo } from 'react';
import { Recommendation } from '../types';

interface Props {
  recommendations: Recommendation[];
  isLoading: boolean;
}

type SortOption = 'priority' | 'category' | 'action';

const Recommendations: React.FC<Props> = ({ recommendations, isLoading }) => {
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedRecommendations = useMemo(() => {
    let filtered = recommendations.filter(rec => 
      rec.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityMap = { high: 0, medium: 1, low: 2 };
        return priorityMap[a.priority] - priorityMap[b.priority];
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category, 'ar');
      }
      if (sortBy === 'action') {
        return a.action.localeCompare(b.action, 'ar');
      }
      return 0;
    });
  }, [recommendations, sortBy, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold">AI</div>
        </div>
        <p className="mt-6 text-gray-600 font-medium text-lg text-center max-w-xs leading-relaxed">
          نقوم الآن بتحليل المبيعات ومقارنة البيانات لتقديم أفضل النصائح لمشروعك...
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
        <div className="text-6xl mb-4 opacity-50">📋</div>
        <h3 className="text-xl font-bold text-gray-800">لا توجد توصيات متاحة</h3>
        <p className="text-gray-500 max-w-xs mx-auto mt-2">يرجى رفع ملف بيانات يحتوي على سجلات مبيعات كافية لتمكين الذكاء الاصطناعي من التحليل.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-indigo-600">✨</span>
            توصيات ذكية للمخزون
          </h2>
          <p className="text-sm text-gray-500 mt-1">بناءً على أداء المبيعات وسلوك المشترين</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input 
              type="text"
              placeholder="ابحث عن منتج أو فئة..."
              className="w-full md:w-64 pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm font-medium text-gray-700"
          >
            <option value="priority">فرز حسب: الأولوية</option>
            <option value="category">فرز حسب: الفئة</option>
            <option value="action">فرز حسب: الإجراء</option>
          </select>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRecommendations.map((rec, index) => (
          <div key={index} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden">
            {/* Top Bar Status */}
            <div className={`h-1.5 w-full ${
              rec.action === 'increase' ? 'bg-green-500' : 
              rec.action === 'decrease' ? 'bg-red-500' : 
              'bg-blue-500'
            }`} />
            
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-500 animate-pulse' : 
                    rec.priority === 'medium' ? 'bg-amber-400' : 'bg-gray-300'
                  }`} />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                    {rec.priority === 'high' ? 'أولوية قصوى' : rec.priority === 'medium' ? 'أولوية متوسطة' : 'متابعة عادية'}
                  </span>
                </div>
                <div className={`p-1.5 rounded-lg ${
                  rec.action === 'increase' ? 'bg-green-50 text-green-600' : 
                  rec.action === 'decrease' ? 'bg-red-50 text-red-600' : 
                  'bg-blue-50 text-blue-600'
                }`}>
                  {rec.action === 'increase' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  ) : rec.action === 'decrease' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{rec.product}</h4>
              <p className="text-sm font-semibold text-indigo-500 bg-indigo-50 inline-block self-start px-3 py-1 rounded-md mt-2 mb-4">
                {rec.category}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-grow">
                <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">لماذا هذه التوصية؟</h5>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {rec.reason}
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                   <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">AI</div>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition">
                   تفاصيل التحليل الرقمي
                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-indigo-800 rounded-2xl shadow-inner">
              <svg className="w-12 h-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">هل تعلم؟</h3>
              <p className="text-indigo-100 text-lg opacity-90 max-w-2xl leading-relaxed">
                تعديل مستويات المخزون بناءً على توصيات الذكاء الاصطناعي يمكن أن يقلل من الهدر بنسبة تصل إلى 22% ويزيد من رضا العملاء عن طريق توفير المنتجات المطلوبة دائماً.
              </p>
            </div>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-800 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
      </div>
    </div>
  );
};

export default Recommendations;
