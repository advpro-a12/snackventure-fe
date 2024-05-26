export interface SubscriptionProps {
	id: string;
	createdAt: string;
	subscriptionCode: string;
	approvalStatus: string;
	subscriptionStatus: string;
	frequency: string;
	startDate: string | null;
	endDate: string | null;
	customerId: string;
	subscriptionBoxId: string;
	boxImageUrl?: string;
	boxName?: string;
	boxCountry?: string;
}
