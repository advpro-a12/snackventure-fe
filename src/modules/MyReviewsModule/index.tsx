"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReviewProps, SubscriptionBoxProps } from "./interface";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const MyReviewsModule = () => {
    const { isAuthenticated, isLoading, userRoles, userId, username, customFetch } = useAuthContext();
    const router = useRouter();
    const [reviews, setReviews] = useState<ReviewProps[]>([]);
    const [groupedReviews, setGroupedReviews] = useState<{ [key: string]: ReviewProps[] }>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !userRoles.includes("CUSTOMER"))) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router, userRoles]);

    useEffect(() => {
        if (isAuthenticated && userRoles.includes("CUSTOMER") && userId) {
            fetchReviews();
        }
    }, [isAuthenticated, userRoles, userId]);

    const fetchReviews = async () => {
        try {
            const response = await customFetch<any>(
                "http://35.240.228.93",
                `/review/reviews`,
                {
                    isAuthorized: true,
                }
            );

            if (response) {
                const responseData = Object.values(response);
                const validReviews = responseData.filter(review => review !== undefined && review.subscriptionBoxId !== undefined);

                const boxnames = await Promise.all(
                    validReviews.map(review =>
                        customFetch<any>(
                            "http://34.87.37.109",
                            `/subscription-box/${review.subscriptionBoxId}`,
                            {
                                isAuthorized: true,
                            }
                        ).then((box: any) => ({
                            name: box.name,
                            imageUrl: box.imageUrl,
                            country: box.country,
                        }))
                    )
                );

                const reviewWithBoxNames = validReviews.map((review, index) => ({
                    ...review,
                    boxnames: boxnames[index].name,
                    boxImageUrl: boxnames[index].imageUrl,
                    boxCountry: boxnames[index].country,
                }));

                setReviews(reviewWithBoxNames);
                
                const grouped = reviewWithBoxNames.reduce((acc, review) => {
                    const boxName = review.boxnames;
                    if (!acc[boxName]) {
                        acc[boxName] = [];
                    }
                    acc[boxName].push(review);
                    return acc;
                }, {});
                setGroupedReviews(grouped);
            } else {
                console.error("Failed to fetch reviews: No response");
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    const handleDelete = async () => {
        if (!reviewToDelete) return;

        try {
            await customFetch(
                "http://35.240.228.93",
                `/review/${reviewToDelete}/delete-review`,
                {
                    method: "DELETE",
                    isAuthorized: true,
                }
            );
            setReviews(reviews.filter(review => review.idReview !== reviewToDelete));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-20 w-full h-[calc(100vh-80px)] overflow-auto container font-raleway">
            <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
            {reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <div>
                    {Object.keys(groupedReviews).map((boxName) => (
                        boxName !== 'undefined' && (
                            <div key={boxName} className="text-l font-semibold mb-4 mt-2">
                                <h2 className="text-xl font-bold mb-2">{boxName}</h2>
                                {groupedReviews[boxName].map((review) => (
                                    <div key={review.idReview} className="bg-black bg-opacity-50 p-4 rounded-lg mb-4 text-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Image
                                                    src="/Images/ProfilePic.png"
                                                    alt="Profile"
                                                    width={55}
                                                    height={55}
                                                />
                                                <div className="ml-4">
                                                    <span className="font-bold text-[36px]">{username}</span>
                                                    <div className="mt-1">
                                                        <span className="font-bold">Rating: </span>
                                                        <span className="font-semibold">{review.rating}/5</span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="font-bold">Review: </span>
                                                        <span className="font-semibold">{review.review}</span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="font-bold">Status: </span>
                                                        <span className="font-semibold">{review.reviewStatus}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Button 
                                                    variant="blue" 
                                                    size="main"
                                                    className="mr-2"
                                                    onClick={() => router.push(`/my-reviews/${review.idReview}`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="red" 
                                                    size="main"
                                                    onClick={() => {
                                                        setReviewToDelete(review.idReview);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ))}
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4 text-center">Delete Confirmation</h2>
                        <p className="text-center mb-4">Are you sure you want to delete this review?<br />You will no longer see this review</p>
                        <div className="flex justify-between">
                            <Button variant="gray" size="main" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="red" size="main" onClick={handleDelete}>
                                Proceed
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReviewsModule;
