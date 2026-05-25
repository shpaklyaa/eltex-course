import { Directive, Inject, Input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../services/auth/auth-service';
import { AUTH_SERVICE } from '../services/auth/auth-service.token';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(AUTH_SERVICE) private authService: AuthService
  ) {
    effect(() => {
      const user = this.authService.currentUser();
      const role = this.role;

      if (user?.role === role) {
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

  private role: 'admin' | 'user' = 'user';

  @Input()
  set appHasRole(role: 'admin' | 'user') {
    this.role = role;
  }
}