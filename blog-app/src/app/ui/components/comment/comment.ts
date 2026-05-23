import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { Coment } from '../../../types/coment';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { GqlService } from '../../../services/comments/graphql.service';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-comment',
  imports: [MatCardModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatIcon],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
  providers: [GqlService]
})
export class Comment {
  @Input() comment!: Coment;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Coment>();
  @Output() save = new EventEmitter<Coment>();
  @Output() rate = new EventEmitter<{ commentId: string; value: number }>();

  private gqlService = inject(GqlService);
  isEditing = false;
  form: FormGroup;

  constructor(){
    this.form = new FormGroup({
        "username": new FormControl("", [ Validators.required,  Validators.minLength(2), Validators.maxLength(10)]),
        "content": new FormControl("", [ Validators.required,  Validators.minLength(5), Validators.maxLength(200)]),
        "rating": new FormControl("", [   Validators.min(1), Validators.max(5)])
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.form.reset({
      username: this.comment.username,
      content: this.comment.content,
      rating: this.comment.rating ?? null
    })
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.form.reset();
  }

  onRatingChange(delta: -1 | 1): void {
    const newRating = (this.comment.rating ?? 0) + delta;
    if (newRating < 1 || newRating > 5) return;

    this.comment.rating = newRating;

    const method = delta === 1 
      ? this.gqlService.updateCommentRatingUp(this.comment.id)
      : this.gqlService.updateCommentRatingDown(this.comment.id);

    method.subscribe({
      next: (updated) => {
        this.comment.rating = updated.rating;
      },
      error: () => {
        this.comment.rating = this.comment.rating! - delta;
      }
    });
  }

  protected onSave(event: Event): void {
    if (this.form.valid) {
      console.log('Оценка', this.form.value)
      const updatedComment: Coment = {
        ...this.comment,
        username: this.form.value.username.trim(),
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
