"use client";

import type React from "react";
import { useLogic } from "./logic";

export const CameraAnalyze: React.FC = () => {
	const {
		generalCardImageHashDB,
		refVideo,
		refVideoCanvas,
		refMonoCanvas,
		refCardCanvas,
		devices,
		device,
		onChangeDeviceSelect,
	} = useLogic();

	return (
		<div>
			<div>
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

			<div className={device ? "" : "hidden"}>
				<video muted autoPlay playsInline ref={refVideo} />
				<canvas ref={refVideoCanvas} className="hidden" />
				<canvas ref={refMonoCanvas} className="hidden" />
				<canvas ref={refCardCanvas} />
			</div>
		</div>
	);
};
