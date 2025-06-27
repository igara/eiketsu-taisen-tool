"use client";

import type { SearchFormData } from "@/schema/SearchForm";
import type { General } from "@eiketsu-taisen-tool/data/types";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import { GeneralDetailButton } from "../GeneralDetailButton";
import { GeneralImageButton } from "../GeneralImageButton";
import { DeckLink } from "./DeckLink";
import { useLogic } from "./logic";

type Props = {
	general: General;
	favorite?: {
		formMethod: UseFormReturn<SearchFormData>;
		defaultSearchFavoriteNos: SearchFormData["favoriteNo"];
	};
	date?: {
		from: string;
		to: string;
	};
};

export const YouTubeGeneralCardButton: React.FC<Props> = ({
	general,
	favorite,
	date,
}) => {
	const {
		isOpen,
		onClickYouTubeButton,
		onClickDialogCloseButton,
		onClickDialog,
		youtube,
		isLoading,
		refContentDivElement,
	} = useLogic({
		general,
		date,
	});

	return (
		<>
			<button
				type="button"
				onClick={onClickYouTubeButton}
				className="underline text-start"
			>
				YouTube 頂上対決
			</button>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<dialog
				open={isOpen}
				className={
					isOpen
						? "fixed z-[999] left-0 top-0 flex items-center justify-center w-[100dvw] h-[100dvh] bg-[rgba(0,0,0,0.5)]"
						: "hidden"
				}
				onClick={onClickDialog}
			>
				<div
					className="flex flex-col gap-1 w-10/12 h-5/6 p-3 rounded bg-white"
					ref={refContentDivElement}
				>
					<div className="flex items-center">
						<p className="w-full text-sm">{general.name}を使用している動画</p>

						<button
							type="button"
							onClick={onClickDialogCloseButton}
							className="w-[28px] h-[28px] m-auto text-sm text-white p-1 bg-gray-600 rounded"
						>
							×
						</button>
					</div>

					<div className="h-[calc(100%-40px)] overflow-y-auto">
						{isLoading && <p>読み込み中...</p>}

						{!isLoading && youtube.length === 0 && <p>動画がありません。</p>}

						{!isLoading &&
							youtube.map((video, index) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									className="py-2 flex flex-col items-start gap-1 border-b-2 border-black"
								>
									<a
										href={video.video_url}
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										{video.title}
									</a>

									<div className="p-1 w-full flex justify-between">
										<div className="flex flex-col gap-1">
											<div className="flex flex-col gap-1">
												{video.player1.decks.map((deck) => (
													<GeneralDetailButton
														key={deck.no}
														gene={{
															name: deck.name,
															no: deck.no,
														}}
														favorite={favorite}
														date={date}
													/>
												))}
											</div>
											<div className="grid grid-cols-4 gap-1">
												{video.player1.decks.map((deck) => (
													<div key={deck.no} className="w-[32px]">
														<GeneralImageButton general={deck} />
													</div>
												))}
											</div>
										</div>

										<div className="flex items-center p-1 bg-red-600 rounded">
											<DeckLink decks={video.player1.decks} />
										</div>
									</div>

									<div className="p-1 w-full flex justify-between">
										<div className="flex flex-col gap-1">
											<div className="flex flex-col gap-1">
												{video.player2.decks.map((deck) => (
													<GeneralDetailButton
														key={deck.no}
														gene={{
															name: deck.name,
															no: deck.no,
														}}
														favorite={favorite}
													/>
												))}
											</div>
											<div className="grid grid-cols-4 gap-1">
												{video.player2.decks.map((deck) => (
													<div key={deck.no} className="w-[32px]">
														<GeneralImageButton general={deck} />
													</div>
												))}
											</div>
										</div>

										<div className="flex items-center bg-blue-600 rounded p-1">
											<DeckLink decks={video.player2.decks} />
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</dialog>
		</>
	);
};
