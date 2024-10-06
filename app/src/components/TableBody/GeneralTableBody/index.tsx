"use client";

import { FavoriteButton } from "@/components/Buttons/FavoriteButton";
import { SkillButton } from "@/components/Buttons/SkillButton";
import type { SearchFormData } from "@/schema/SearchForm";
import type { General } from "@eiketsu-taisen-tool/data/types";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	generals: General[];
	formMethod: UseFormReturn<SearchFormData>;
};

export const GeneralTableBody: React.FC<Props> = ({ generals, formMethod }) => {
	return generals.map((general) => (
		<tr
			key={general.id}
			className="border-b-white border-b-2 text-xs"
			style={{
				background: `rgba(${general.color.r},${general.color.g},${general.color.b},0.2)`,
			}}
		>
			<td className="p-[4px]">
				<p
					style={{
						color: `rgb(${general.color.r},${general.color.g},${general.color.b})`,
					}}
				>
					{general.color.name}
				</p>
				<p>{general.period}</p>
				<p>{general.no}</p>
			</td>

			<td className="p-[4px]">
				<div className="flex flex-col gap-[4px]">
					<div>
						<ruby>
							<p>{general.name}</p>
							<rp>(</rp>
							<rt>{general.kanaName}</rt>
							<rp>)</rp>
						</ruby>

						<span>【{general.cost}】</span>
					</div>

					<p>
						【{general.unitType}】{general.power} / {general.intelligentzia}
					</p>

					<div className="flex gap-[4px] flex-wrap">
						{general.skill.map((skill, index) => {
							return (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<SkillButton key={index} skill={skill} />
							);
						})}
					</div>
				</div>
			</td>

			<td className="pl-[4px]">
				<div className="flex">
					<div className="w-full pt-[4px]">
						<ruby>
							{general.strat.name}
							<rp>(</rp>
							<rt>{general.strat.kanaName}</rt>
							<rp>)</rp>
						</ruby>
						<p>{general.strat.time}</p>
						<p>【{general.strat.cost}】</p>
					</div>

					<div>
						<img
							src={`/eiketsu-taisen-tool/images/stratRange/${general.strat.range}.png`}
							alt={general.strat.name}
							width={50}
							height={60}
						/>
					</div>
				</div>

				<p
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					// biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: <explanation>
					dangerouslySetInnerHTML={{
						__html: general.strat.description,
					}}
					className="pb-[4px]"
				/>

				<div className="flex py-[4px] border-t-2 border-white">
					<ul className="w-full">
						{general.url.official && (
							<li>
								<a
									href={general.url.official}
									target="_blank"
									rel="noopener noreferrer"
									className="underline"
								>
									公式
								</a>
							</li>
						)}
						{general.url.atWiki && (
							<li>
								<a
									href={general.url.atWiki}
									target="_blank"
									rel="noopener noreferrer"
									className="underline"
								>
									英傑大戦wiki
								</a>
							</li>
						)}
						{general.url.gameWiki && (
							<li>
								<a
									href={general.url.gameWiki}
									target="_blank"
									rel="noopener noreferrer"
									className="underline"
								>
									ゲームウィキ.jp
								</a>
							</li>
						)}
					</ul>

					<div className="w-[90px] flex items-center justify-end p-[4px]">
						<FavoriteButton general={general} formMethod={formMethod} />
					</div>
				</div>
			</td>
		</tr>
	));
};
