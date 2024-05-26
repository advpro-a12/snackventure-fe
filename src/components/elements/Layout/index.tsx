"use client";
import React from "react";
import { LayoutProps } from "./interface";
import { Navbar } from "../Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthContextProvider } from "@/components/contexts/AuthContext";

const Layout = ({ children }: LayoutProps) => {
	return (
		<AuthContextProvider>
			<Navbar />
			<Toaster />
			<main className="min-h-screen flex justify-center h-full">
				{children}
			</main>
		</AuthContextProvider>
	);
};

export default Layout;
