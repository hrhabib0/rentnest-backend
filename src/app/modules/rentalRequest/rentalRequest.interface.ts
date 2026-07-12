import { RentalRequestStatus } from "../../../../generated/prisma/enums";

export interface ICreateRentalRequest {
    propertyId: string;
    moveInDate: Date;
    message?: string;
}

export interface IUpdateRentalRequestStatus {
    status: RentalRequestStatus;
}