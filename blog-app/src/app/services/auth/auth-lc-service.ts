import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  ILoginData,
  IRegisterData,
  IUser,
} from '../../types/login.type';
import  { IAuthService } from '../auth/auth.service.interface'

const USERS_KEY = 'USERS_KEY';
const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_LS_KEY';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageAuthService implements IAuthService {
    public readonly currentUser = signal<IUser | null>(null);
    constructor() {
        console.log('[LOCAL] LocalStorageAuthService instantiated');
        this.restoreSession();
    }

    public login(data: ILoginData): Observable<unknown> {
        const users = this.getUsers();
        const user = users.find(
            (u) =>
            (u.email === data.login || u.username === data.login) &&
            u.password === data.password
        );

        if (!user) {
            return throwError(() => new Error('Неверные данные для входа'));
        }

        const payload = {
            user,
            access_token: this.generateToken(user.id),
        };

        localStorage.setItem(ACCESS_TOKEN_KEY, payload.access_token);
        this.currentUser.set(user);
        return of(payload);
    }

    public register(data: IRegisterData): Observable<unknown> {
        const users = this.getUsers();
        const exists = users.some(
            (u) => u.email === data.email || u.username === data.username
        );

        if (exists) {
            return throwError(() => new Error('Пользователь уже существует'));
        }

        const newUser: IUser & { password: string } = {
            id: this.generateId(),
            username: data.username,
            email: data.email,
            role: data.isAdmin ? 'admin' : 'user',
            password: data.password,
        };

        users.push(newUser);
        this.saveUsers(users);

        return this.login({ login: data.email, password: data.password });
    }

    public logout(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        this.currentUser.set(null);
    }

    public restoreSession(): void {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (!token) return;

        try {
            const userId = this.decodeToken(token);
            const users = this.getUsers();
            const user = users.find((u) => u.id === userId);

            if (user) {
            this.currentUser.set(user);
            }
        } catch {
            this.logout();
        }
    }


    private getUsers(): (IUser & { password: string })[] {
        const json = localStorage.getItem(USERS_KEY);
        return json ? JSON.parse(json) : [];
    }

    private saveUsers(users: (IUser & { password: string })[]): void {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 10);
    }

    private generateToken(userId: string): string {
        return btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }));
    }

    private decodeToken(token: string): string {
        const payload = JSON.parse(atob(token));
        return payload.userId;
    }
}