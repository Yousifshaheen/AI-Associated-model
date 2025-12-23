
import React from 'react';
import { AggregatedData } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface Props {
  stats: AggregatedData;
}

const Dashboard: React.FC<Props> = ({ stats }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">إجمالي الإيرادات</span>
          <span className="text-3xl font-bold text-indigo-600">${stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">عدد المعاملات</span>
          <span className="text-3xl font-bold text-green-600">{stats.totalTransactions}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">متوسط قيمة المعاملة</span>
          <span className="text-3xl font-bold text-amber-600">${(stats.totalRevenue / stats.totalTransactions).toFixed(2)}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-4">أداء خطوط المنتجات</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
                <Tooltip 
                   formatter={(value) => `$${Number(value).toLocaleString()}`}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-4">طرق الدفع المفضلة</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.byPayment}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.byPayment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-4">المنتجات الخمسة الأكثر مبيعاً (من حيث الإيرادات)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="pb-4 font-medium">اسم المنتج</th>
                  <th className="pb-4 font-medium">الكمية المباعة</th>
                  <th className="pb-4 font-medium">إجمالي الإيرادات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="py-4 font-medium text-gray-900">{p.name}</td>
                    <td className="py-4 text-gray-600">{p.quantity}</td>
                    <td className="py-4 font-bold text-indigo-600">${p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
