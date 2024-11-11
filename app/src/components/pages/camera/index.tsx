"use client";

import { CameraAnalyze } from "@/components/CameraAnalyze";
import { GeneralCardImageTFModelProvider } from "@/context/tensorflow/GeneralCardImageTFModel";
import type React from "react";

export const Camera: React.FC = () => {
	return (
		<GeneralCardImageTFModelProvider>
			<main>
				<CameraAnalyze />
			</main>
		</GeneralCardImageTFModelProvider>
	);
};

export default Camera;
