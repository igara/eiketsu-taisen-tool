import { CardRanking } from "@/components/pages/youtube/card_ranking/CardRanking";
import { YoutubeDeckProvider } from "@/context/sqlite/YoutubeDeck";

export const YouTubeCardRanking: React.FC = () => {
	return (
		<YoutubeDeckProvider>
			<main>
				<CardRanking />
			</main>
		</YoutubeDeckProvider>
	);
};

export default YouTubeCardRanking;
