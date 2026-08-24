export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birthday?: string;
  avatar?: string;
  gender?: boolean;
  role?: string;
}

export type UpdateUserRequest = Partial<Omit<User, 'id'>>;
