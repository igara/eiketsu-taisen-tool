'use client';

import { GeneralTable } from "@/components/pages/index/GeneralTable";
import { YoutubeDeckProvider } from "@/context/sqlite/YoutubeDeck";
import { Suspense } from "react";

export const Index: React.FC = () => {
	return (
		<YoutubeDeckProvider>
			<Suspense fallback={<div>Loading...</div>}>
				<main>
					<GeneralTable />
				</main>
			</Suspense>
		</YoutubeDeckProvider>
	);
};

export default Index;
