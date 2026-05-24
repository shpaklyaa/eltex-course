import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { IAuthPayload, ILoginData, IUser, IRegisterData } from "../../types/login.type";
import { Observable, tap } from "rxjs";
import { ACCES_TOKEN_LS_KEY } from "./auth.consts";

@Injectable()
export class AuthService {
    private readonly httpClient = inject(HttpClient);
    private readonly currentUser = signal<IUser | null>(null);

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

    public getCurrentUser(): IUser | null {
        return this.currentUser();
    }
}