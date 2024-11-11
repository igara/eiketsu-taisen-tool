"use client";

import * as tf from "@tensorflow/tfjs";
import React from "react";
import { createContext } from "react";

export interface GeneralCardImageTFModelProviderProps {
	children: React.ReactNode;
}

const GeneralCardImageTFModelContext = createContext<{
	generalCardImageTFModel: tf.LayersModel | null;
}>({
	generalCardImageTFModel: null,
});

function GeneralCardImageTFModelProvider({
	children,
}: GeneralCardImageTFModelProviderProps) {
	const [generalCardImageTFModel, setGeneralCardImageTFModel] =
		React.useState<tf.LayersModel | null>(null);

	React.useEffect(() => {
		const loadModel = async () => {
			const loadedModel = await tf.loadLayersModel(
				"/eiketsu-taisen-tool/tensorflow/general-image/model.json",
			);
			setGeneralCardImageTFModel(loadedModel);
		};
		loadModel();
	}, []);

	return (
		<GeneralCardImageTFModelContext.Provider
			value={{
				generalCardImageTFModel,
			}}
		>
			{children}
		</GeneralCardImageTFModelContext.Provider>
	);
}

export { GeneralCardImageTFModelContext, GeneralCardImageTFModelProvider };
