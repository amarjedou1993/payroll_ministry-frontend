export interface IUser {
  id: number;
  username: string;
  token: string;
}

export interface IUserData {
  username: string;
  password: string;
}
interface IResponseUser {
  username: string;
  id: number;
  password: string;
  employeeId: string;
  position: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IResponseUserData {
  token: string;
  user: IResponseUser;
}

export interface AuthState {
  user: IUserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
export interface Role {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  password: string;
  position: string;
  employeeId: string;
  roles: Role[];
}

export interface IUserResponse {
  id: string;
  name: string;
  username: string;
  position: string;
  password?: string;
  employeeId: string;
  roles: Role[];
  createdAt: string;
}

export interface IPayrollReponse {
  id: string;
  filename: string;
  path: string;
  period: string;
  createdAt: string;
  user: IUserResponse;
}

export interface IUpdateUser {
  name?: string;
  position?: string;
  username?: string;
  password?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedPayrollsResponse {
  data: IPayrollReponse[];
  meta: PaginationMeta;
}

export interface PaginatedUsersResponse {
  data: IUserResponse[];
  meta: PaginationMeta;
}

export interface IPayrollWithPreview extends IPayrollReponse {
  preview?: string | null;
}

export interface PaginatedUsersResponse2 {
  data: IUserResponse[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface LastFivePayrollsResponse {
  success: boolean;
  data: IPayrollReponse[];
  meta: {
    totalItems: number;
    itemsReturned: number;
  };
}

export interface UserDetails {
  id: string;
  name: string;
  username?: string;
  position?: string;
  employeeId?: string;
  roles?: Role[];
  createdAt?: string;
}

import { UIMatch } from "react-router-dom";
export interface RouteHandle {
  crumb?: string | ((match?: any) => string);
}

export interface CustomRouteMatch
  extends UIMatch<UserDetails | unknown, RouteHandle | null> {}
