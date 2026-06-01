import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslationService } from "../../services/translation.service";

export type ModalState = "loading" | "success" | "error" | "editing";

@Component({
  selector: "app-ai-suggestion-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./ai-suggestion-modal.component.html",
  styleUrls: ["./ai-suggestion-modal.component.css"],
})
export class AiSuggestionModalComponent {
  @Input() state: ModalState = "loading";
  @Input() suggestion: string = "";
  @Input() errorMessage: string = "";
  @Output() accepted = new EventEmitter<string>();
  @Output() discarded = new EventEmitter<void>();
  @Output() retried = new EventEmitter<void>();

  t = inject(TranslationService);
  editedText = signal("");
  isEditing = signal(false);

  ngOnChanges(): void {
    if (this.suggestion) {
      this.editedText.set(this.suggestion);
      this.isEditing.set(false);
    }
  }

  startEditing(): void {
    this.editedText.set(this.suggestion);
    this.isEditing.set(true);
  }

  acceptSuggestion(): void {
    this.accepted.emit(this.isEditing() ? this.editedText() : this.suggestion);
  }

  discard(): void {
    this.discarded.emit();
  }

  retry(): void {
    this.retried.emit();
  }

  onOverlayClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      this.discard();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") this.discard();
  }
}
