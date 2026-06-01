import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../services/form-state.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-step1-personal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step1-personal.component.html',
  styleUrls: ['./step1-personal.component.css']
})
export class Step1PersonalComponent implements OnInit {
  private fb = inject(FormBuilder);
  fs = inject(FormStateService);
  t = inject(TranslationService);

  form!: FormGroup;

  ngOnInit(): void {
    const saved = this.fs.applicationData().personal;
    this.form = this.fb.group({
      name: [saved.name || '', [Validators.required, Validators.minLength(3)]],
      nationalId: [saved.nationalId || '', [Validators.required, Validators.minLength(6)]],
      dateOfBirth: [saved.dateOfBirth || '', Validators.required],
      gender: [saved.gender || '', Validators.required],
      address: [saved.address || '', Validators.required],
      city: [saved.city || '', Validators.required],
      state: [saved.state || '', Validators.required],
      country: [saved.country || '', Validators.required],
      phone: [saved.phone || '', [Validators.required, Validators.pattern(/^[\+]?[\d\s\-\(\)]{7,20}$/)]],
      email: [saved.email || '', [Validators.required, Validators.email]]
    });
  }

  onNext(): void {
    if (this.form.valid) {
      this.fs.updatePersonal(this.form.value);
      this.fs.nextStep();
    } else {
      this.form.markAllAsTouched();
    }
  }

  hasError(field: string, error?: string): boolean {
    const ctrl = this.form.get(field);
    if (!ctrl || !ctrl.invalid || !ctrl.touched) return false;
    return error ? ctrl.hasError(error) : true;
  }
}
