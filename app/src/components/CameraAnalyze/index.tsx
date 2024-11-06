"use client";

import type React from "react";
import { useLogic } from "./logic";

export const CameraAnalyze: React.FC = () => {
	const {
		generalCardImageHashDB,
		refVideo,
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
				<video muted autoPlay playsInline ref={refVideo} className="w-4/12" />
			</div>
		</div>
	);
};
