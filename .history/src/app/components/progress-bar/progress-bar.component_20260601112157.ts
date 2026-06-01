import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStateService } from '../../services/form-state.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  fs = inject(FormStateService);
  t = inject(TranslationService);

  steps = [
    { num: 1, labelKey: 'STEP1_TITLE' },
    { num: 2, labelKey: 'STEP2_TITLE' },
    { num: 3, labelKey: 'STEP3_TITLE' }
  ];
}
