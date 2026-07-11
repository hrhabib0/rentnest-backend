import { UserRole } from "../../../../generated/prisma/enums";

export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface ILoginUser {
    email: string;
    password: string;
}