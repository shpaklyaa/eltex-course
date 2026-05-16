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
        "imgSrc": new FormControl(null)
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
          { title: editData.title, content: editData.content, imgSrc: editData.imgSrc || null });
      } else {
        this.form.reset({imgSrc: null});
      }
    });
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      const maxWidth = 500;
      const maxHeight = 500;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      this.form.patchValue({ imgSrc: dataUrl });
      this.previewUrl.set(dataUrl);
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

  removeImage(): void {
    this.form.patchValue({ imgSrc: null });
    this.previewUrl.set(null);
  }

  onSave(): void {
    if (this.form.valid) {
      const art = this.article();
      if (art) {
        const updatedArticle: Article = {
          id: art.id,
          title: this.form.value.title!,
          content: this.form.value.content!,
          imgSrc: this.form.value.imgSrc || null
        };
        this.save.emit(updatedArticle);
      } else {
        const newArticle = {
          title: this.form.value.title!,
          content: this.form.value.content!,
          imgSrc: this.form.value.imgSrc || null
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
