"use client";

import { CameraAnalyze } from "@/components/CameraAnalyze";
import { GeneralCardImageHashProvider } from "@/context/duckdb/GeneralCardImageHash";
import type React from "react";

export const Camera: React.FC = () => {
	return (
		<GeneralCardImageHashProvider>
			<main>
				<CameraAnalyze />
			</main>
		</GeneralCardImageHashProvider>
	);
};

export default Camera;
