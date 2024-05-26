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
	customerName?: string;
}

export interface UserProps {
	id: string;
	username: string;
	email: string;
	phoneNumber: string;
	address: string;
	userRole: string;
}
