
import { SaleRecord } from '../types';

export const parseCSV = (csvText: string): SaleRecord[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const records: SaleRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length < headers.length) continue;

    records.push({
      gender: currentLine[0],
      productLine: currentLine[1],
      unitPrice: parseFloat(currentLine[2]),
      quantity: parseInt(currentLine[3]),
      total: parseFloat(currentLine[4]),
      date: currentLine[5],
      time: currentLine[6],
      payment: currentLine[7],
      productName: currentLine[8],
    });
  }

  return records;
};

export const aggregateData = (records: SaleRecord[]) => {
  const categories: Record<string, number> = {};
  const payments: Record<string, number> = {};
  const genders: Record<string, number> = {};
  const products: Record<string, { quantity: number; revenue: number }> = {};
  
  let totalRevenue = 0;

  records.forEach(r => {
    totalRevenue += r.total;
    categories[r.productLine] = (categories[r.productLine] || 0) + r.total;
    payments[r.payment] = (payments[r.payment] || 0) + 1;
    genders[r.gender] = (genders[r.gender] || 0) + r.total;
    
    if (!products[r.productName]) {
      products[r.productName] = { quantity: 0, revenue: 0 };
    }
    products[r.productName].quantity += r.quantity;
    products[r.productName].revenue += r.total;
  });

  return {
    totalRevenue,
    totalTransactions: records.length,
    byCategory: Object.entries(categories).map(([name, value]) => ({ name, value })),
    byPayment: Object.entries(payments).map(([name, value]) => ({ name, value })),
    byGender: Object.entries(genders).map(([name, value]) => ({ name, value })),
    topProducts: Object.entries(products)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  };
};
