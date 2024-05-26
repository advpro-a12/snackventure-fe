import React from "react";
import { CardProps } from "./interface";
import Image from "next/image";

const Card: React.FC<CardProps> = ({
	imageUrl,
	title,
	description,
	children,
}) => {
	return (
		<div className="bg-black bg-opacity-50 text-white p-4 w-full flex justify-between items-center rounded-md gap-4">
			<div className="flex justify-start gap-4 items-center">
				{imageUrl && (
					<Image src={imageUrl} alt={title} width={80} height={80} />
				)}
				<div className="flex flex-col items-start justify-between gap-2">
					<h1 className="font-semibold text-lg">{title}</h1>
					{description && <p>{description}</p>}
				</div>
			</div>
			{children}
		</div>
	);
};

export default Card;
