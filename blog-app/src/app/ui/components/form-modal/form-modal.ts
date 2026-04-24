import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Article } from '../../../types/article';

@Component({
  selector: 'app-form-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.scss',
})
export class FormModal {
  @Input() article?: Article;
  @Input() articlesCount!: number;
  @Output() save = new EventEmitter<Article>();
  @Output() close = new EventEmitter<void>();
  
  form: FormGroup;

  constructor(){
    this.form = new FormGroup({
        "title": new FormControl("", [Validators.required,  Validators.minLength(25), Validators.maxLength(30)]),
        "content": new FormControl("", [ Validators.required,  Validators.minLength(25), Validators.maxLength(120)]),
    });
  }
  
  onClose() {
    this.close.emit();
  }

  onSave(): void {
    const newArticle: Article = {
      id: this.articlesCount,
      title: this.form.value.title,
      content: this.form.value.content
    };
    this.save.emit(newArticle);
    this.onClose();
  }

  closeOnBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      console.log('[FormModal] open() called');
      this.onClose();
    }
  }
}
