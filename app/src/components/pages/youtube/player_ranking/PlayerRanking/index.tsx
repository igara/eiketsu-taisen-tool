"use client";

import { YouTubePlayerButton } from "@/components/Buttons/YouTubePlayerButton";
import dayjs from "dayjs";
import { FormProvider } from "react-hook-form";
import { useLogic } from "./logic";

export const PlayerRanking: React.FC = () => {
	const { formMethod, onSubmit, ranking } = useLogic();

	return (
		<FormProvider {...formMethod}>
			<form
				className="p-1 flex flex-col gap-1 text-sm"
				onSubmit={formMethod.handleSubmit(onSubmit)}
			>
				<h1>YouTube 頂上対決 主君 ランキング</h1>

				<div className="flex items-center gap-1">
					<input
						type="date"
						{...formMethod.register("date_from")}
						min="2022-03-11"
						max={dayjs().format("YYYY-MM-DD")}
					/>
					<span>〜</span>
					<input
						type="date"
						{...formMethod.register("date_to")}
						min="2022-03-11"
						max={dayjs().format("YYYY-MM-DD")}
					/>

					<button
						type="submit"
						className="text-xs bg-red-500 p-1 border-2 border-white rounded-lg focus:outline-none"
					>
						🔍
					</button>
				</div>

				<ol>
					{ranking.map((item) => (
						<li key={item.player_name} className="flex gap-1 p-1">
							<i>{item.rank}位</i>

							<p>{item.player_count}回</p>

							<YouTubePlayerButton
								playerName={item.player_name}
								date={{
									from: formMethod.getValues("date_from"),
									to: formMethod.getValues("date_to"),
								}}
							/>
						</li>
					))}
				</ol>
			</form>
		</FormProvider>
	);
};
