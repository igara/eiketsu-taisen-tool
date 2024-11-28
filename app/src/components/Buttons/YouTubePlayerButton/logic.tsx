import { YoutubeDeckContext } from "@/context/sqlite/YoutubeDeck";
import dayjs from "dayjs";
import { sql } from "kysely";
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
	playerName: string;
	date?: {
		from: string;
		to: string;
	};
};

export const useLogic = ({ playerName, date }: Args) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const refContentDivElement = React.useRef<HTMLDivElement>(null);
	const { youtubeDeckDB } = React.useContext(YoutubeDeckContext);
	const [isLoading, setIsLoading] = React.useState(false);

	const [youtube, setYoutube] = React.useState<Youtube[]>([]);

	const onClickYouTubeButton: React.MouseEventHandler<
		HTMLButtonElement
	> = async () => {
		setIsOpen(true);
		setIsLoading(true);

		if (!youtubeDeckDB) return;

		document.body.style.overflow = "hidden";

		const allSelect = await youtubeDeckDB
			.selectFrom("decks")
			.selectAll()
			.where("player_name", "=", playerName)
			.where(sql<boolean>`create_at >= ${date?.from || "2022-03-11"}`)
			.where(
				sql<boolean>`create_at <= ${date?.to || dayjs().format("YYYY-MM-DD")}`,
			)
			.groupBy(["title", "player_name"])
			.orderBy("create_at", "desc")
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
		setIsLoading(false);
	};

	const onClickDialogCloseButton: React.MouseEventHandler<HTMLButtonElement> = (
		e,
	) => {
		e.preventDefault();
		e.stopPropagation();

		document.body.style.overflow = "auto";

		setIsOpen(false);
		setYoutube([]);
	};

	const onClickDialog = (e: React.MouseEvent<HTMLDialogElement>) => {
		if (!refContentDivElement.current) return;

		if (!refContentDivElement.current.contains(e.target as Node)) {
			setIsOpen(false);
			document.body.style.overflow = "auto";
		}
	};

	return {
		isOpen,
		onClickYouTubeButton,
		onClickDialogCloseButton,
		onClickDialog,
		youtube,
		isLoading,
		refContentDivElement,
	};
};
