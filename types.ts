
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
  byCategory: { name: string; value: number; quantity: number }[];
  byPayment: { name: string; value: number }[];
  byGender: { name: string; value: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  dailySales: { date: string; amount: number }[];
  hourlySales: { hour: string; amount: number; count: number }[];
  dayOfWeekSales: { day: string; amount: number }[];
  monthlySales: { month: string; amount: number; transactions: number }[];
}

export interface SectionInsight {
  title: string;
  content: string;
  type: 'positive' | 'negative' | 'neutral';
  impactScore: number;
}

export interface ForecastData {
  nextWeekRevenue: number;
  nextMonthRevenue: number;
  growthRate: number;
  predictedTopCategory: string;
  confidenceScore: number;
  trendData: { period: string; predicted: number }[];
  sectionInsights: {
    hourly: SectionInsight;
    weekly: SectionInsight;
    monthly: SectionInsight;
    category: SectionInsight;
    gender: SectionInsight;
  };
}

export interface Recommendation {
  category: string;
  action: 'increase' | 'decrease' | 'monitor';
  product: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  horizon: 'weekly' | 'monthly';
  predictedGrowth?: string;
  expectedImpact: string; // تحليل تأثير القرار (Impact Analysis)
}

export type ViewState = 'upload' | 'dashboard' | 'recommendations';
