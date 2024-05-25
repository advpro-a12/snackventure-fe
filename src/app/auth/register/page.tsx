"use client";

import React, { useState } from "react";
import Link from "next/link";

const RegisterPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [address, setAddress] = useState("");

	const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const response = await fetch("http://34.87.81.229/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
				email,
				phoneNumber,
				address,
			}),
		});

		const message = await response.text();

		if (response.status === 200) {
			// Registration was successful
			alert("Registration successful: " + message);
		} else if (response.status === 400) {
			// Username is already taken
			alert("Error: " + message);
		} else {
			// Some other error occurred
			alert("An error occurred: " + message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
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
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
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
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
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
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Phone Number"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
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
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Register
						</button>
					</div>
				</form>
				<div>
					<p className="mt-2 text-center text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							href="/auth/login"
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
