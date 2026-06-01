import { Injectable, signal } from "@angular/core";
import { ApplicationData, StepNumber } from "../models/application.model";

const STORAGE_KEY = "social_support_app_data";
const STEP_KEY = "social_support_app_step";

@Injectable({ providedIn: "root" })
export class FormStateService {
  currentStep = signal<StepNumber>(1);
  submitted = signal<boolean>(false);
  submitting = signal<boolean>(false);
  referenceNumber = signal<string>("");

  applicationData = signal<ApplicationData>({
    personal: {},
    family: {},
    situation: {},
  });

  constructor() {
    this.loadFromStorage();
  }

  updatePersonal(data: ApplicationData["personal"]): void {
    this.applicationData.update((current) => ({
      ...current,
      personal: { ...current.personal, ...data },
    }));
    this.saveToStorage();
  }

  updateFamily(data: ApplicationData["family"]): void {
    this.applicationData.update((current) => ({
      ...current,
      family: { ...current.family, ...data },
    }));
    this.saveToStorage();
  }

  updateSituation(data: ApplicationData["situation"]): void {
    this.applicationData.update((current) => ({
      ...current,
      situation: { ...current.situation, ...data },
    }));
    this.saveToStorage();
  }

  goToStep(step: StepNumber): void {
    this.currentStep.set(step);
    localStorage.setItem(STEP_KEY, String(step));
  }

  nextStep(): void {
    const next = Math.min(3, this.currentStep() + 1) as StepNumber;
    this.goToStep(next);
  }

  prevStep(): void {
    const prev = Math.max(1, this.currentStep() - 1) as StepNumber;
    this.goToStep(prev);
  }

  async submitApplication(): Promise<void> {
    this.submitting.set(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const ref = "SSP-" + Date.now().toString(36).toUpperCase();
    this.referenceNumber.set(ref);
    this.submitted.set(true);
    this.submitting.set(false);
    this.clearStorage();
  }

  resetApplication(): void {
    this.applicationData.set({ personal: {}, family: {}, situation: {} });
    this.currentStep.set(1);
    this.submitted.set(false);
    this.submitting.set(false);
    this.referenceNumber.set("");
    this.clearStorage();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.applicationData()));
    } catch {}
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const step = localStorage.getItem(STEP_KEY);
      if (data) this.applicationData.set(JSON.parse(data));
      if (step) this.currentStep.set(Number(step) as StepNumber);
    } catch {}
  }

  private clearStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  }
}
