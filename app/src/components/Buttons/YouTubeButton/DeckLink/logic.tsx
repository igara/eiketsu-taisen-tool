import { YoutubeDeckContext } from "@/context/sqlite/YoutubeDeck";
import React from "react";

type Args = {
	decks: {
		no: string;
		name: string;
	}[];
};

export const useLogic = ({ decks }: Args) => {
	const searchParams = new URLSearchParams();

	for (const deck of decks) {
		searchParams.append("favoriteNo[]", deck.no);
	}
	searchParams.append("isDisplayFavorite", "true");

	const url = `/eiketsu-taisen-tool/?${searchParams.toString()}`;

	return {
		url,
	};
};
