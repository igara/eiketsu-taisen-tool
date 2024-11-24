"use client";

import type React from "react";
import { useLogic } from "./logic";

export const SegaCopyrightButton: React.FC = () => {
	const {
		isOpen,
		onClickButton,
		onClickDialogCloseButton,
		onClickDialog,
		refContentDivElement,
	} = useLogic();

	return (
		<>
			<button
				type="button"
				onClick={onClickButton}
				className="underline text-white text-start p-1 rounded"
			>
				©SEGA
			</button>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<dialog
				open={isOpen}
				className={
					isOpen
						? "fixed z-[999] left-0 top-0 flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.5)]"
						: "hidden"
				}
				onClick={onClickDialog}
			>
				<div
					className="flex flex-col gap-1 p-3 rounded bg-white"
					ref={refContentDivElement}
				>
					<div className="flex items-center">
						<p className="w-full text-sm">このサイトは</p>

						<button
							type="button"
							onClick={onClickDialogCloseButton}
							className="w-[28px] h-[28px] m-auto text-sm text-white p-1 bg-gray-600 rounded"
						>
							×
						</button>
					</div>

					<p>本ツールは個人が作成した非公式のツールです。</p>
					<p>
						利用している画像やデータの著作権は
						<a
							href="https://www.sega.co.jp/"
							target="_blank"
							rel="noopener noreferrer"
							className="underline"
						>
							株式会社セガ
						</a>
						にあります。
					</p>
				</div>
			</dialog>
		</>
	);
};
