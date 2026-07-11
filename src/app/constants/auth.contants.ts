import { UserRole } from "../../../generated/prisma/enums";


export const REGISTER_ALLOWED_ROLES: UserRole[] = [
    UserRole.TENANT,
    UserRole.LANDLORD,
];