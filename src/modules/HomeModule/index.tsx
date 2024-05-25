"use client";

import React from "react";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomeModule = () => {
	const { isAuthenticated, isLoading } = useAuthContext();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated && !isLoading) {
			router.push("/");
		}
	}, [isAuthenticated, isLoading, router]);

	return <div>home</div>;
};

export default HomeModule;
