
import { GoogleGenAI, Type } from "@google/genai";
import { AggregatedData, Recommendation, ForecastData } from "../types";

export const getAIAnalysis = async (data: AggregatedData): Promise<{ recommendations: Recommendation[], forecast: ForecastData }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const prompt = `
    بصفتك مستشاراً خبيراً في إدارة السوبرماركت وبناءً على قراءة البيانات التاريخية، دايرين منك تحليل دقيق وشامل.
    
    البيانات:
    - مبيعات الشهور: ${JSON.stringify(data.monthlySales)}
    - الساعات والأيام: ${JSON.stringify(data.hourlySales)}, ${JSON.stringify(data.dayOfWeekSales)}
    - الأقسام: ${JSON.stringify(data.byCategory)}

    المطلوب:
    1. توصيات (Recommendations) واضحة. حقل "expectedImpact" لازم يشرح باللهجة السودانية الفائدة الحتجي للدكان لو نفذنا الكلام ده (مثلاً: "القروش حتزيد بنسبة كذا" أو "البضاعة ما حتبور").
    2. رؤى (Insights) لكل رسم بياني تشرح "الحاصل شنو" في الدكان هسي.
    3. توقعات بالأرقام للأسبوع والشهر الجاي.

    الشروط:
    - اللغة: اللهجة السودانية (Sudanese Arabic) لكل النصوص الموجهة للمستخدم.
    - ممنوع نهائياً استخدام كلمات زي "ML" أو "تعلم الآلة" أو "ذكاء اصطناعي". استخدم بدلاً منها "قراءة البيانات" أو "النظام" أو "توقعاتنا".
    - التنسيق: JSON فقط.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          forecast: {
            type: Type.OBJECT,
            properties: {
              nextWeekRevenue: { type: Type.NUMBER },
              nextMonthRevenue: { type: Type.NUMBER },
              growthRate: { type: Type.NUMBER },
              predictedTopCategory: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              trendData: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT, properties: { period: {type: Type.STRING}, predicted: {type: Type.NUMBER} } }
              },
              sectionInsights: {
                type: Type.OBJECT,
                properties: {
                  hourly: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, type: {type: Type.STRING}, impactScore: {type: Type.NUMBER} } },
                  weekly: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, type: {type: Type.STRING}, impactScore: {type: Type.NUMBER} } },
                  monthly: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, type: {type: Type.STRING}, impactScore: {type: Type.NUMBER} } },
                  category: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, type: {type: Type.STRING}, impactScore: {type: Type.NUMBER} } },
                  gender: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, type: {type: Type.STRING}, impactScore: {type: Type.NUMBER} } }
                }
              }
            },
            required: ['nextWeekRevenue', 'nextMonthRevenue', 'growthRate', 'predictedTopCategory', 'confidenceScore', 'trendData', 'sectionInsights']
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                action: { type: Type.STRING, enum: ['increase', 'decrease', 'monitor'] },
                product: { type: Type.STRING },
                reason: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                horizon: { type: Type.STRING, enum: ['weekly', 'monthly'] },
                predictedGrowth: { type: Type.STRING },
                expectedImpact: { type: Type.STRING }
              },
              required: ['category', 'action', 'product', 'reason', 'priority', 'horizon', 'expectedImpact']
            }
          }
        },
        required: ['forecast', 'recommendations']
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw new Error("معليش، حصلت مشكلة في قراءة التوقعات. حاول تاني.");
  }
};
