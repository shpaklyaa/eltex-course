import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Article } from '../../../types/article';

@Component({
  selector: 'app-edit-form-modal',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-form-modal.html',
  styleUrl: './edit-form-modal.scss',
})
export class EditFormModal {
  @Input() article?: Article;
  @Output() save = new EventEmitter<Article>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(){
    this.form = new FormGroup({
        "title": new FormControl("", [Validators.required,  Validators.minLength(25), Validators.maxLength(30)]),
        "content": new FormControl("", [ Validators.required,  Validators.minLength(25), Validators.maxLength(120)]),
    });
  }

  ngOnInit(): void {
    if (this.article) {
      this.form.patchValue(this.article);
    } else {
      console.warn('No article provided to EditFormModal');
    }
  }

  onClose() {
    this.close.emit();
  }

  closeOnBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      console.log('[FormModal] open() called');
      this.onClose();
    }
  }

  onSave() {
    if (this.form.valid && this.article) {
      const updatedArticle: Article = {
      id: this.article.id,
      title: this.form.value.title,
      content: this.form.value.content
      };
      this.save.emit(updatedArticle);
      this.onClose();
    }
  }
}
