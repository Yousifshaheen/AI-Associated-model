
import React, { useState, useMemo, useRef } from 'react';
import { ViewState, SaleRecord, AggregatedData, Recommendation } from './types';
import { parseCSV, aggregateData } from './utils/csvParser';
import { getAIRecommendations } from './services/geminiService';
import Dashboard from './components/Dashboard';
import Recommendations from './components/Recommendations';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('upload');
  const [data, setData] = useState<SaleRecord[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => (data.length > 0 ? aggregateData(data) : null), [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError("يرجى اختيار ملف بتنسيق CSV فقط.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const records = parseCSV(text);
        if (records.length > 0) {
          setData(records);
          setError(null);
        } else {
          setError("لم يتم العثور على بيانات صالحة في الملف. يرجى التحقق من تنسيق CSV.");
          setFileName(null);
        }
      } catch (err) {
        setError("حدث خطأ أثناء قراءة محتوى الملف.");
        setFileName(null);
      }
    };
    reader.readAsText(file);
  };

  const processAnalysis = async () => {
    if (!stats) return;
    setIsLoading(true);
    setView('dashboard');
    try {
      const aiRecs = await getAIRecommendations(stats);
      setRecommendations(aiRecs);
    } catch (err) {
      console.error(err);
      setError("تعذر الحصول على توصيات الذكاء الاصطناعي حالياً.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="bg-white text-indigo-700 p-2 rounded-lg font-bold text-xl">AI</div>
            <h1 className="text-2xl font-bold tracking-tight">SuperAI</h1>
          </div>
          {data.length > 0 && !isLoading && (
            <nav className="flex gap-2 md:gap-4">
              <button 
                onClick={() => setView('dashboard')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base transition ${view === 'dashboard' ? 'bg-white text-indigo-700 font-bold shadow-md' : 'hover:bg-indigo-600 text-indigo-100'}`}
              >
                التحليلات
              </button>
              <button 
                onClick={() => setView('recommendations')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base transition ${view === 'recommendations' ? 'bg-white text-indigo-700 font-bold shadow-md' : 'hover:bg-indigo-600 text-indigo-100'}`}
              >
                التوصيات
              </button>
              <button 
                onClick={() => {
                  setData([]);
                  setFileName(null);
                  setView('upload');
                }}
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base bg-indigo-800 hover:bg-indigo-900 transition text-indigo-200"
              >
                تغيير الملف
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {view === 'upload' && (
          <div className="max-w-xl mx-auto mt-10">
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-gray-800">تحليل بيانات السوبرماركت</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                ارفع ملف مبيعاتك بتنسيق CSV للحصول على رؤى فورية وتوصيات ذكية لتحسين مخزونك وزيادة مبيعاتك.
              </p>
              
              <div 
                onClick={triggerFileInput}
                className={`border-3 border-dashed rounded-2xl p-10 transition cursor-pointer group flex flex-col items-center justify-center space-y-4
                  ${fileName ? 'border-green-400 bg-green-50' : 'border-indigo-200 hover:border-indigo-500 bg-slate-50'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".csv" 
                  className="hidden" 
                />
                
                {fileName ? (
                  <>
                    <div className="text-green-600 font-bold text-lg flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      تم اختيار الملف: {fileName}
                    </div>
                    <button className="text-sm text-indigo-600 hover:underline">تغيير الملف</button>
                  </>
                ) : (
                  <>
                    <p className="text-indigo-600 font-bold group-hover:scale-105 transition-transform">اضغط هنا لرفع الملف</p>
                    <p className="text-xs text-gray-400">يدعم ملفات CSV فقط</p>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                disabled={data.length === 0}
                onClick={processAnalysis}
                className={`mt-10 w-full py-4 rounded-2xl font-bold text-lg transition shadow-xl ${data.length > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                بدء التحليل الذكي
              </button>
              
              <div className="mt-8 text-xs text-gray-400">
                تأكد أن الملف يحتوي على أعمدة: الفئة، السعر، الكمية، الإجمالي، التاريخ، طريقة الدفع.
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && stats && (
          <Dashboard stats={stats} />
        )}

        {view === 'recommendations' && (
          <Recommendations recommendations={recommendations} isLoading={isLoading} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 text-gray-400 p-6 text-center text-sm">
        <p>© 2024 نظام SuperAI - ذكاء اصطناعي لإدارة المبيعات</p>
      </footer>
    </div>
  );
};

export default App;
