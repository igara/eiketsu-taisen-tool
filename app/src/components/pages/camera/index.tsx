"use client";

import { CameraAnalyze } from "@/components/CameraAnalyze";
import { GeneralCardImageDescriptorProvider } from "@/context/sqlite/GeneralCardImageDescriptor";
import type React from "react";

export const Camera: React.FC = () => {
	return (
		<GeneralCardImageDescriptorProvider>
			<main>
				<CameraAnalyze />
			</main>
		</GeneralCardImageDescriptorProvider>
	);
};

export default Camera;
