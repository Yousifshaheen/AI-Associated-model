
import { SaleRecord, AggregatedData } from '../types';

export const parseCSV = (csvText: string): SaleRecord[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const records: SaleRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length < headers.length) continue;

    records.push({
      gender: (currentLine[0] || '').trim(),
      productLine: (currentLine[1] || '').trim(),
      unitPrice: parseFloat(currentLine[2]) || 0,
      quantity: parseInt(currentLine[3]) || 0,
      total: parseFloat(currentLine[4]) || 0,
      date: (currentLine[5] || '').trim(),
      time: (currentLine[6] || '').trim(),
      payment: (currentLine[7] || '').trim(),
      productName: (currentLine[8] || '').trim(),
    });
  }

  return records;
};

export const aggregateData = (records: SaleRecord[]): AggregatedData => {
  const categories: Record<string, { revenue: number, quantity: number }> = {};
  const payments: Record<string, number> = {};
  const genders: Record<string, number> = {};
  const products: Record<string, { quantity: number; revenue: number }> = {};
  const daily: Record<string, number> = {};
  const hourly: Record<string, { amount: number; count: number }> = {};
  const dayOfWeek: Record<string, number> = {};
  const monthly: Record<string, { amount: number; transactions: number }> = {};

  const daysArr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthsArr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  let totalRevenue = 0;

  records.forEach(r => {
    totalRevenue += r.total;
    
    if (!categories[r.productLine]) categories[r.productLine] = { revenue: 0, quantity: 0 };
    categories[r.productLine].revenue += r.total;
    categories[r.productLine].quantity += r.quantity;

    payments[r.payment] = (payments[r.payment] || 0) + 1;
    genders[r.gender] = (genders[r.gender] || 0) + r.total;
    
    if (!products[r.productName]) {
      products[r.productName] = { quantity: 0, revenue: 0 };
    }
    products[r.productName].quantity += r.quantity;
    products[r.productName].revenue += r.total;

    daily[r.date] = (daily[r.date] || 0) + r.total;

    // تحليل الساعات
    const hour = r.time.split(':')[0] || '00';
    if (!hourly[hour]) hourly[hour] = { amount: 0, count: 0 };
    hourly[hour].amount += r.total;
    hourly[hour].count += 1;

    // تحليل أيام الأسبوع
    const dateObj = new Date(r.date);
    const dayName = daysArr[dateObj.getDay()];
    dayOfWeek[dayName] = (dayOfWeek[dayName] || 0) + r.total;

    // تحليل الشهور
    const monthKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}`;
    if (!monthly[monthKey]) monthly[monthKey] = { amount: 0, transactions: 0 };
    monthly[monthKey].amount += r.total;
    monthly[monthKey].transactions += 1;
  });

  return {
    totalRevenue,
    totalTransactions: records.length,
    byCategory: Object.entries(categories).map(([name, stats]) => ({ name, value: stats.revenue, quantity: stats.quantity })),
    byPayment: Object.entries(payments).map(([name, value]) => ({ name, value })),
    byGender: Object.entries(genders).map(([name, value]) => ({ name, value })),
    topProducts: Object.entries(products)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
    dailySales: Object.entries(daily)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    hourlySales: Object.entries(hourly)
      .map(([hour, stats]) => ({ hour: `${hour}:00`, ...stats }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour)),
    dayOfWeekSales: daysArr.map(day => ({ day, amount: dayOfWeek[day] || 0 })),
    monthlySales: Object.entries(monthly)
      .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
      .map(([key, stats]) => {
        const [year, monthIdx] = key.split('-');
        return { month: `${monthsArr[parseInt(monthIdx)]} ${year}`, amount: stats.amount, transactions: stats.transactions };
      })
  };
};
