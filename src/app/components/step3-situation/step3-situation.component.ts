import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FormStateService } from "../../services/form-state.service";
import { TranslationService } from "../../services/translation.service";
import { OpenAiService } from "../../services/openai.service";
import {
  AiSuggestionModalComponent,
  ModalState,
} from "../ai-suggestion-modal/ai-suggestion-modal.component";

type ActiveField = "financial" | "employment" | "reason" | null;

@Component({
  selector: "app-step3-situation",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AiSuggestionModalComponent],
  templateUrl: "./step3-situation.component.html",
  styleUrls: ["./step3-situation.component.css"],
})
export class Step3SituationComponent implements OnInit {
  private fb = inject(FormBuilder);
  fs = inject(FormStateService);
  t = inject(TranslationService);
  private aiService = inject(OpenAiService);

  form!: FormGroup;
  showModal = signal(false);
  modalState = signal<ModalState>("loading");
  aiSuggestion = signal("");
  aiError = signal("");
  activeField = signal<ActiveField>(null);

  ngOnInit(): void {
    const saved = this.fs.applicationData().situation;
    this.form = this.fb.group({
      financialSituation: [
        saved.financialSituation || "",
        [Validators.required, Validators.minLength(30)],
      ],
      employmentCircumstances: [
        saved.employmentCircumstances || "",
        [Validators.required, Validators.minLength(30)],
      ],
      reasonForApplying: [
        saved.reasonForApplying || "",
        [Validators.required, Validators.minLength(30)],
      ],
    });
  }

  async openAiModal(field: ActiveField): Promise<void> {
    this.activeField.set(field);
    this.showModal.set(true);
    this.modalState.set("loading");
    this.aiSuggestion.set("");
    this.aiError.set("");
    await this.generateSuggestion(field!);
  }

  private async generateSuggestion(field: ActiveField): Promise<void> {
    const family = this.fs.applicationData().family;
    try {
      const result = await this.aiService.generateSuggestion({
        fieldType: field as any,
        employmentStatus: family.employmentStatus,
        monthlyIncome: family.monthlyIncome,
        dependents: family.dependents,
        housingStatus: family.housingStatus,
        language: this.t.language(),
      });
      this.aiSuggestion.set(result);
      this.modalState.set("success");
    } catch (err: any) {
      this.aiError.set(err.message || this.t.t("AI_ERROR_MSG"));
      this.modalState.set("error");
    }
  }

  onAccepted(text: string): void {
    const field = this.activeField();
    if (!field) return;
    const map: Record<NonNullable<ActiveField>, string> = {
      financial: "financialSituation",
      employment: "employmentCircumstances",
      reason: "reasonForApplying",
    };
    this.form.get(map[field])?.setValue(text);
    this.form.get(map[field])?.markAsTouched();
    this.showModal.set(false);
  }

  onDiscarded(): void {
    this.showModal.set(false);
  }

  async onRetried(): Promise<void> {
    this.modalState.set("loading");
    await this.generateSuggestion(this.activeField());
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      this.fs.updateSituation(this.form.value);
      await this.fs.submitApplication();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onBack(): void {
    this.fs.updateSituation(this.form.value);
    this.fs.prevStep();
  }

  hasError(field: string, error?: string): boolean {
    const ctrl = this.form.get(field);
    if (!ctrl || !ctrl.invalid || !ctrl.touched) return false;
    return error ? ctrl.hasError(error) : true;
  }
}
