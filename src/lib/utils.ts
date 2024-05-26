import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtVerify } from "jose";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function jwtIsValid(token: string) {
	try {
		const { payload } = await jwtVerify(token, getSecret());
		return payload;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export function extractDetails(token: string) {
	if (token) {
		const payload = token.split(".")[1];
		const details = JSON.parse(atob(payload));
		return {
			username: details.sub,
			userId: details.userId,
			roles: details.roles,
		};
	} else {
		return {
			username: "",
			userId: "",
			roles: [],
		};
	}
}

function getSecret() {
	const base64 = process.env.JWT_SECRET!;
	const binaryString = Buffer.from(base64, "base64").toString("binary");
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
}
