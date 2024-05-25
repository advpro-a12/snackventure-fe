import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			backgroundImage: {},
			colors: {
				main: "#C37070",
				pink: "#FA9797",
				yellow: "#EA8851",
				blue: "#29BBDB",
				gray: "#828282",
				green: "#21C24E",
				red: "#E43B3B",
			},
		},
	},
	plugins: [],
};
export default config;
