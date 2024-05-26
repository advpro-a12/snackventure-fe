import React from "react";
import EditReviewModule from "@/modules/EditReviewModule";

export default function Page({ params }: { params: { id: string } }) {
    const idReview = params.id;
    return <EditReviewModule idReview ={idReview} />;
}