export interface ICreateReview {
    propertyId: string;
    rating: number;
    comment: string;
}

export interface IUpdateReview {
    rating?: number;
    comment?: string;
}