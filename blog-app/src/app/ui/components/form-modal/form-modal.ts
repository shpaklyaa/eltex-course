import { Component, Input, Output, EventEmitter, computed, input, effect} from '@angular/core';
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
  @Output() save = new EventEmitter<Partial<Article>>();
  @Output() close = new EventEmitter<void>();
  
  public article = input<Article | undefined>();

  form: FormGroup;

  constructor(){
    this.form = new FormGroup({
        "title": new FormControl("", [Validators.required,  Validators.minLength(25), Validators.maxLength(30)]),
        "content": new FormControl("", [ Validators.required,  Validators.minLength(25), Validators.maxLength(120)]),
    });

    this.editDataEffect();
  }

  protected formTitle = computed(() => {
    const art = this.article();
    return art ? 'Редактировать статью' : 'Добавить статью'
  });

  protected saveButtonLabel = computed(() => {
    const art = this.article();
    return art ? 'Сохранить' : 'Добавить'
  });


  private editDataEffect(): void {
    effect(() => {
      const editData: Article | undefined = this.article();

      if (editData) {
        this.form.reset(
          { title: editData.title, content: editData.content });
      } else {
        this.form.reset();
      }
    });
  }

  onSave(): void {
    if (this.form.valid) {
      const art = this.article();
      if (art) {
        const updatedArticle: Article = {
          id: art.id,
          title: this.form.value.title!,
          content: this.form.value.content!
        };
        this.save.emit(updatedArticle);
      } else {
        const newArticle = {
          title: this.form.value.title!,
          content: this.form.value.content!
        };
        this.save.emit(newArticle);
      }
      this.close.emit();
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
}
