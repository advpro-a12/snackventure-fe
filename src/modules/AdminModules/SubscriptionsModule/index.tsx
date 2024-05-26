"use client";

import React from "react";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/elements/Card";
import { SubscriptionProps } from "./interface";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SubscriptionsModule = () => {
	const { isAuthenticated, isLoading, userRoles, customFetch } =
		useAuthContext();
	const router = useRouter();
	const [subscriptions, setSubscriptions] = React.useState<SubscriptionProps[]>(
		[]
	);

	useEffect(() => {
		if (!isLoading && (!isAuthenticated || !userRoles.includes("ADMIN"))) {
			router.push("/");
		}
	}, [isAuthenticated, isLoading, router, userRoles]);

	useEffect(() => {
		customFetch<SubscriptionProps[]>(
			"http://35.198.232.212",
			"/subscriptions",
			{
				isAuthorized: true,
			}
		).then((response) => {
			const responseData = Object.values(response);
			const subscriptions = responseData.slice(0, responseData.length - 1);

			Promise.all(
				subscriptions.map((subscription) =>
					customFetch(
						"http://34.87.81.229",
						`/auth/user/${subscription.customerId}`,
						{
							isAuthorized: true,
						}
					).then((user) => user.username)
				)
			).then((usernames) => {
				const subscriptionsWithCustomerName = subscriptions.map(
					(subscription, index) => {
						return {
							...subscription,
							customerName: usernames[index],
						};
					}
				);
				setSubscriptions(subscriptionsWithCustomerName);
			});
		});
	});

	const handleApprove = (id: string, approvalStatus: string) => {
		if (approvalStatus !== "PENDING") {
			toast(`Subscription is already ${approvalStatus}`);
			return;
		}

		customFetch("http://35.198.232.212", `/subscriptions/${id}/change-status`, {
			method: "PUT",
			body: JSON.stringify({ status: "APPROVED" }),
			isAuthorized: true,
		}).then(() => toast("Subscription approved."));
	};

	const handleReject = (id: string, approvalStatus: string) => {
		if (approvalStatus !== "PENDING") {
			toast(`Subscription is already ${approvalStatus}`);
			return;
		}

		customFetch("http://35.198.232.212", `/subscriptions/${id}/change-status`, {
			method: "PUT",
			body: JSON.stringify({ status: "REJECTED" }),
			isAuthorized: true,
		}).then(() => toast("Subscription rejected."));
	};

	return (
		<div className="mt-20 w-full h-[calc(100vh-80px)] overflow-auto container">
			<div className="flex flex-col gap-2">
				{subscriptions.map((subscription, index) => (
					<Card
						key={index}
						title={subscription.subscriptionCode}
						description={`Status: ${subscription.approvalStatus} - Customer: ${subscription.customerName}`}
					>
						<div className="flex gap-4">
							<Button
								variant="red"
								size="sm"
								onClick={() =>
									handleReject(subscription.id, subscription.approvalStatus)
								}
							>
								Reject
							</Button>
							<Button
								variant="green"
								size="sm"
								onClick={() =>
									handleApprove(subscription.id, subscription.approvalStatus)
								}
							>
								Approve
							</Button>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default SubscriptionsModule;
