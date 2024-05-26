"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { EditReviewFormData } from "./interface";
import { Button } from "@/components/ui/button";
import Image from "next/image"; 

const EditReviewModule = ({ idReview }: { idReview: string }) => {
    const { customFetch, isAuthenticated, isLoading, userRoles, userId } = useAuthContext();
    const router = useRouter();

    const [formData, setFormData] = useState<EditReviewFormData>({
        userId: userId,
        rating: "",
        review: ""
    });

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || (!userRoles.includes("CUSTOMER") && !userRoles.includes("ADMIN")))) {
            router.push("/");
        }
    }, [isAuthenticated, isLoading, router, userRoles]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            await customFetch(
                "http://35.240.228.93",
                `/review/${idReview}/update-review`,
                {
                    method: "PATCH",
                    body: JSON.stringify(formData),
                    isAuthorized: true,
                }
            );
            router.push("/my-reviews"); // Redirect back to reviews page after save
        } catch (error) {
            console.error("Failed to update review:", error);
        }
    };
    
    const handleCancel = () => {
        if (userRoles.includes("ADMIN")) {
            router.push("/reviews");
        } else {
            router.push("/my-reviews");
        }
    };

    return (
        <div className="container mx-auto mt-20 max-w-xl">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                    <Image src="/Images/ProfilePic.png" alt="Profile" width={55} height={55} />
                    <h2 className="font-bold text-xl ml-4"> Edit Review</h2>
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Rating</label>
                    <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Pick your rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Review</label>
                    <textarea
                        name="review"
                        value={formData.review}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Write your review here"
                    />
                </div>
                <div className="flex justify-between">
                    <Button variant="gray" size="main" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="blue" size="main" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditReviewModule;
