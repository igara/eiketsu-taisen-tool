"use client";

import { GeneralDetailButton } from "@/components/Buttons/GeneralDetailButton";
import { GeneralImageButton } from "@/components/Buttons/GeneralImageButton";
import dayjs from "dayjs";
import { FormProvider } from "react-hook-form";
import { useLogic } from "./logic";

export const CardRanking: React.FC = () => {
	const { formMethod, onSubmit, ranking } = useLogic();

	return (
		<FormProvider {...formMethod}>
			<form
				className="p-1 flex flex-col gap-1 text-sm"
				onSubmit={formMethod.handleSubmit(onSubmit)}
			>
				<h1>YouTube 頂上対決 カードランキング</h1>

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
						<li key={item.no} className="flex gap-1 p-1">
							<i>{item.rank}位</i>

							<p>{item.no_count}回</p>

							<GeneralDetailButton
								gene={{ no: item.no, name: item.name }}
								date={{
									from: formMethod.getValues("date_from"),
									to: formMethod.getValues("date_to"),
								}}
							/>

							<GeneralImageButton
								general={{
									no: item.no,
									name: item.name,
								}}
							/>
						</li>
					))}
				</ol>
			</form>
		</FormProvider>
	);
};
