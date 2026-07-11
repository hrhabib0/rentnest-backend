export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    role: "TENANT" | "LANDLORD";
}