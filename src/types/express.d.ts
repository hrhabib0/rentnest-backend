import { UserRole } from "../../prisma/src/generated/prisma/enums"

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                name: string,
                email: string,
                role: UserRole
            }
        }
    }
}

// export { };