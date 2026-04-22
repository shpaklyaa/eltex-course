import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-form-modal',
  imports: [],
  templateUrl: './edit-form-modal.html',
  styleUrl: './edit-form-modal.scss',
})
export class EditFormModal {
   visible: boolean = false;
   @Input() article!: { id: number, title: string, content: string };
   @Output() save = new EventEmitter<{ id: number; title: string; content: string }>();

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

  ngOnInit() {
    this.form.patchValue({
      title: this.article.title,
      content: this.article.content
    });
  }

  onSave() {
    const updatedArticle = {
      id: this.article.id,
      title: this.form.value.title!,
      content: this.form.value.content!
    };
    this.save.emit(updatedArticle);
  }
}
