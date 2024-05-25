"use client";

import React, { useEffect, useState } from "react";
import { LoginFormData } from "./interface";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginModule: React.FC = () => {
	const { login, isAuthenticated } = useAuthContext();
	const [formData, setFormData] = useState<LoginFormData>({
		username: "",
		password: "",
	});

	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login(formData);
	};

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/home");
		}
	}, [isAuthenticated, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
				<div>
					<h2 className="text-center text-3xl font-semibold text-gray-900">
						Log in to Continue
					</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleLogin}>
					<input type="hidden" name="remember" value="true" />
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="username" className="sr-only">
								Username
							</label>
							<input
								id="username"
								name="username"
								type="text"
								required
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:border-2 focus:ring-main focus:border-main focus:z-10 sm:text-sm"
								placeholder="Username"
								value={formData.username}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:border-2 focus:ring-main focus:border-main focus:z-10 sm:text-sm"
								placeholder="Password"
								value={formData.password}
								onChange={handleInputChange}
							/>
						</div>
					</div>
					<div>
						<Button type="submit" className="w-full">
							Log In
						</Button>
					</div>
				</form>
				<div>
					<p className="mt-2 text-center text-sm text-gray-600">
						Don&apos;t have an account?{" "}
						<Link href="/auth/register" className="font-medium text-main">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginModule;
