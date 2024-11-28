import { YouTubePlayerRanking } from "@/components/pages/youtube/player_ranking";
import { Suspense } from "react";

export default function Youtube() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<YouTubePlayerRanking />
		</Suspense>
	);
}
