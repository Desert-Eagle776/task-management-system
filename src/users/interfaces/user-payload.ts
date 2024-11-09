export interface UserPayload {
  user_id: number;
  email: string;
  roles: string | string[];
}

export interface IUserDataInToken extends UserPayload {
  iat: number;
  exp: number;
}