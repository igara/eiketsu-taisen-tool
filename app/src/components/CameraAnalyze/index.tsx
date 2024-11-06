"use client";

import type React from "react";
import { useLogic } from "./logic";

export const CameraAnalyze: React.FC = () => {
	const {
		generalCardImageHashDB,
		refVideo,
		refVideoCanvas,
		refMonoCanvas,
		refAutoCardCanvas,
		refSelectedCardCanvas,
		devices,
		device,
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
			<div className="p-1">
				<select onChange={onChangeDeviceSelect}>
					<option value={0}>
						{generalCardImageHashDB
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
				<canvas ref={refMonoCanvas} className="hidden" />

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
						<div className="w-full h-1/2">
							<p className="text-xs p-1 bg-[#efe6cb]">自動検出</p>
							<div className="h-1/2 flex justify-end">
								<canvas
									ref={refAutoCardCanvas}
									className="max-w-full max-h-full w-auto h-auto border-2 border-red-600"
								/>
							</div>
						</div>

						<div className="w-full h-1/2">
							<p className="text-xs p-1 bg-[#efe6cb]">範囲選択</p>

							<div className="h-1/2 flex justify-end">
								<canvas
									ref={refSelectedCardCanvas}
									className="max-w-full max-h-full w-auto h-auto border-2 border-red-600"
								/>
							</div>

							<div className="p-1 flex justify-end">
								<button
									type="button"
									onClick={onClickSelectedCardButton}
									className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
								>
									切り取る
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
