import type { HttpInterceptorFn } from '@angular/common/http';
import { ACCES_TOKEN_LS_KEY } from './auth.consts';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('init interceptor')
  const accessToken = localStorage.getItem(ACCES_TOKEN_LS_KEY);
  if(!accessToken) {
    return next(req);
  }

  const cloneReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return next(cloneReq).pipe();
};
