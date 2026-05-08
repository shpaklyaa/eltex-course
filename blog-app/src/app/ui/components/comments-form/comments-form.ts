import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Coment } from '../../../types/coment';

@Component({
  selector: 'app-comments-form',
  imports: [ReactiveFormsModule],
  templateUrl: './comments-form.html',
  styleUrl: './comments-form.scss',
})
export class CommentsForm {

  @Output() save = new EventEmitter<Partial<Coment>>();
  form: FormGroup;

  constructor(){
    this.form = new FormGroup({
        "userName": new FormControl("", [ Validators.required,  Validators.minLength(5), Validators.maxLength(200)]),
        "content": new FormControl("", [ Validators.required,  Validators.minLength(5), Validators.maxLength(200)])
    });
  }

   onSave() {
    const newComment = {
          userName: this.form.value.userName!,
          content: this.form.value.content!
        };
    this.save.emit(newComment);
  }
}
