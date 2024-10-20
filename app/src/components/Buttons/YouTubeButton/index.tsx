"use client";

import type { General } from "@eiketsu-taisen-tool/data/types";
import Link from "next/link";
import type React from "react";
import { DeckLink } from "./DeckLink";
import { useLogic } from "./logic";

type Props = {
	general: General;
};

export const YouTubeButton: React.FC<Props> = ({ general }) => {
	const { isOpen, onYouTubeClick, onDialogCloseClick, youtube, isLoading } =
		useLogic({
			general,
		});

	return (
		<div>
			<button type="button" onClick={onYouTubeClick} className="underline">
				YouTube 頂上対決
			</button>

			<dialog
				open={isOpen}
				className={
					isOpen
						? "fixed z-[999] left-0 top-0 flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.5)]"
						: "hidden"
				}
			>
				<div className="w-10/12 h-5/6 p-3 rounded bg-white">
					<div className="flex items-center">
						<p className="w-full text-sm">{general.name}を使用している動画</p>

						<button
							type="button"
							onClick={onDialogCloseClick}
							className=" m-auto text-sm text-white p-2 bg-gray-600 rounded"
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

									<div className="p-1 w-full flex justify-between bg-red-600 rounded">
										<div>
											{video.player1.decks.map((deck) => (
												<p key={deck.no} className="text-white">
													{deck.no} {deck.name}
												</p>
											))}
										</div>

										<div className="flex items-center">
											<DeckLink decks={video.player1.decks} />
										</div>
									</div>

									<div className="p-1 w-full flex justify-between bg-blue-600 rounded">
										<div>
											{video.player2.decks.map((deck) => (
												<p key={deck.no} className="text-white">
													{deck.no} {deck.name}
												</p>
											))}
										</div>

										<div className="flex items-center">
											<DeckLink decks={video.player2.decks} />
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</dialog>
		</div>
	);
};
