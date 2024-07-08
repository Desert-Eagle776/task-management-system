export interface ICreateUser {
  fullname: string;
  email: string;
  password?: string;
}

export interface IUser extends ICreateUser {
  id: number;
  company?: ICompany
  roles?: IRole
}

export interface IToken {
  token: string;
}

export interface ITokenData {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

export interface ICreateCompany {
  name: string;
  email: string;
  secret_key: string;
}

export interface ICompany extends ICreateCompany {
  id: number;
}

export interface IProject {
  id?: number;
  name: string;
  description: string;
  createdByUser?: IUser;
  tasks?: ITask[],
  company?: ICompany;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskStatus {
  id?: number;
  name: string;
  description: string;
}

export interface ITask {
  id: number;
  name: string;
  description: string;
  createdByUser?: IUser;
  appointedToUser?: IUser;
  status?: ITaskStatus;
  project?: IProject;
  company?: ICompany;
}

export interface ICreateTask {
  id?: number;
  name: string;
  description: string;
  createdByUser?: IUser;
  appointedToUser?: IUser;
  status?: ITaskStatus;
  project?: IProject;
  company?: ICompany;
}

export interface IRole {
  id: number;
  name: string;
  description: string;
}