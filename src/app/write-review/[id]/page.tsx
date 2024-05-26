import React from "react";
import WriteReviewModul from "@/modules/WriteReviewModul";

export default function Page({ params }: { params: { id: string } }) {
    const idSubscriptionBox = params.id;
    return <WriteReviewModul idSubscriptionBox = {idSubscriptionBox} />;
}