export interface ReviewProps{
    idReview: string;
    userId: string;
    review: string;
    rating: number;
    createdDate: string;
    subscriptionBoxId: string;
    reviewStatus: string;
    username?: string;
    boxname?: string;
    imageUrl?:string;
    description?:string;
    avgRating?:number

}

export interface UserProps {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    address: string;
    userRole: string;
}

export interface SubscriptionBoxProps {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    country: string;
    avgRating: number;
}