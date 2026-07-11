import { UserRole } from "../../../prisma/src/generated/prisma/enums";


export const REGISTER_ALLOWED_ROLES: UserRole[] = [
    UserRole.TENANT,
    UserRole.LANDLORD,
];