import { createContext, useContext, useEffect, useState } from "react";
import {
	AuthContextInterface,
	AuthContextProviderProps,
	RequestInit,
} from "./interface";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const AuthContext = createContext({} as AuthContextInterface);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const router = useRouter();

	async function customFetch<T = undefined>(
		baseUrl: string,
		url: string,
		options: RequestInit = { isAuthorized: false },
		cookies?: () => ReadonlyRequestCookies
	): Promise<T> {
		const headers = { authorization: "", "Content-Type": "application/json" };
		const fullUrl = new URL(url, baseUrl);

		if (options.isAuthorized) {
			const token = cookies
				? getCookie("AT", { cookies }) // use server
				: getCookie("AT"); // use client
			headers["authorization"] = `Bearer ${token}`;
		}

		const rawResult = await fetch(fullUrl.toString(), {
			headers,
			...options,
		});

		let result;
		try {
			// Try to parse the response as JSON
			result = await rawResult.clone().json();

			if (!rawResult.ok) {
				deleteCookie("AT");
			}
		} catch (error) {
			// If parsing as JSON fails, treat the response as text
			const textResult = await rawResult.text();
			result = { message: textResult };
		}

		return { ...result, status: rawResult.status };
	}

	async function login({
		username,
		password,
	}: {
		username: string;
		password: string;
	}) {
		const response = await customFetch<{
			accessToken: string;
			tokenType: string;
			status: number;
		}>("http://34.87.81.229", "/auth/login", {
			body: JSON.stringify({
				username,
				password,
			}),
			method: "post",
		});

		if (response.status === 200) {
			setCookie("AT", response.accessToken);
			setIsAuthenticated(true);
			router.push("/home");
		} else {
			toast("Username or password is incorrect.");
		}
	}

	async function logout() {
		deleteCookie("AT");
		setIsAuthenticated(false);
		router.replace("/");
	}

	useEffect(() => {
		setIsLoading(true);
		const isAuthenticatedLocalStorage = getCookie("AT");

		if (!isAuthenticatedLocalStorage) {
			setIsAuthenticated(false);
		} else {
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, [router]);

	const contextValue: AuthContextInterface = {
		isAuthenticated,
		setIsAuthenticated,
		isLoading,
		login,
		logout,
		customFetch,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};
