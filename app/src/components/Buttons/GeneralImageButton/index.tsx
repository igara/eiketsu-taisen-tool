"use client";

import type React from "react";
import { useLogic } from "./logic";

type Props = {
	general: {
		no: string;
		name: string;
	};
};

export const GeneralImageButton: React.FC<Props> = ({ general }) => {
	const {
		isOpen,
		onClickImageButton,
		onClickDialogCloseButton,
		onClickDialog,
		refContentDivElement,
	} = useLogic();

	return (
		<div>
			<button type="button" onClick={onClickImageButton}>
				<img
					src={`/eiketsu-taisen-tool/images/generals/${general.no}_${general.name}/5.jpg`}
					alt={general.name}
					width={32}
					height={40}
				/>
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
						<p className="w-full text-sm">{general.name}</p>

						<button
							type="button"
							onClick={onClickDialogCloseButton}
							className="w-[28px] h-[28px] m-auto text-sm text-white p-1 bg-gray-600 rounded"
						>
							×
						</button>
					</div>

					<div className="h-[calc(100%-40px)] overflow-y-auto">
						<img
							src={`/eiketsu-taisen-tool/images/generals/${general.no}_${general.name}/5.jpg`}
							alt={general.name}
							width={140}
							height={215}
						/>
					</div>
				</div>
			</dialog>
		</div>
	);
};
