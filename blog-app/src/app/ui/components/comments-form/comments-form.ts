import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments-form',
  imports: [ReactiveFormsModule],
  templateUrl: './comments-form.html',
  styleUrl: './comments-form.scss',
})
export class CommentsForm {
  form: FormGroup;

  constructor(){
    this.form = new FormGroup({
        "content": new FormControl("", [ Validators.required,  Validators.minLength(5), Validators.maxLength(200)])
    });
  }
}
