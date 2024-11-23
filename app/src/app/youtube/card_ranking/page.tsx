import { YouTubeCardRanking } from "@/components/pages/youtube/card_ranking";
import { Suspense } from "react";

export default function Youtube() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<YouTubeCardRanking />
		</Suspense>
	);
}
