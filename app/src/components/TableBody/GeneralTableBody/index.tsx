"use client";

import { SkillButton } from "@/components/Buttons/SkillButton";
import GeneralsJSON from "@eiketsu-taisen-tool/data/generals.json";
import type React from "react";

export const GeneralTableBody: React.FC = () => {
	return GeneralsJSON.map((general) => (
		<tr
			key={general.id}
			className="border-b-black dark:border-b-white border-b-2"
		>
			<td className="p-[4px]">
				{general.color}
				<br />
				{general.period}
				<br />【{general.cost}】
			</td>

			<td className="p-[4px]">
				<ruby>
					<a
						href={`https://eiketsu-taisen.net/datalist/?s=general&c=${general.id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="underline"
					>
						{general.name}
					</a>
					<rp>(</rp>
					<rt>{general.kanaName}</rt>
					<rp>)</rp>
				</ruby>
				<br />
				{general.power} / {general.intelligentzia}
				<br />
				{general.skill.map((skill, index) => {
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<SkillButton key={index} skill={skill} />
					);
				})}
			</td>

			<td className="p-[4px]">
				<ruby>
					{general.strat.name}
					<rp>(</rp>
					<rt>{general.strat.kanaName}</rt>
					<rp>)</rp>
				</ruby>
				<br />
				{general.strat.time}
				<br />【{general.strat.cost}】
				<br />
				<p
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					// biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: <explanation>
					dangerouslySetInnerHTML={{
						__html: general.strat.description,
					}}
				/>
			</td>
		</tr>
	));
};
