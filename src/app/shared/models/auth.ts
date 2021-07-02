export type AuthType = 'login' | 'register' | 'whoami';

export interface AuthDTO {
  email: string;
  password: string;
}
