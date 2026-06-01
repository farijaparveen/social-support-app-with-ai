import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FormStateService } from "../../services/form-state.service";
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: "app-step2-family",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./step2-family.component.html",
  styleUrls: ["./step2-family.component.css"],
})
export class Step2FamilyComponent implements OnInit {
  private fb = inject(FormBuilder);
  fs = inject(FormStateService);
  t = inject(TranslationService);

  form!: FormGroup;

  ngOnInit(): void {
    const saved = this.fs.applicationData().family;
    this.form = this.fb.group({
      maritalStatus: [saved.maritalStatus || "", Validators.required],
      dependents: [
        saved.dependents ?? 0,
        [Validators.required, Validators.min(0), Validators.max(20)],
      ],
      employmentStatus: [saved.employmentStatus || "", Validators.required],
      monthlyIncome: [
        saved.monthlyIncome ?? "",
        [Validators.required, Validators.min(0)],
      ],
      housingStatus: [saved.housingStatus || "", Validators.required],
    });
  }

  onNext(): void {
    if (this.form.valid) {
      this.fs.updateFamily(this.form.value);
      this.fs.nextStep();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onBack(): void {
    this.fs.updateFamily(this.form.value);
    this.fs.prevStep();
  }

  hasError(field: string, error?: string): boolean {
    const ctrl = this.form.get(field);
    if (!ctrl || !ctrl.invalid || !ctrl.touched) return false;
    return error ? ctrl.hasError(error) : true;
  }
}
