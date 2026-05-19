import { Component, Input, Output, EventEmitter, computed, input, effect, signal} from '@angular/core';
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
  public previewUrl = signal<string | null>(null);

  form: FormGroup;

  constructor(){
    this.form = new FormGroup({
        "title": new FormControl("", [Validators.required,  Validators.minLength(25), Validators.maxLength(30)]),
        "content": new FormControl("", [ Validators.required,  Validators.minLength(25), Validators.maxLength(120)]),
        "image": new FormControl()
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
          { title: editData.title, content: editData.content, image: editData.image || null });
      } else {
        this.form.reset({image: null});
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.form.patchValue({
      image: file ?? null
    });
  }

  onSave(): void {
    if (this.form.valid) {
      const data = this.form.getRawValue();
      const art = this.article();

      if (art) {
        const updatedArticle: Article = {
          id: art.id,
          title: data.title!,
          content: data.content!,
          image: data.image,
        };
        this.save.emit(updatedArticle);
      } else {
        const newArticle = {
          title: data.title!,
          content: data.content!,
          image: data.image,
        };
        console.log('Before save:', this.form.value);
        console.log('Direct imgSrc:', this.form.get('imgSrc')?.value);
        console.log('Form value:', this.form.value);
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
