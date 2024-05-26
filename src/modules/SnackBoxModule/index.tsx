"use client";

import React from "react";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SnackBoxModule = () => {
	const { isAuthenticated, isLoading, userRoles } = useAuthContext();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && (!isAuthenticated || !userRoles.includes("CUSTOMER"))) {
			router.push("/");
		}
	}, [isAuthenticated, isLoading, router, userRoles]);

	return (
		<div className="mt-20 w-full h-[calc(100vh-80px)] overflow-auto container">
			SnackBoxModule
		</div>
	);
};

export default SnackBoxModule;
