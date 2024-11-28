"use client";

import type React from "react";
import { useLogic } from "./logic";

type Props = {
	decks: {
		no: string;
		name: string;
	}[];
};

export const DeckLink: React.FC<Props> = ({ decks }) => {
	const { url } = useLogic({
		decks,
	});

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
		>
			デッキ詳細
		</a>
	);
};
