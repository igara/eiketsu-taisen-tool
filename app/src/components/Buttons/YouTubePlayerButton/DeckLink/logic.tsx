import { pathInfo } from "@/lib/pathInfo";

type Args = {
	decks: {
		no: string;
		name: string;
	}[];
};

export const useLogic = ({ decks }: Args) => {
	const searchParams = new URLSearchParams();

	for (const deck of decks) {
		searchParams.append(pathInfo["/"].searchParams["favoriteNo[]"], deck.no);
	}
	searchParams.append(pathInfo["/"].searchParams.isDisplayFavorite, "true");

	const url = `/eiketsu-taisen-tool/?${searchParams.toString()}`;

	return {
		url,
	};
};
