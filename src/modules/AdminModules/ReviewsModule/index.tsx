"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ReviewProps, UserProps,SubscriptionBoxProps } from "./interface";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ReviewsModule = () => {
    const { isAuthenticated, isLoading, userRoles, username, customFetch } = useAuthContext();
    const router = useRouter();
    const [reviews, setReviews] = useState<ReviewProps[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchReviews();
        }
    }, [isAuthenticated]);

	const fetchReviews = async () => {
		try {
			const response = await customFetch<ReviewProps[]>(
				"http://35.240.228.93",
				`/review/reviews`,
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
						}))
					)
				);
	
				const reviewsWithUsernamesAndBoxnames = validReviews.map((review, index) => ({
					...review,
					username: usernames[index],
					boxname: boxnames[index].name
				}));
	
				setReviews(reviewsWithUsernamesAndBoxnames);
			} else {
				console.error("Failed to fetch reviews: No response");
			}
		} catch (error) {
			console.error("Failed to fetch reviews:", error);
		}
	};

    const handleApprove = async (idReview: string, reviewStatus: string) => {
        if (reviewStatus !== "PENDING") {
            return;
        }

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

    const handleReject = async (idReview: string, reviewStatus: string) => {
        if (reviewStatus !== "PENDING") {
            return;
        }

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
            <h1 className="text-4xl font-bold mb-8">Welcome, {username}</h1>
            <p className="text-xl mb-8">Here's the list of all reviews</p>
            {reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <div className="space-y-8">
                    {reviews.map((review) => (
                        <div key={review.idReview} className="bg-black bg-opacity-45 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Image
                                        src="/Images/ProfilePic.png"
                                        alt="Profile"
                                        width={55}
                                        height={55}
                                        className="rounded-full"
                                    />
                                    <div className="ml-4">
                                        <span className="font-bold text-2xl">{review.username}</span>
                                        <div className="mt-2">
                                            <span className="font-bold">Rating: </span>
                                            <span className="font-light">{review.rating}/5</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="font-bold">Review: </span>
                                            <span className="font-light">{review.review}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="font-bold">Status: </span>
                                            <span className="font-light">{review.reviewStatus}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="font-bold">Subscription Box: </span>
                                            <span className="font-light">{review.boxname}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="font-bold">Date Created: </span>
                                            <span className="font-light">{review.createdDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {review.reviewStatus === "PENDING" && (
                                        <>
                                            <Button 
                                                variant="green" 
                                                size="main"
                                                className="mr-2"
                                                onClick={() => handleApprove(review.idReview, review.reviewStatus)}
                                            >
                                                Approve
                                            </Button>
                                            <Button 
                                                variant="yellow" 
                                                size="main"
                                                className="mr-2"
                                                onClick={() => handleReject(review.idReview, review.reviewStatus)}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
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

export default ReviewsModule;
