import { YoutubeDeckContext } from "@/context/sqlite/YoutubeDeck";
import { pathInfo } from "@/lib/pathInfo";
import {
	type YouTubeCardRankingFormData,
	YouTubeCardRankingFormResolver,
} from "@/schema/YouTubeCardRankingForm";
import dayjs from "dayjs";
import { sql } from "kysely";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

type Ranking = {
	no: string;
	name: string;
	no_count: number;
	rank: number;
}[];

export const useLogic = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const searchParamsDateFrom = searchParams.get(
		pathInfo["/youtube/card_ranking"].searchParams.date_from,
	);
	const dateFrom = dayjs(searchParamsDateFrom);
	const defaultDateFrom = dateFrom.isValid()
		? dateFrom.format("YYYY-MM-DD")
		: dayjs("2022/03/11").format("YYYY-MM-DD");

	const searchParamsDateTo = searchParams.get(
		pathInfo["/youtube/card_ranking"].searchParams.date_to,
	);
	const dateTo = dayjs(searchParamsDateTo);
	const defaultDateTo = dateTo.isValid()
		? dateTo.format("YYYY-MM-DD")
		: dayjs().format("YYYY-MM-DD");

	const { youtubeDeckDB } = React.useContext(YoutubeDeckContext);
	const [ranking, setRanking] = React.useState<Ranking>([]);

	const formMethod = useForm<YouTubeCardRankingFormData>({
		resolver: YouTubeCardRankingFormResolver,
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
			const results = await youtubeDeckDB
				.selectFrom("decks")
				.select([
					"no",
					"name",
					sql<number>`COUNT(no)`.as("no_count"),
					sql<number>`RANK() OVER (ORDER BY COUNT(no) DESC)`.as("rank"),
				])
				.where(sql<boolean>`create_at >= ${formMethod.getValues("date_from")}`)
				.where(sql<boolean>`create_at <= ${formMethod.getValues("date_to")}`)
				.groupBy("no")
				.orderBy("no_count", "desc")
				.execute();

			setRanking(results);
		})();
	}, [youtubeDeckDB]);

	const onSubmit: SubmitHandler<YouTubeCardRankingFormData> = async (data) => {
		if (!youtubeDeckDB) return;

		const results = await youtubeDeckDB
			.selectFrom("decks")
			.select([
				"no",
				"name",
				sql<number>`COUNT(no)`.as("no_count"),
				sql<number>`RANK() OVER (ORDER BY COUNT(no) DESC)`.as("rank"),
			])
			.where(sql<boolean>`create_at >= ${data.date_from}`)
			.where(sql<boolean>`create_at <= ${data.date_to}`)
			.groupBy("no")
			.orderBy("no_count", "desc")
			.execute();

		setRanking(results);

		const newQuery = new URLSearchParams();
		newQuery.set(
			pathInfo["/youtube/card_ranking"].searchParams.date_from,
			data.date_from,
		);
		newQuery.set(
			pathInfo["/youtube/card_ranking"].searchParams.date_to,
			data.date_to,
		);
		router.push(`/youtube/card_ranking?${newQuery.toString()}`);
	};

	return {
		formMethod,
		onSubmit,
		ranking,
	};
};
