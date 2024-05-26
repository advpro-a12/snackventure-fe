
import SnackBoxReviewModule from "@/modules/SnackBoxReviewModule";
import React from "react";


export default function Page({ params }: { params: { id: string } }) {
    const idSubscriptionBox = params.id;
    return <SnackBoxReviewModule idSubscriptionBox = {idSubscriptionBox} />;
}