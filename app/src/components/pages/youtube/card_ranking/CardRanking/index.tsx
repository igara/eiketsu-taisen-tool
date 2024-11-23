"use client";

import { GeneralDetailButton } from "@/components/Buttons/GeneralDetailButton";
import { GeneralImageButton } from "@/components/Buttons/GeneralImageButton";
import { FormProvider } from "react-hook-form";
import { useLogic } from "./logic";

export const CardRanking: React.FC = () => {
	const { formMethod, onSubmit, ranking } = useLogic();

	return (
		<FormProvider {...formMethod}>
			<form className="text-sm" onSubmit={formMethod.handleSubmit(onSubmit)}>
				<h1>YouTube 頂上対決 カードランキング</h1>

				<ol>
					{ranking.map((item) => (
						<li key={item.no} className="flex gap-1 p-1">
							<i>{item.rank}位</i>

							<p>{item.no_count}回</p>

							<GeneralDetailButton gene={{ no: item.no, name: item.name }} />

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
