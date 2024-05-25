import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPageModule = () => {
	return (
		<div className="relative max-w-[1440px] mx-auto w-full flex flex-col items-center">
			<Image
				src="/Images/LandingPageDecoration.svg"
				alt="Landing Page Decoration"
				width={1000}
				height={300}
				className="object-contain"
			/>
			<Link href={"/auth/register"}>
				<Button className="px-[100px] py-4 text-2xl mt-[-32px]">
					Start your snackventure!
				</Button>
			</Link>
			<h1 className="text-3xl font-semibold text-center mt-8">Snackventure</h1>
			<h2 className="text-xl text-center mt-2">
				Savor your adventure, One box at a time!
			</h2>
		</div>
	);
};

export default LandingPageModule;
