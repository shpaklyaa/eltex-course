import { Component, Inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { LoginModal } from '../../components/login-modal/login-modal';
import { MatDialog } from '@angular/material/dialog'
import { MatDialogRef } from '@angular/material/dialog'; 
import { AuthService } from '../../../services/auth/auth-service';
import { HasRoleDirective } from '../../../directives/has-role.directive';
import { IsLoggedInDirective } from '../../../directives/is-logged-in.directive';
import { AUTH_SERVICE } from '../../../services/auth/auth-service.token';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    IsLoggedInDirective, MatIcon
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

   constructor(
    @Inject(AUTH_SERVICE) protected authService: AuthService,
    private dialog: MatDialog
  ) {}


  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  protected openAuthModal(): void {
    const modal = this.dialog.open<LoginModal>(LoginModal);
    modal.afterClosed().subscribe((data) => {
      if (!data) return;

      if ('email' in data) {
        this.authService.register(data).subscribe({
          next: () => console.log('Регистрация успешна', data),
          error: err => console.error('Ошибка регистрации:', err)
        });
      } else {
        this.authService.login(data).subscribe({
          next: () => console.log('Вход выполнен', data),
          error: err => console.error('Ошибка входа:', err)
        });
      }
    });
  }

  protected logout(): void {
    this.authService.logout();
    console.log('Пользователь вышел');
  }
}
