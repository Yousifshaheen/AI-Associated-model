
import React from 'react';
import { AggregatedData, ForecastData, SectionInsight } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, ComposedChart, AreaChart, Area
} from 'recharts';

interface Props {
  stats: AggregatedData;
  forecast: ForecastData | null;
  isLoading: boolean;
}

const InsightBox: React.FC<{ insight?: SectionInsight }> = ({ insight }) => {
  if (!insight) return null;
  const config = {
    positive: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: '📈' },
    negative: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', icon: '📉' },
    neutral: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: '💡' }
  };
  const style = config[insight.type as keyof typeof config] || config.neutral;

  return (
    <div className={`mt-6 p-6 rounded-3xl border ${style.bg} ${style.border} shadow-sm animate-fade-in relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-xl">{style.icon}</span>
          <h4 className={`font-black text-sm ${style.text}`}>{insight.title}</h4>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black opacity-40 block uppercase">الأهمية</span>
           <span className={`text-lg font-black ${style.text}`}>{insight.impactScore}%</span>
        </div>
      </div>
      <p className={`text-sm font-bold leading-relaxed relative z-10 ${style.text} opacity-80`}>
        {insight.content}
      </p>
    </div>
  );
};

const Dashboard: React.FC<Props> = ({ stats, forecast, isLoading }) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <div className="w-20 h-20 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-black text-gray-800">جاري قراءة البيانات.. الصبر طيب</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1 block">المتوقع نبيع بـ كم الأسبوع الجاي؟</span>
          <span className="text-2xl font-black block">{forecast ? formatCurrency(forecast.nextWeekRevenue) : '...'}</span>
          <div className="absolute -right-2 -bottom-2 text-4xl opacity-10">📅</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 block">القروش الدخلت كلها</span>
          <span className="text-2xl font-black text-gray-800">{formatCurrency(stats.totalRevenue)}</span>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 block">متوسط الزبون الواحد بشتري بـ كم؟</span>
          <span className="text-2xl font-black text-emerald-600">{formatCurrency(stats.totalRevenue / stats.totalTransactions)}</span>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 block">نسبة ثقتنا في الكلام ده</span>
          <span className="text-2xl font-black text-purple-600">{forecast?.confidenceScore || 0}%</span>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="space-y-12">
        {/* Monthly Trend */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="text-2xl font-black text-gray-900 mb-10">حركة المبيعات في الشهور الفاتت</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlySales}>
                <defs>
                  <linearGradient id="colorMonthlyMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fontSize: 11, fontWeight: 700}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [formatCurrency(val as number), 'المبيعات']}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={5} fill="url(#colorMonthlyMain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <InsightBox insight={forecast?.sectionInsights.monthly} />
        </div>

        {/* Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8">أكتر وقت بكون فيهو زحمة</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.hourlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{fontSize: 10, fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InsightBox insight={forecast?.sectionInsights.hourly} />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8">أيام الإسبوع الشغالة شديد</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={stats.dayOfWeekSales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{fontSize: 10, fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" fill="#10b98120" stroke="#10b981" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <InsightBox insight={forecast?.sectionInsights.weekly} />
          </div>
        </div>

        {/* Bottom Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8">أكتر أقسام بطلع منها قروش</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fontWeight: 700}} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InsightBox insight={forecast?.sectionInsights.category} />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
             <h3 className="text-xl font-black text-center text-gray-900 mb-8">منو بشتري مننا؟</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.byGender} innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                      {stats.byGender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name.toLowerCase() === 'female' ? '#ec4899' : '#4f46e5'} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <InsightBox insight={forecast?.sectionInsights.gender} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
