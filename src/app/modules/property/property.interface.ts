import { PropertyStatus } from "../../../../generated/prisma/enums";

export interface ICreateProperty {
    title: string;
    description: string;

    address: string;
    city: string;

    monthlyRent: number;

    bedrooms: number;
    bathrooms: number;
    size?: number;

    imageUrls: string[];
    amenities: string[];

    categoryId: string;
}

export interface IUpdateProperty {
    title?: string;
    description?: string;
    address?: string;
    city?: string;
    monthlyRent?: number;
    bedrooms?: number;
    bathrooms?: number;
    size?: number;
    imageUrls?: string[];
    amenities?: string[];
    categoryId?: string;
    status?: PropertyStatus;
}