import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login-modal',
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
})
export class LoginModal {
  private readonly dialogRef = inject(MatDialogRef<LoginModal>);
  protected isRegister = signal(false);

  protected form = new FormGroup({
    login: new FormControl(null, [Validators.required]),
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    email: new FormControl('example@mail.ru', [Validators.email])
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
    const { username, email, password } = this.form.value;
    if (username && email && password) {
      this.dialogRef.close({ username, email, password });
    }
  }
}
