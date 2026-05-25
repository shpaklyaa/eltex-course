import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { IAuthPayload, ILoginData, IUser, IRegisterData } from "../../types/login.type";
import { Observable, tap } from "rxjs";
import { ACCES_TOKEN_LS_KEY } from "./auth.consts";
import { IAuthService } from "./auth.service.interface";

@Injectable()
export class AuthService implements IAuthService {
    private readonly httpClient = inject(HttpClient);
    public readonly currentUser = signal<IUser | null>(null);

    constructor() {
        this.restoreSession();
    }

    public login(data: ILoginData): Observable<unknown> {
        return this.httpClient.post<IAuthPayload>('api/auth/login', data)
            .pipe(
                tap((payload) => {
                    this.currentUser.set(payload.user);
                    localStorage.setItem(ACCES_TOKEN_LS_KEY, payload.access_token)
                })
            );
    }

    public register(data: IRegisterData): Observable<unknown> {
        return this.httpClient.post<IAuthPayload>('api/users/register', data).pipe(
            tap((payload) => {
                this.currentUser.set(payload.user);
                localStorage.setItem(ACCES_TOKEN_LS_KEY, payload.access_token);
            })
        );
    }

    public logout(): void {
        this.currentUser.set(null);
        localStorage.removeItem(ACCES_TOKEN_LS_KEY);
    }

    public restoreSession(): void {
        const token = localStorage.getItem(ACCES_TOKEN_LS_KEY);
        if (!token) return;

        this.httpClient.get<IUser>('/api/auth/me').subscribe({
        next: (payload) => {
            this.currentUser.set(payload);
            console.log('Сессия восстановлена через /auth/me', payload);
        },
        error: (err) => {
            console.warn('Токен недействителен или истёк — очищаем сессию', err);
            this.logout();
        }
        });
    }

    isLoggedIn(): boolean {
        return !!this.currentUser();
    }
}