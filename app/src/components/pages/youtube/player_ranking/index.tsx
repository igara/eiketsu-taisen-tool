import { PlayerRanking } from "@/components/pages/youtube/player_ranking/PlayerRanking";
import { YoutubeDeckProvider } from "@/context/sqlite/YoutubeDeck";

export const YouTubePlayerRanking: React.FC = () => {
	return (
		<YoutubeDeckProvider>
			<main>
				<PlayerRanking />
			</main>
		</YoutubeDeckProvider>
	);
};

export default YouTubePlayerRanking;
