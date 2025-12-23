
export interface SaleRecord {
  gender: string;
  productLine: string;
  unitPrice: number;
  quantity: number;
  total: number;
  date: string;
  time: string;
  payment: string;
  productName: string;
}

export interface AggregatedData {
  totalRevenue: number;
  totalTransactions: number;
  byCategory: { name: string; value: number }[];
  byPayment: { name: string; value: number }[];
  byGender: { name: string; value: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
}

export interface Recommendation {
  category: string;
  action: 'increase' | 'decrease' | 'monitor';
  product: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export type ViewState = 'upload' | 'dashboard' | 'recommendations';
