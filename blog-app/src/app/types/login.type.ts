export interface ILoginData {
    login: string;
    password: string;
}

export interface IRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface IUser {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin'
}

export interface IAuthPayload {
    user: IUser;
    access_token: string;
}