export interface ReviewProps{
    idReview: string;
    userId: string;
    review: string;
    rating: number;
    createdDate: string;
    subscriptionBoxId: string;
    reviewStatus: string;
    boxname?: string;
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