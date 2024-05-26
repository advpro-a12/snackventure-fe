"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReviewProps, SubscriptionBoxProps, UserProps } from "./interface";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SnackBoxReviewModule = ({ idSubscriptionBox }: { idSubscriptionBox: string }) => {
    const { isAuthenticated, isLoading, userRoles, customFetch } = useAuthContext();
    const router = useRouter();
    const [reviews, setReviews] = useState<ReviewProps[]>([]);
    const [selectedRatingFilter, setSelectedRatingFilter] = useState<string>("");

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || (!userRoles.includes("CUSTOMER") && !userRoles.includes("ADMIN")))) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router, userRoles]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchReviews();
        }
    }, [isAuthenticated]);

    const fetchReviews = async () => {
        try {
            const response = await customFetch<ReviewProps[]>(
                "http://35.240.228.93",
                `/review/subscription-box/${idSubscriptionBox}`,
                {
                    isAuthorized: true,
                }
            );

            if (response) {
                const responseData = Object.values(response);
                const validReviews = responseData.filter(review => review !== undefined && review.subscriptionBoxId !== undefined);

                const usernames = await Promise.all(
                    validReviews.map(review =>
                        customFetch<UserProps>(
                            "http://34.87.81.229",
                            `/auth/user/${review.userId}`,
                            {
                                isAuthorized: true,
                            }
                        ).then(user => user.username)
                    )
                );

                const boxnames = await Promise.all(
                    validReviews.map(review =>
                        customFetch<SubscriptionBoxProps>(
                            "http://34.87.37.109",
                            `/subscription-box/${review.subscriptionBoxId}`,
                            {
                                isAuthorized: true,
                            }
                        ).then((box: any) => ({
                            name: box.name,
                            imageUrl: box.imageUrl,
                            country: box.country,
                            description: box.description
                        }))
                    )
                );

                const reviewsWithUsernamesAndBoxnames = validReviews.map((review, index) => ({
                    ...review,
                    username: usernames[index],
                    boxname: boxnames[index].name,
                    imageUrl: boxnames[index].imageUrl,
                    description: boxnames[index].description,
                }));

                setReviews(reviewsWithUsernamesAndBoxnames);
            } else {
                console.error("Failed to fetch reviews: No response");
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    const handleApprove = async (idReview: string) => {
        try {
            await customFetch(
                "http://35.240.228.93",
                `/review/${idReview}/change-status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status: "APPROVED" }),
                    isAuthorized: true,
                }
            );
            fetchReviews();
        } catch (error) {
            console.error("Failed to approve review:", error);
        }
    };

    const handleReject = async (idReview: string) => {
        try {
            await customFetch(
                "http://35.240.228.93",
                `/review/${idReview}/change-status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status: "REJECTED" }),
                    isAuthorized: true,
                }
            );
            fetchReviews();
        } catch (error) {
            console.error("Failed to reject review:", error);
        }
    };

    const handleDelete = async (idReview: string) => {
        try {
            await customFetch(
                "http://35.240.228.93",
                `/review/${idReview}/delete-review`,
                {
                    method: "DELETE",
                    isAuthorized: true,
                }
            );
            fetchReviews();
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    const handleRatingFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRatingFilter(e.target.value);
    };

    const filteredReviews = selectedRatingFilter
        ? reviews.filter(review => review.rating === parseInt(selectedRatingFilter))
        : reviews;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-20 w-full h-[calc(100vh-80px)] overflow-auto container font-raleway">
            <h2 className="text-2xl font-bold mb-4">{reviews[0]?.boxname}</h2>
            <div className="flex justify-between mb-4">
                <select className="p-2 border rounded bg-black bg-opacity-20 text-black" onChange={handleRatingFilterChange}>
                    <option value="">Filter Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
                {userRoles.includes("CUSTOMER"|| "ADMIN") && (
                    <Button
                        variant="green"
                        size="main"
                        onClick={() => router.push(`/write-review/${idSubscriptionBox}`)}
                    >
                        Write a Review
                    </Button>
                )}
            </div>
            {filteredReviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <div key={review.idReview} className="bg-black bg-opacity-25 p-6 rounded-lg text-white">
                            <div className="flex items-center mb-2">
                                <Image
                                    src="/Images/ProfilePic.png"
                                    alt="Profile"
                                    width={55}
                                    height={55}
                                    className="rounded-full"
                                />
                                <span className="ml-4 font-bold text-xl">{review.username}</span>
                            </div>
                            <div className="ml-16">
                                <div className="mb-1">
                                    <span className="font-bold">Rating: </span>
                                    <span>{review.rating}/5</span>
                                </div>
                                <div className="mb-1">
                                    <span className="font-bold">Review: </span>
                                    <span>{review.review}</span>
                                </div>
                                {userRoles.includes("ADMIN") && (
                                    <>
                                        <div className="mb-1">
                                            <span className="font-bold">Status: </span>
                                            <span>{review.reviewStatus}</span>
                                        </div>
                                        <div className="flex space-x-2 mt-4">
                                            <Button variant="green" onClick={() => handleApprove(review.idReview)}>
                                                Approve
                                            </Button>
                                            <Button variant="yellow" onClick={() => handleReject(review.idReview)}>
                                                Reject
                                            </Button>
                                            <Button variant="blue" onClick={() => router.push(`/edit-review/${review.idReview}`)}>
                                                Edit
                                            </Button>
                                            <Button variant="red" onClick={() => handleDelete(review.idReview)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </>
								)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SnackBoxReviewModule;
