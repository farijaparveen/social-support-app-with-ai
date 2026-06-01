import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./components/header/header.component";
import { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";
import { Step1PersonalComponent } from "./components/step1-personal/step1-personal.component";
import { Step2FamilyComponent } from "./components/step2-family/step2-family.component";
import { Step3SituationComponent } from "./components/step3-situation/step3-situation.component";
import { FormStateService } from "./services/form-state.service";
import { TranslationService } from "./services/translation.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ProgressBarComponent,
    Step1PersonalComponent,
    Step2FamilyComponent,
    Step3SituationComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  fs = inject(FormStateService);
  t = inject(TranslationService);

  async ngOnInit(): Promise<void> {
    await this.t.load("en");
  }
}
