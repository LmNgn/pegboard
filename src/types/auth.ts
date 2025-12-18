export interface AuthInfo {
  email: string;
  username?: string;
  password: string;
  confirmPassword?: string;
  remember?: boolean;
  terms?: boolean;
}
export interface TokenPops {
  accessToken: string;
}
export type FullAuth = AuthInfo & TokenPops;
