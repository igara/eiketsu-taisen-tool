"use client";

import { FavoriteButton } from "@/components/Buttons/FavoriteButton";
import { GeneralImageButton } from "@/components/Buttons/GeneralImageButton";
import { SkillButton } from "@/components/Buttons/SkillButton";
import { YouTubeGeneralCardButton } from "@/components/Buttons/YouTubeGeneralCardButton";
import type { GeneralUI } from "@/components/pages/index/GeneralTable/logic";
import type { SearchFormData } from "@/schema/SearchForm";
import Image from "next/image";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	generals: GeneralUI[];
	formMethod: UseFormReturn<SearchFormData>;
	defaultSearchFavoriteNos: SearchFormData["favoriteNo"];
	isDisableOption: boolean;
};

export const GeneralTableBody: React.FC<Props> = ({
	generals,
	formMethod,
	defaultSearchFavoriteNos,
	isDisableOption,
}) => {
	return generals.map((general) => (
		<tr
			key={general.id}
			className={`${general.hidden ? "hidden" : "border-b-white border-b-2 text-xs"}`}
			style={{
				background: `rgba(${general.color.r},${general.color.g},${general.color.b},0.2)`,
			}}
		>
			<td className="w-full align-baseline">
				<div className="flex">
					<div className="flex-grow-0 flex-shrink-0 w-[80px] p-1 align-baseline">
						<p
							style={{
								color: `rgb(${general.color.r},${general.color.g},${general.color.b})`,
							}}
						>
							{general.color.name}
						</p>
						<p>{general.period}</p>
						<p>{general.no}</p>
						<p>{general.appear}</p>
					</div>

					<div className="flex-grow-0 flex-shrink-0 w-[120px] p-1 align-baseline">
						<div className="flex flex-col gap-1">
							<div>
								<ruby>
									<p>{general.name}</p>
									<rp>(</rp>
									<rt>{general.kanaName}</rt>
									<rp>)</rp>
								</ruby>
							</div>

							<div className="flex justify-between">
								<div className="flex flex-col">
									<p>【{general.cost}】</p>

									<p>{general.unitType}</p>

									<p>
										{general.power} / {general.intelligentzia}
									</p>
								</div>

								<div className="w-[32px]">
									<GeneralImageButton general={general} />
								</div>
							</div>

							<div className="flex gap-1 flex-wrap">
								{general.skill.map((skill, index) => {
									return (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<SkillButton key={index} skill={skill} />
									);
								})}
							</div>
						</div>
					</div>

					<div className="w-full pl-1 align-baseline">
						<div className="flex">
							<div className="w-full pt-1 flex-1">
								<ruby>
									{general.strat.name}
									<rp>(</rp>
									<rt>{general.strat.kanaName}</rt>
									<rp>)</rp>
								</ruby>
								<p>{general.strat.time}</p>
								<p>【{general.strat.cost}】</p>
							</div>

							<div className="w-[32px]">
								<Image
									src={`/eiketsu-taisen-tool/images/stratRange/${general.strat.range}.png`}
									alt={general.strat.name}
									width={32}
									height={40}
								/>
							</div>
						</div>

						<p
							// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
							// biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: <explanation>
							dangerouslySetInnerHTML={{
								__html: general.strat.description,
							}}
							className="pb-1"
						/>

						<div
							className={`flex py-1 border-t-2 border-white ${isDisableOption ? "hidden" : ""}`}
						>
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

								<li>
									<YouTubeGeneralCardButton
										general={general}
										favorite={{
											formMethod,
											defaultSearchFavoriteNos,
										}}
									/>
								</li>
							</ul>

							<div className="w-[90px] flex items-center justify-end p-1">
								<FavoriteButton
									general={general}
									formMethod={formMethod}
									defaultSearchFavoriteNos={defaultSearchFavoriteNos}
								/>
							</div>
						</div>
					</div>
				</div>
			</td>
		</tr>
	));
};
