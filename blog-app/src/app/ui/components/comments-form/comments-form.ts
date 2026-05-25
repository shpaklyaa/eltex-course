import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Coment } from '../../../types/coment';
import { MatCard } from "@angular/material/card";
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HasRoleDirective } from '../../../directives/has-role.directive';
import { IsLoggedInDirective } from '../../../directives/is-logged-in.directive';
import { AuthService } from '../../../services/auth/auth-service';
import { AUTH_SERVICE } from '../../../services/auth/auth-service.token';

@Component({
  selector: 'app-comments-form',
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, IsLoggedInDirective],
  templateUrl: './comments-form.html',
  styleUrl: './comments-form.scss',
})
export class CommentsForm {

  @Output() save = new EventEmitter<Partial<Coment>>();
  form: FormGroup;

  constructor(@Inject(AUTH_SERVICE) protected authService: AuthService){
    this.form = new FormGroup({
        // "username": new FormControl(currentUser?.username, [ Validators.required,  Validators.minLength(2), Validators.maxLength(10)]),
        "content": new FormControl("", [ Validators.required,  Validators.minLength(5), Validators.maxLength(200)]),
        "rating": new FormControl(null, [   Validators.min(1), Validators.max(5)])
    });
  }

   onSave() {
    const currentUser = this.authService.currentUser()?.username;
    const newComment = {
          username: currentUser!,
          content: this.form.value.content!,
          rating: this.form.value.rating === null ? undefined : this.form.value.rating,
        };
    this.save.emit(newComment);
    this.form.reset();
  }

  setRating(value: number): void {
    this.form.patchValue({ rating: value });
  }
}
