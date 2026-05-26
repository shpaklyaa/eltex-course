import { Component, inject, signal, effect, Inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { IsLoggedInDirective } from '../../../directives/is-logged-in.directive';
import { AUTH_SERVICE } from '../../../services/auth/auth-service.token';
import { IAuthService } from '../../../services/auth/auth.service.interface';

@Component({
  selector: 'app-login-modal',
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
})
export class LoginModal {
  private readonly dialogRef = inject(MatDialogRef<LoginModal>);
  protected isRegister = signal(false);

  isLoggedIn = signal(false);

  constructor(@Inject(AUTH_SERVICE) private authService: IAuthService) {
    effect(() => {
      this.isLoggedIn.set(this.authService.isLoggedIn());
    });
  }

  protected form = new FormGroup({
    login: new FormControl(null, [Validators.required]),
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    email: new FormControl('example@mail.ru', [Validators.email]),
    isAdmin: new FormControl(null),
  });

  protected onClose(): void {
    this.dialogRef.close()
  }

  protected onLogin(): void {
    const { login, password } = this.form.value;
    if (login && password) {
      this.dialogRef.close({ login, password });  
    }
  }
  protected onRegister(): void {
    const { username, email, password, isAdmin } = this.form.value;
    if (username && email && password && isAdmin) {
      this.dialogRef.close({ username, email, password, isAdmin });
    }
  }
}
