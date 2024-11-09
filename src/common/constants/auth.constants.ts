export interface IToken {
  token: string;
}

export interface ITokenData {
  id: number;
  email: string;
  iat: number;
  exp: number;
}
