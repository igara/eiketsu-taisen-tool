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
		devices,
		device,
		onChangeDeviceSelect,
		onTouchStartVideoCanvas,
		onTouchMoveVideoCanvas,
		onTouchEndVideoCanvas,
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
							className="w-full"
						/>
					</div>

					<div className="absolute top-0 right-0 w-3/12 h-full bg-[#efe6cb]">
						<div className="w-full">
							<p className="text-xs p-1">自動検出</p>
							<canvas ref={refAutoCardCanvas} className="w-full" />
						</div>

						<div className="w-full">
							<p className="text-xs p-1">範囲選択</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
