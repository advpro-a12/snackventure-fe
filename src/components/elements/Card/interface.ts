import { ReactNode } from "react";

export interface CardProps {
	imageUrl?: string;
	title: string;
	description?: string;
	children?: ReactNode;
}

export interface CardContentProps {
	title: string;
	description?: string;
	children?: ReactNode;
}
