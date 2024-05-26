"use client";

import React from "react";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionProps } from "./interface";
import Card from "@/components/elements/Card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MySnackBoxModule = () => {
	const { isAuthenticated, isLoading, userRoles, userId, customFetch } =
		useAuthContext();
	const router = useRouter();
	const [subscriptions, setSubscriptions] = React.useState<SubscriptionProps[]>(
		[]
	);
	const [filterStatus, setFilterStatus] = React.useState<string>("");

	useEffect(() => {
		if (!isLoading && (!isAuthenticated || !userRoles.includes("CUSTOMER"))) {
			router.push("/");
		}
	}, [isAuthenticated, isLoading, router, userRoles]);

	useEffect(() => {
		if (!userId) return;
		customFetch<SubscriptionProps[]>(
			"http://35.198.232.212",
			`/subscriptions/customer/${userId}`,
			{
				isAuthorized: true,
			}
		).then((response) => {
			const responseData = Object.values(response);
			const subscriptions = responseData.slice(0, responseData.length - 1);

			Promise.all(
				subscriptions.map((subscription) =>
					customFetch(
						"http://34.87.37.109",
						`/subscription-box/${subscription.subscriptionBoxId}`,
						{
							isAuthorized: true,
						}
					).then((box: any) => ({
						name: box.name,
						imageUrl: box.imageUrl,
						country: box.country,
					}))
				)
			).then((boxes) => {
				const subscriptionsWithBox = subscriptions.map(
					(subscription, index) => {
						return {
							...subscription,
							boxName: boxes[index].name,
							boxImageUrl: boxes[index].imageUrl,
							boxCountry: boxes[index].country,
						};
					}
				);
				setSubscriptions(subscriptionsWithBox);
			});
		});
	});

	const unsubscribe = (subscriptionId: string, subscriptionStatus: string) => {
		if (subscriptionStatus === "CANCELLED") {
			toast(
				"You can't unsubscribe because the subscription is already cancelled."
			);
			return;
		}

		customFetch(
			"http://35.198.232.212",
			`/subscriptions/${subscriptionId}/unsubscribe`,
			{
				method: "PUT",
				isAuthorized: true,
			}
		).then(() => {
			toast("Unsubscribed successfully.");
		});
	};

	const filteredSubscriptions = React.useMemo(() => {
		if (filterStatus === "") {
			return subscriptions;
		} else {
			return subscriptions.filter(
				(subscription) => subscription.subscriptionStatus === filterStatus
			);
		}
	}, [filterStatus, subscriptions]);

	return (
		<div className="flex justify-center">
			<select
				className="w-52 h-8 my-2 mt-5 px-2 border rounded border-gray fixed top-0"
				value={filterStatus}
				onChange={(e) => setFilterStatus(e.target.value)}
			>
				<option value="">All</option>
				<option value="PENDING">Pending</option>
				<option value="CANCELLED">Cancelled</option>
				<option value="SUBSCRIBED">Subscribed</option>
			</select>
			<div className="mt-20 w-full h-[calc(100vh-80px)] overflow-auto container">
				<div className="flex flex-col gap-2">
					{filteredSubscriptions.map((subscription, index) => (
						<Card
							key={index}
							imageUrl={subscription.boxImageUrl}
							title={`${subscription.boxName} (${subscription.boxCountry}) | Subscription Code: ${subscription.subscriptionCode}`}
							description={`Frequency: ${subscription.frequency} | Status: ${
								subscription.subscriptionStatus
							} | Approval: ${subscription.approvalStatus} | Start: ${
								subscription.startDate
									? new Date(subscription.startDate).toLocaleDateString()
									: "N/A"
							} | End: ${
								subscription.endDate
									? new Date(subscription.endDate).toLocaleDateString()
									: "N/A"
							}`}
						>
							<Button
								variant="red"
								onClick={() =>
									unsubscribe(subscription.id, subscription.subscriptionStatus)
								}
							>
								Unsubscribe
							</Button>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default MySnackBoxModule;
