import { YoutubeDeckContext } from "@/context/sqlite/YoutubeDeck";
import type { General } from "@eiketsu-taisen-tool/data/types";
import React from "react";

type Youtube = {
	title: string;
	video_url: string;
	thumbnail_url: string;
	player1: {
		decks: {
			no: string;
			name: string;
		}[];
	};
	player2: {
		decks: {
			no: string;
			name: string;
		}[];
	};
};

type Args = {
	general: General;
};

export const useLogic = ({ general }: Args) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const { youtubeDeckDB } = React.useContext(YoutubeDeckContext);

	const [youtube, setYoutube] = React.useState<Youtube[]>([]);

	const onYouTubeClick: React.MouseEventHandler<
		HTMLButtonElement
	> = async () => {
		setIsOpen(true);

		if (!youtubeDeckDB) return;

		document.body.style.overflow = "hidden";

		const allSelect = await youtubeDeckDB
			.selectFrom("decks")
			.selectAll()
			.where("no", "=", general.no)
			.execute();

		const youtubeVideos = await Promise.all(
			allSelect.map(async (deck) => {
				const playerDeck1 = await youtubeDeckDB
					.selectFrom("decks")
					.selectAll()
					.where("video_url", "=", deck.video_url)
					.where("player", "=", 1)
					.execute();

				const playerDeck2 = await youtubeDeckDB
					.selectFrom("decks")
					.selectAll()
					.where("video_url", "=", deck.video_url)
					.where("player", "=", 2)
					.execute();

				return {
					title: deck.title,
					video_url: deck.video_url,
					thumbnail_url: deck.thumbnail_url,
					player1: {
						decks: playerDeck1.map((deck) => ({
							no: deck.no,
							name: deck.name,
						})),
					},
					player2: {
						decks: playerDeck2.map((deck) => ({
							no: deck.no,
							name: deck.name,
						})),
					},
				};
			}),
		);

		setYoutube(youtubeVideos);
	};

	const onDialogCloseClick: React.MouseEventHandler<HTMLButtonElement> = (
		e,
	) => {
		e.preventDefault();
		e.stopPropagation();

		document.body.style.overflow = "auto";

		setIsOpen(false);
	};

	return {
		isOpen,
		onYouTubeClick,
		onDialogCloseClick,
		youtube,
	};
};
