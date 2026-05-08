import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { Coment } from '../../../types/coment';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-comment',
  imports: [MatCardModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatIcon],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class Comment {
  @Input() comment!: Coment;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Coment>();
  @Output() save = new EventEmitter<Coment>();
  @Output() rate = new EventEmitter<{ commentId: string; value: number }>();

  isEditing = false;
  form: FormGroup;

  constructor(){
    this.form = new FormGroup({
        "userName": new FormControl("", [ Validators.required,  Validators.minLength(2), Validators.maxLength(10)]),
        "content": new FormControl("", [ Validators.required,  Validators.minLength(5), Validators.maxLength(200)]),
        "rating": new FormControl("", [   Validators.min(1), Validators.max(5)])
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.form.reset({
      userName: this.comment.userName,
      content: this.comment.content,
      rating: this.comment.rating ?? null
    })
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.form.reset();
  }

  protected onSave(event: Event): void {
    if (this.form.valid) {
      console.log('Оценка', this.form.value)
      const updatedComment: Coment = {
        ...this.comment,
        userName: this.form.value.userName.trim(),
        content: this.form.value.content.trim(),
        rating: this.form.value.rating === null || this.form.value.rating === ''
        ? undefined
        : Number(this.form.value.rating),
      };
      this.edit.emit(updatedComment);
      this.cancelEdit();
    }
  }

  protected setRating(value: number): void {
    this.form.patchValue({ rating: value });
  }

  protected onDelete() {
    this.delete.emit(this.comment.id);
  }
}
