import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/elements/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Snackventure",
	description: "Savor your adventure, One box at a time!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
