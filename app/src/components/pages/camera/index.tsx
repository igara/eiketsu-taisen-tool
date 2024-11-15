"use client";

import { CameraAnalyze } from "@/components/pages/camera/CameraAnalyze";
import { YoutubeDeckProvider } from "@/context/sqlite/YoutubeDeck";
import { GeneralCardImageTFModelProvider } from "@/context/tensorflow/GeneralCardImageTFModel";
import type React from "react";

export const Camera: React.FC = () => {
	return (
		<YoutubeDeckProvider>
			<GeneralCardImageTFModelProvider>
				<main>
					<CameraAnalyze />
				</main>
			</GeneralCardImageTFModelProvider>
		</YoutubeDeckProvider>
	);
};

export default Camera;
