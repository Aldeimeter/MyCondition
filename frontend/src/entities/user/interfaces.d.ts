export interface User {
  email: string;
  role?: "user" | "admin";
  username: string;
  height?: number;
  age?: number;
  password?: string;
  passwordConfirm?: string;
  id?: string;
}
