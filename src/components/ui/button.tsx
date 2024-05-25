import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva("w-max h-full font-semibold transition-all", {
	variants: {
		variant: {
			main: "bg-main text-[#FFEDFD] hover:shadow-[0_4px_12px_0_rgba(153,145,156,0.40)] active:shadow-[0_0_20px_0_rgba(100,100,100,0.40)_inset]",
			pink: "bg-pink text-[#FFEDFD] hover:shadow-[0_4px_12px_0_rgba(153,145,156,0.40)] active:shadow-[0_0_20px_0_rgba(100,100,100,0.40)_inset]",
			yellow:
				"bg-yellow text-[#FFEDFD] hover:shadow-[0_4px_12px_0_rgba(153,145,156,0.40)] active:shadow-[0_0_20px_0_rgba(100,100,100,0.40)_inset]",
			blue: "bg-blue text-[#FFEDFD] hover:shadow-[0_4px_12px_0_rgba(153,145,156,0.40)] active:shadow-[0_0_20px_0_rgba(100,100,100,0.40)_inset]",
			gray: "bg-gray text-[#FFEDFD] hover:shadow-[0_4px_12px_0_rgba(153,145,156,0.40)] active:shadow-[0_0_20px_0_rgba(100,100,100,0.40)_inset]",
			green:
				"bg-green text-[#FFEDFD] hover:shadow-[0_4px_12px_0_rgba(153,145,156,0.40)] active:shadow-[0_0_20px_0_rgba(100,100,100,0.40)_inset]",
			red: "bg-red text-[#FFEDFD] hover:shadow-[0_4px_12px_0_rgba(153,145,156,0.40)] active:shadow-[0_0_20px_0_rgba(100,100,100,0.40)_inset]",
		},
		size: {
			main: "px-8 py-3 text-base rounded-lg",
			sm: "px-5 py-2 text-sm rounded-md",
		},
	},
	defaultVariants: {
		variant: "main",
		size: "main",
	},
});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
