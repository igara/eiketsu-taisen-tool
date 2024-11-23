import { YoutubeDeckContext } from "@/context/sqlite/YoutubeDeck";
import {
	type YouTubeCardRankingFormData,
	YouTubeCardRankingFormResolver,
} from "@/schema/YouTubeCardRankingForm";
import { sql } from "kysely";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

type Ranking = {
	no: string;
	name: string;
	no_count: number;
	rank: number;
}[];

export const useLogic = () => {
	const { youtubeDeckDB } = React.useContext(YoutubeDeckContext);
	const [ranking, setRanking] = React.useState<Ranking>([]);

	const formMethod = useForm<YouTubeCardRankingFormData>({
		resolver: YouTubeCardRankingFormResolver,
		defaultValues: {},
	});

	React.useEffect(() => {
		if (!youtubeDeckDB) return;

		(async () => {
			const results = await youtubeDeckDB
				.selectFrom("decks")
				.select([
					"no",
					"name",
					sql<number>`COUNT(no)`.as("no_count"),
					sql<number>`RANK() OVER (ORDER BY COUNT(no) DESC)`.as("rank"),
				])
				.groupBy("no")
				.orderBy("no_count", "desc")
				.execute();
			setRanking(results);
		})();
	}, [youtubeDeckDB]);

	const onSubmit: SubmitHandler<YouTubeCardRankingFormData> = (data) => {};

	return {
		formMethod,
		onSubmit,
		ranking,
	};
};
