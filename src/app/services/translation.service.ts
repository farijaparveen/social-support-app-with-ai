import { Injectable, signal } from "@angular/core";
import { Language } from "../models/application.model";

@Injectable({ providedIn: "root" })
export class TranslationService {
  private translations: Record<string, Record<string, string>> = {};
  language = signal<Language>("en");

  async load(lang: Language): Promise<void> {
    if (!this.translations[lang]) {
      const res = await fetch(`/assets/i18n/${lang}.json`);
      this.translations[lang] = await res.json();
    }
    this.language.set(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }

  t(key: string, params?: Record<string, string | number>): string {
    const lang = this.language();
    let text =
      this.translations[lang]?.[key] ?? this.translations["en"]?.[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }
    return text;
  }

  toggle(): void {
    const next = this.language() === "en" ? "ar" : "en";
    this.load(next);
  }

  isRtl(): boolean {
    return this.language() === "ar";
  }
}
