import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
   visible: boolean = false;
   @Input() article?: Article;
   @Output() save = new EventEmitter<Article>();

  open() {
    console.log('[FormModal] open() called');
    this.visible = true;
    console.log('[FormModal] visible =', this.visible);
  }

  close() {
    console.log('[FormModal] open() called');
    this.visible = false;
    console.log('[FormModal] visible =', this.visible);
  }

  closeOnBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      console.log('[FormModal] open() called');
      this.close();
      console.log('[FormModal] visible =', this.visible);
    }
  }

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: [''],
      content: ['']
    });
  }

  ngOnInit(): void {
    if (this.article) {
      this.form.patchValue({
        title: this.article.title,
        content: this.article.content
      });
    } else {
      console.warn('No article provided to EditFormModal');
    }

  }

  onSave(): void {
    if (!this.article || !this.form.valid) {
    console.warn('Cannot save: article not provided or form invalid');
    return;
    }

    const updatedArticle: Article = {
      id: this.article.id,
      title: this.form.value.title!,
      content: this.form.value.content!
    };
    this.save.emit(updatedArticle);
  }
}
