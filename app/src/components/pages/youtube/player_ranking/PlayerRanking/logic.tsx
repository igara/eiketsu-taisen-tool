import { YoutubeDeckContext } from "@/context/sqlite/YoutubeDeck";
import { pathInfo } from "@/lib/pathInfo";
import {
	type YouTubePlayerRankingFormData,
	YouTubePlayerRankingFormResolver,
} from "@/schema/YouTubePlayerRankingForm";
import dayjs from "dayjs";
import { sql } from "kysely";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

type Ranking = {
	player_name: string;
	player_count: number;
	rank: number;
}[];

export const useLogic = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const searchParamsDateFrom = searchParams.get(
		pathInfo["/youtube/player_ranking"].searchParams.date_from,
	);
	const dateFrom = dayjs(searchParamsDateFrom);
	const defaultDateFrom = dateFrom.isValid()
		? dateFrom.format("YYYY-MM-DD")
		: dayjs("2022/03/11").format("YYYY-MM-DD");

	const searchParamsDateTo = searchParams.get(
		pathInfo["/youtube/player_ranking"].searchParams.date_to,
	);
	const dateTo = dayjs(searchParamsDateTo);
	const defaultDateTo = dateTo.isValid()
		? dateTo.format("YYYY-MM-DD")
		: dayjs().format("YYYY-MM-DD");

	const { youtubeDeckDB } = React.useContext(YoutubeDeckContext);
	const [ranking, setRanking] = React.useState<Ranking>([]);

	const formMethod = useForm<YouTubePlayerRankingFormData>({
		resolver: YouTubePlayerRankingFormResolver,
		defaultValues: {
			date_from: defaultDateFrom,
			date_to: defaultDateTo,
		},
		mode: "all",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (!youtubeDeckDB) return;

		(async () => {
			const subquery = youtubeDeckDB
				.selectFrom("decks")
				.select(["title", "player_name"])
				.select(youtubeDeckDB.fn.count("player_name").as("C"))
				.where(sql<boolean>`create_at >= ${formMethod.getValues("date_from")}`)
				.where(sql<boolean>`create_at <= ${formMethod.getValues("date_to")}`)
				.groupBy(["title", "player_name"])
				.orderBy("create_at", "desc");

			// サブクエリを使ってメインクエリを構築
			const results = await youtubeDeckDB
				.selectFrom(subquery.as("samples"))
				.select(["player_name"])
				.select([
					"player_name",
					sql<number>`COUNT(player_name)`.as("player_count"),
					sql<number>`RANK() OVER (ORDER BY COUNT(player_name) DESC)`.as(
						"rank",
					),
				])
				.groupBy("player_name")
				.orderBy("player_count", "desc")
				.execute();

			setRanking(results);
		})();
	}, [youtubeDeckDB]);

	const onSubmit: SubmitHandler<YouTubePlayerRankingFormData> = async (
		data,
	) => {
		if (!youtubeDeckDB) return;

		const subquery = youtubeDeckDB
			.selectFrom("decks")
			.select(["title", "player_name"])
			.select(youtubeDeckDB.fn.count("player_name").as("C"))
			.where(sql<boolean>`create_at >= ${formMethod.getValues("date_from")}`)
			.where(sql<boolean>`create_at <= ${formMethod.getValues("date_to")}`)
			.groupBy(["title", "player_name"])
			.orderBy("create_at", "desc");

		// サブクエリを使ってメインクエリを構築
		const results = await youtubeDeckDB
			.selectFrom(subquery.as("samples"))
			.select(["player_name"])
			.select([
				"player_name",
				sql<number>`COUNT(player_name)`.as("player_count"),
				sql<number>`RANK() OVER (ORDER BY COUNT(player_name) DESC)`.as("rank"),
			])
			.groupBy("player_name")
			.orderBy("player_count", "desc")
			.execute();

		setRanking(results);

		const newQuery = new URLSearchParams();
		newQuery.set(
			pathInfo["/youtube/player_ranking"].searchParams.date_from,
			data.date_from,
		);
		newQuery.set(
			pathInfo["/youtube/player_ranking"].searchParams.date_to,
			data.date_to,
		);
		router.push(`/youtube/player_ranking?${newQuery.toString()}`);
	};

	return {
		formMethod,
		onSubmit,
		ranking,
	};
};
