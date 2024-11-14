"use client";

import { GeneralImageButton } from "@/components/Buttons/GeneralImageButton";
import Image from "next/image";
import type React from "react";
import { useLogic } from "./logic";

export const CameraAnalyze: React.FC = () => {
	const {
		generalCardImageTFModel,
		refVideo,
		refVideoCanvas,
		refSelectedCardCanvas,
		devices,
		device,
		selectedCard,
		onChangeDeviceSelect,
		onTouchStartVideoCanvas,
		onTouchMoveVideoCanvas,
		onTouchEndVideoCanvas,
		onMouseDownVideoCanvas,
		onMouseMoveVideoCanvas,
		onMouseUpVideoCanvas,
		onClickSelectedCardButton,
	} = useLogic();

	return (
		<div>
			<div className="fixed z-10 p-1">
				<select onChange={onChangeDeviceSelect}>
					<option value={0}>
						{generalCardImageTFModel
							? "カメラ選択してください"
							: "読み込み中..."}
					</option>
					{devices.map((device, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<option key={index} value={device.deviceId}>
							{device.label}
						</option>
					))}
				</select>
			</div>

			<div className={device ? "py-1" : "hidden"}>
				<video muted autoPlay playsInline ref={refVideo} className="h-0" />

				<div className="relative">
					<div className="w-full">
						<canvas
							ref={refVideoCanvas}
							onTouchStart={onTouchStartVideoCanvas}
							onTouchMove={onTouchMoveVideoCanvas}
							onTouchEnd={onTouchEndVideoCanvas}
							onMouseDown={onMouseDownVideoCanvas}
							onMouseMove={onMouseMoveVideoCanvas}
							onMouseUp={onMouseUpVideoCanvas}
							className="w-full"
						/>
					</div>

					<div className="absolute top-0 right-0 w-3/12 h-full bg-[rgba(255,255,255,0.2)]">
						<div className="flex flex-col gap-1 w-full h-full">
							<div className="flex flex-col gap-1 text-xs p-1 pt-8 bg-[#efe6cb]">
								<p>範囲選択結果</p>

								<div className="flex flex-col gap-1">
									{selectedCard.loading && <p>読み込み中...</p>}

									<p>
										{selectedCard.general
											? `${selectedCard.general.no}_${selectedCard.general.name}`
											: "未検出"}
									</p>

									<div>
										{selectedCard.general ? (
											<GeneralImageButton general={selectedCard.general} />
										) : (
											<Image
												src="/eiketsu-taisen-tool/images/no_images/general.jpg"
												alt="未検出"
												width={32}
												height={40}
											/>
										)}
									</div>
								</div>
							</div>

							<div className="w-full h-1/2 flex justify-end">
								<canvas
									ref={refSelectedCardCanvas}
									className="max-w-full max-h-fit w-auto h-auto border-2 border-red-600"
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="fixed bottom-0 w-full p-1 flex gap-2 justify-center">
					<button
						type="button"
						onClick={onClickSelectedCardButton}
						className="text-black text-xl p-4 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
					>
						📸
					</button>

					<button
						type="button"
						// onClick={onClickSelectedCardButton}
						className="text-xl p-4 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
					>
						<span className="flex items-center justify-center w-[16px] h-[16px] p-[2px] text-xs rounded-full cursor-pointer text-[#eb4926] bg-[#f3b33e]">
							★
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};
