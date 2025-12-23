
import { GoogleGenAI, Type } from "@google/genai";
import { AggregatedData, Recommendation } from "../types";

export const getAIRecommendations = async (data: AggregatedData): Promise<Recommendation[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const prompt = `
    بصفتك خبيراً في تحليل بيانات التجزئة، حلل مبيعات السوبرماركت التالية وقدم توصيات استراتيجية دقيقة ومفصلة باللغة العربية.
    
    البيانات المتاحة:
    - إجمالي المبيعات: ${data.totalRevenue} دولار
    - عدد العمليات الشرائية: ${data.totalTransactions}
    - توزيع المبيعات حسب الفئات: ${JSON.stringify(data.byCategory)}
    - قائمة المنتجات الأكثر مبيعاً (الأعلى إيراداً): ${JSON.stringify(data.topProducts)}
    - طرق الدفع المفضلة لدى الزبائن: ${JSON.stringify(data.byPayment)}

    المطلوب: توليد قائمة من التوصيات (زيادة، تقليل، أو مراقبة المخزون) بناءً على الأنماط المكتشفة.
    يجب أن يكون "السبب" (reason) مفصلاً ويشرح "لماذا" تم تقديم هذه التوصية بناءً على الأرقام المذكورة أعلاه.
    على سبيل المثال: "بسبب ارتفاع الإيرادات في فئة X بنسبة كبيرة مقارنة بالبقية، نوصي بزيادة الكميات لتجنب فقدان فرص ربح".
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "اسم الفئة أو القسم" },
            action: { type: Type.STRING, enum: ['increase', 'decrease', 'monitor'], description: "الإجراء المقترح" },
            product: { type: Type.STRING, description: "اسم المنتج المعني" },
            reason: { type: Type.STRING, description: "شرح مفصل ومقنع للتوصية" },
            priority: { type: Type.STRING, enum: ['high', 'medium', 'low'], description: "مستوى الأولوية" }
          },
          required: ['category', 'action', 'product', 'reason', 'priority']
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};
