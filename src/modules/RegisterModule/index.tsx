"use client";

import React, { useState, useEffect } from "react";
import { RegistrationFormData } from "./interface";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RegisterModule: React.FC = () => {
	const { customFetch, isAuthenticated, isLoading } = useAuthContext();
	const router = useRouter();

	const [formData, setFormData] = useState<RegistrationFormData>({
		username: "",
		password: "",
		email: "",
		phoneNumber: "",
		address: "",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		customFetch("http://34.87.81.229", "/auth/register", {
			method: "POST",
			body: JSON.stringify(formData),
		}).then((response) => toast.error(response.message));
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
						Register to Start
					</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleRegister}>
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
								className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-2 focus:ring-main focus:border-main focus:z-10 sm:text-sm"
								placeholder="Username"
								value={formData.username}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor="email" className="sr-only">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-2 focus:ring-main focus:border-main focus:z-10 sm:text-sm"
								placeholder="Email"
								value={formData.email}
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
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-2 focus:ring-main focus:border-main focus:z-10 sm:text-sm"
								placeholder="Password"
								value={formData.password}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor="phoneNumber" className="sr-only">
								Phone Number
							</label>
							<input
								id="phoneNumber"
								name="phoneNumber"
								type="tel"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-2 focus:ring-main focus:border-main focus:z-10 sm:text-sm"
								placeholder="Phone Number"
								value={formData.phoneNumber}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor="address" className="sr-only">
								Address
							</label>
							<input
								id="address"
								name="address"
								type="text"
								required
								className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-2 focus:ring-main focus:border-main focus:z-10 sm:text-sm"
								placeholder="Address"
								value={formData.address}
								onChange={handleInputChange}
							/>
						</div>
					</div>
					<div>
						<Button type="submit" className="w-full">
							Register
						</Button>
					</div>
				</form>
				<div>
					<p className="mt-2 text-center text-sm text-gray-600">
						Already have an account?{" "}
						<Link href="/auth/login" className="font-medium text-main">
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterModule;
