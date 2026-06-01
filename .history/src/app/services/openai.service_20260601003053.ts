import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface AiPromptContext {
  fieldType: 'financial' | 'employment' | 'reason';
  employmentStatus?: string;
  monthlyIncome?: number | null;
  dependents?: number | null;
  housingStatus?: string;
  existingText?: string;
  language: 'en' | 'ar';
}

@Injectable({ providedIn: 'root' })
export class OpenAiService {

  async generateSuggestion(context: AiPromptContext): Promise<string> {
    const prompt = this.buildPrompt(context);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${environment.openAiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          max_tokens: 300,
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: context.language === 'ar'
                ? 'أنت مساعد متخصص في مساعدة الأفراد على كتابة طلبات الدعم الاجتماعي الحكومية. اكتب بأسلوب رسمي وواضح ومتعاطف. لا تستخدم معلومات شخصية حقيقية. أجب باللغة العربية فقط.'
                : 'You are an assistant helping individuals write government social support applications. Write formally, clearly, and empathetically. Do not use real personal information. Respond in English only.'
            },
            { role: 'user', content: prompt }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() ?? '';
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
      throw err;
    }
  }

  private buildPrompt(ctx: AiPromptContext): string {
    const infoLines: string[] = [];
    if (ctx.employmentStatus) infoLines.push(`Employment: ${ctx.employmentStatus}`);
    if (ctx.monthlyIncome != null) infoLines.push(`Monthly income: $${ctx.monthlyIncome}`);
    if (ctx.dependents != null) infoLines.push(`Dependents: ${ctx.dependents}`);
    if (ctx.housingStatus) infoLines.push(`Housing: ${ctx.housingStatus}`);
    const info = infoLines.join(', ');

    if (ctx.language === 'ar') {
      const prompts: Record<string, string> = {
        financial: `اكتب وصفاً موجزاً وصادقاً للوضع المالي الحالي لمتقدم يمتلك المعلومات التالية: ${info}. الوصف للاستخدام في طلب دعم حكومي رسمي.`,
        employment: `اكتب وصفاً لظروف العمل لمتقدم بهذه المعلومات: ${info}. الوصف للاستخدام في طلب دعم حكومي رسمي.`,
        reason: `اكتب تفسيراً واضحاً وإنسانياً لسبب تقديم هذا الشخص للحصول على المساعدة المالية بناءً على: ${info}. الوصف للاستخدام في طلب دعم حكومي رسمي.`
      };
      return prompts[ctx.fieldType];
    }

    const prompts: Record<string, string> = {
      financial: `Write a concise, honest description of the current financial situation for an applicant with these details: ${info}. This is for a formal government social support application.`,
      employment: `Write a clear description of employment circumstances for an applicant with these details: ${info}. This is for a formal government social support application.`,
      reason: `Write a clear, human explanation for why this person is applying for financial assistance based on: ${info}. This is for a formal government social support application.`
    };
    return prompts[ctx.fieldType];
  }
}
