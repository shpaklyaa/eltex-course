import { Directive, Inject, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../services/auth/auth-service';
import { AUTH_SERVICE } from '../services/auth/auth-service.token';

@Directive({
  selector: '[appIsLoggedIn]',
})
export class IsLoggedInDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(AUTH_SERVICE) private authService: AuthService
  ) {
    effect(() => {
      const isLoggedIn = !!this.authService.currentUser();
      if (isLoggedIn) {
        if (!this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        }
      } else {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}