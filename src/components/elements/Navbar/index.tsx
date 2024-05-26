import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "@/components/contexts/AuthContext";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { LogOut } from "lucide-react";

export const Navbar = () => {
	const { isAuthenticated, userRoles, username, logout } = useAuthContext();
	const pathName = usePathname();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const currentPage = () => {
		if (pathName === "/") {
			return "LandingPage";
		} else if (pathName.startsWith("/snackboxes")) {
			return "SnackBoxes";
		} else if (pathName.startsWith("/snacks")) {
			return "Snacks";
		} else if (pathName.startsWith("/reviews")) {
			return "Reviews";
		} else if (pathName.startsWith("/subscriptions")) {
			return "Subscriptions";
		} else {
			return "Other";
		}
	};

	if (!isAuthenticated || currentPage() === "LandingPage") {
		return;
	}

	const logoLink = userRoles.includes("ADMIN") ? "/snackboxes" : "/home";

	const handleProfileClick = () => {
		setDropdownOpen(!dropdownOpen);
	};

	if (userRoles.includes("CUSTOMER")) {
		return (
			<nav className="py-4 fixed flex justify-center w-full text-black">
				<div className="container flex justify-between items-center text-lg">
					<Link href={logoLink}>
						<Image
							src={"/Images/logo.svg"}
							alt="Logo"
							width={200}
							height={30}
						/>
					</Link>
					<div className="relative">
						<button onClick={handleProfileClick} className="flex items-center">
							<Image
								src={"/Images/ProfilePic.png"}
								alt="Profile"
								width={45}
								height={45}
							/>
						</button>
						{dropdownOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray border-opacity-40 divide-y divide-gray rounded-md shadow-lg">
								<div className="px-4 py-2 text-sm font-bold">{username}</div>
								<Link
									href="/profile"
									className="block px-4 py-2 text-sm hover:bg-gray hover:bg-opacity-20"
								>
									Profile
								</Link>
								<Link
									href="/my-snack-box"
									className="block px-4 py-2 text-sm hover:bg-gray hover:bg-opacity-20"
								>
									My Snack Box
								</Link>
								<Link
									href="/my-reviews"
									className="block px-4 py-2 text-sm hover:bg-gray hover:bg-opacity-20"
								>
									My Reviews
								</Link>
								<button
									onClick={logout}
									className="flex items-center w-full text-left px-4 py-2 text-sm bg-red bg-opacity-10 hover:bg-opacity-20"
								>
									<LogOut size={20} className="mr-2" />
									Logout
								</button>
							</div>
						)}
					</div>
				</div>
			</nav>
		);
	}

	return (
		<nav className="py-4 fixed flex justify-center w-full text-black">
			<div className="container flex justify-between items-center text-lg">
				<Link href={logoLink}>
					<Image src={"/Images/logo.svg"} alt="Logo" width={200} height={30} />
				</Link>
				<Link
					href={"/snackboxes"}
					className={`font-[500] ${
						currentPage() === "SnackBoxes" ? "text-[#A6A6A6]" : ""
					}`}
				>
					SnackBoxes
				</Link>
				<Link
					href={"/snacks"}
					className={`font-[500] ${
						currentPage() === "Snacks" ? "text-[#A6A6A6]" : ""
					}`}
				>
					Snacks
				</Link>
				<Link
					href={"/reviews"}
					className={`font-[500] ${
						currentPage() === "Reviews" ? "text-[#A6A6A6]" : ""
					}`}
				>
					Reviews
				</Link>
				<Link
					href={"/subscriptions"}
					className={`font-[500] ${
						currentPage() === "Subscriptions" ? "text-[#A6A6A6]" : ""
					}`}
				>
					Subscriptions
				</Link>
				<button onClick={logout} className="font-[500] flex items-center">
					<LogOut size={24} className="mr-2" />
					Logout
				</button>
			</div>
		</nav>
	);
};
