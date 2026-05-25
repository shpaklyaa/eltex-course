import { Observable } from 'rxjs';
import { ILoginData, IRegisterData } from '../../types/login.type';

export interface IAuthService {
  login(data: ILoginData): Observable<unknown>;
  register(data: IRegisterData): Observable<unknown>;
  logout(): void;
  restoreSession(): void;
}