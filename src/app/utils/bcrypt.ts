import bcrypt from "bcrypt";
import config from "../config";

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, Number(config.jwt_access_secret));
};

export const comparePassword = async (plainPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};