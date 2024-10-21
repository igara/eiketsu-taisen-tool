"use client";

import { GeneralTableBody } from "@/components/TableBody/GeneralTableBody";
import Image from "next/image";
import type React from "react";
import { FormProvider } from "react-hook-form";
import { useLogic } from "./logic";

export const GeneralTable: React.FC = () => {
	const {
		isDisplayFavorite,
		isDisableHeader,
		isDisableOption,
		generalInfo,
		colors,
		periods,
		costs,
		unitTypes,
		skills,
		stratRanges,
		formMethod,
		onSubmit,
		refColorDetailsElement,
		refPeriodDetailsElement,
		refCostDetailsElement,
		refUnitTypeDetailsElement,
		refSkillDetailsElement,
		refStratRangesDetailsElement,
		refResetDetailsElement,
		refDisplayDetailsElement,
		onClickColorDetails,
		onClickPeriodDetails,
		onClickCostDetails,
		onClickUnitTypeDetails,
		onClickSkillDetails,
		onClickStratRangesDetails,
		onClickResetDetails,
		onClickDisplayDetails,
		onClickSearchReset,
		onClickAllReset,
		refTableScrollElement,
		defaultSelectedColors,
		defaultSelectedPeriods,
		defaultSelectedCosts,
		defaultSelectedUnitTypes,
		defaultSelectedSkills,
		defaultSelectedStratRanges,
		defaultSearchWord,
		defaultSearchFavoriteNos,
		MAX_COST,
	} = useLogic();

	return (
		<FormProvider {...formMethod}>
			<form
				onSubmit={formMethod.handleSubmit(onSubmit)}
				className="h-[100dvh] w-[100dvw] text-xs"
				ref={refTableScrollElement}
			>
				<div>
					<table className="h-[100dvh] w-[100dvw] table-fixed border-collapse">
						<thead
							className={`text-white w-full sticky z-50 top-0 bg-gradient-to-b from-[#954d26] via-[#ae853a] to-[#b59d52] dark:bg-[#954d26] ${isDisableHeader ? "hidden" : ""}`}
						>
							<tr>
								<th className="w-[80px] text-left p-[4px] align-baseline">
									<p>勢力</p>
									<p>時代</p>
									<p>No</p>
								</th>

								<th className="w-[120px] text-left p-[4px] align-baseline">
									<p>名前</p>
									<p>【コスト】</p>
									<p>兵種</p>
									<p>武力 / 知力</p>
									<p>特技</p>
								</th>

								<th className="text-left pl-[4px]">
									<div className="flex">
										<div className="w-full pt-[4px]">
											<p>計略名</p>
											<p>効果時間</p>
											<p>【必要士気】</p>
										</div>
										<div className="flex justify-center items-center w-[60px] border-l-2 border-b-2 border-white">
											<p>
												効果
												<br />
												範囲
											</p>
										</div>
									</div>

									<p className="pb-[4px]">説明</p>

									<div className="flex items-center border-t-2 border-white">
										<p className="w-full">外部リンク</p>

										<p className="py-[4px] w-[60px] flex items-center justify-center gap-[4px] text-center border-l-2 border-white">
											リスト
											<br />
											登録
										</p>
									</div>
								</th>
							</tr>
						</thead>

						<tbody className="bg-white">
							<GeneralTableBody
								generals={generalInfo.generals}
								formMethod={formMethod}
								defaultSearchFavoriteNos={defaultSearchFavoriteNos}
								isDisableOption={isDisableOption}
							/>
						</tbody>

						<tfoot className="sticky z-50 bottom-0 bg-gradient-to-b from-[#252423] via-[#3b3a38] to-[#464542] dark:bg-[#252423]">
							<tr>
								<td className="p-[4px]" colSpan={3}>
									<div className="flex flex-col gap-[4px]">
										<div
											className={`text-white flex gap-[4px] ${isDisplayFavorite ? "hidden" : ""}`}
										>
											<div>検索件数: {generalInfo.searchCount}</div>
											<div className="flex gap-[4px] flex-wrap">
												選択条件:{" "}
												{defaultSelectedColors.map((c) => (
													<span key={c}>{c}</span>
												))}
												{defaultSelectedPeriods.map((p) => (
													<span key={p}>{p}</span>
												))}
												{defaultSelectedCosts.map((c) => (
													<span key={c}>{c}</span>
												))}
												{defaultSelectedUnitTypes.map((u) => (
													<span key={u}>{u}</span>
												))}
												{defaultSelectedSkills.map((s) => (
													<span key={s}>{s}</span>
												))}
												{defaultSelectedStratRanges.map((sr) => (
													<Image
														key={sr}
														src={`/eiketsu-taisen-tool/images/stratRange/${sr}.png`}
														alt={sr}
														width={18}
														height={36}
													/>
												))}
												{defaultSearchWord && <span>キーワード検索</span>}
											</div>
										</div>

										<div className="text-white flex gap-[4px]">
											<div>リスト件数: {generalInfo.favoriteCount.card}</div>
											<div>
												総コスト:
												<span
													className={
														MAX_COST < generalInfo.favoriteCount.cost
															? "text-red-700"
															: ""
													}
												>
													{generalInfo.favoriteCount.cost}
												</span>{" "}
												/ {MAX_COST}
											</div>
											<div>総武力: {generalInfo.favoriteCount.power}</div>
											<div>
												総知力: {generalInfo.favoriteCount.intelligentzia}
											</div>
										</div>

										<div>
											<div className="flex flex-col gap-[4px]">
												<div
													className={`flex gap-[4px] flex-wrap ${isDisplayFavorite ? "hidden" : ""}`}
												>
													<details
														ref={refColorDetailsElement}
														className="relative"
													>
														<summary
															onKeyDown={onClickColorDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
														>
															勢力
														</summary>

														<div className="absolute bottom-[28px] flex flex-col gap-[4px] p-[4px] bg-[#252423] rounded-[4px]">
															{colors.map((color) => (
																<div
																	key={color.name}
																	className="bg-white border-2 border-white rounded-lg focus:outline-none overflow-hidden"
																>
																	<div
																		className="flex items-center gap-[4px] p-[4px] text-xs"
																		style={{
																			background: `rgba(${color.r},${color.g},${color.b},0.2)`,
																		}}
																	>
																		<input
																			type="checkbox"
																			value={color.name}
																			id={`color_${color.name}`}
																			{...formMethod.register("color")}
																		/>
																		<label
																			htmlFor={`color_${color.name}`}
																			style={{
																				color: `rgb(${color.r},${color.g},${color.b})`,
																			}}
																		>
																			{color.name}
																		</label>
																	</div>
																</div>
															))}
														</div>
													</details>

													<details
														ref={refPeriodDetailsElement}
														className="relative"
													>
														<summary
															onKeyDown={onClickPeriodDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
														>
															時代
														</summary>

														<div className="absolute bottom-[28px] w-[100px] flex flex-col gap-[4px] p-[4px] bg-[#252423] rounded-[4px]">
															{periods.map((period) => (
																<div
																	key={period}
																	className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
																>
																	<input
																		type="checkbox"
																		value={period}
																		id={`period_${period}`}
																		{...formMethod.register("period")}
																	/>
																	<label
																		htmlFor={`period_${period}`}
																		className="text-black"
																	>
																		{period}
																	</label>
																</div>
															))}
														</div>
													</details>

													<details
														ref={refCostDetailsElement}
														className="relative"
													>
														<summary
															onKeyDown={onClickCostDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
														>
															コスト
														</summary>

														<div className="absolute bottom-[28px] flex flex-col gap-[4px] p-[4px] bg-[#252423] rounded-[4px]">
															{costs.map((cost) => (
																<div
																	key={cost}
																	className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
																>
																	<input
																		type="checkbox"
																		value={cost}
																		id={`cost_${cost}`}
																		{...formMethod.register("cost")}
																	/>
																	<label
																		htmlFor={`cost_${cost}`}
																		className="text-black"
																	>
																		{cost}
																	</label>
																</div>
															))}
														</div>
													</details>

													<details
														ref={refUnitTypeDetailsElement}
														className="relative"
													>
														<summary
															onKeyDown={onClickUnitTypeDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
														>
															兵種
														</summary>

														<div className="absolute bottom-[28px] w-[80px] flex flex-col gap-[4px] p-[4px] bg-[#252423] rounded-[4px]">
															{unitTypes.map((unitType) => (
																<div
																	key={unitType}
																	className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
																>
																	<input
																		type="checkbox"
																		value={unitType}
																		id={`unitType_${unitType}`}
																		{...formMethod.register("unitType")}
																	/>
																	<label
																		htmlFor={`unitType_${unitType}`}
																		className="text-black"
																	>
																		{unitType}
																	</label>
																</div>
															))}
														</div>
													</details>

													<details
														ref={refSkillDetailsElement}
														className="relative"
													>
														<summary
															onKeyDown={onClickSkillDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
														>
															特技
														</summary>

														<div className="absolute bottom-[28px] w-[80px] flex flex-col gap-[4px] p-[4px] bg-[#252423] rounded-[4px]">
															{skills.map((skill) => (
																<div
																	key={skill.name}
																	className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
																>
																	<input
																		type="checkbox"
																		value={skill.name}
																		id={`skill_${skill.name}`}
																		{...formMethod.register("skill")}
																	/>
																	<label
																		htmlFor={`skill_${skill.name}`}
																		className="text-black"
																	>
																		{skill.name}
																	</label>
																</div>
															))}
														</div>
													</details>

													<details
														ref={refStratRangesDetailsElement}
														className="relative"
													>
														<summary
															onKeyDown={onClickStratRangesDetails}
															className="w-[110px] text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
														>
															計略効果範囲
														</summary>

														<div className="absolute bottom-[28px] w-[130px] flex flex-wrap gap-[4px] p-[4px] bg-[#252423] rounded-[4px]">
															{stratRanges.map((stratRange) => (
																<div
																	key={stratRange}
																	className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
																>
																	<input
																		type="checkbox"
																		value={stratRange}
																		id={`stratRange_${stratRange}`}
																		{...formMethod.register("stratRange")}
																	/>
																	<label
																		htmlFor={`stratRange_${stratRange}`}
																		className="text-black"
																	>
																		<Image
																			src={`/eiketsu-taisen-tool/images/stratRange/${stratRange}.png`}
																			alt={stratRange}
																			width={18}
																			height={36}
																		/>
																	</label>
																</div>
															))}
														</div>
													</details>
												</div>

												<div
													className={`flex items-center ${isDisplayFavorite ? "hidden" : ""}`}
												>
													<input
														type="text"
														placeholder="名前or計略 スペースで複数選択"
														className="w-[180px] p-[4px] text-xs rounded-lg"
														{...formMethod.register("searchWord")}
													/>
												</div>

												<div className="flex items-center pr-[12px] pb-[12px]">
													<div className="flex justify-end gap-[28px] w-[100%]">
														<details
															ref={refDisplayDetailsElement}
															className="relative"
														>
															<summary
																onKeyDown={onClickDisplayDetails}
																className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
															>
																表示切り替え
															</summary>

															<div className="absolute bottom-[28px] w-[100px] flex flex-col gap-[4px] p-[4px] bg-[#252423] rounded-[4px]">
																<div className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]">
																	<input
																		type="checkbox"
																		value="true"
																		id="isDisableHeader"
																		{...formMethod.register("isDisableHeader")}
																		checked={!isDisableHeader}
																	/>
																	<label
																		htmlFor="isDisableHeader"
																		className="text-black"
																	>
																		ヘッダー
																	</label>
																</div>

																<div className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]">
																	<input
																		type="checkbox"
																		value="true"
																		id="isDisableOption"
																		{...formMethod.register("isDisableOption")}
																		checked={!isDisableOption}
																	/>
																	<label
																		htmlFor="isDisableOption"
																		className="text-black"
																	>
																		外部リンク/リスト登録
																	</label>
																</div>
															</div>
														</details>

														<div className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]">
															<input
																type="checkbox"
																value="true"
																id="isDisplayFavorite"
																{...formMethod.register("isDisplayFavorite")}
															/>
															<label
																htmlFor="isDisplayFavorite"
																className="flex gap-[4px] text-black"
															>
																<span className="flex items-center justify-center w-[16px] h-[16px] p-[2px] text-xs rounded-full cursor-pointer text-[#eb4926] bg-[#f3b33e]">
																	★
																</span>
																表示
															</label>
														</div>

														<div
															className={`flex gap-[28px] ${isDisplayFavorite ? "hidden" : ""}`}
														>
															<details
																ref={refResetDetailsElement}
																className="relative"
															>
																<summary
																	onKeyDown={onClickResetDetails}
																	className="text-white text-xs bg-blue-600 p-[4px] border-2 border-white rounded-lg focus:outline-none"
																>
																	リセット
																</summary>

																<div className="absolute bottom-[28px] flex flex-col gap-[4px] p-[4px] bg-[#252423] rounded-[4px]">
																	<button
																		type="button"
																		onClick={onClickSearchReset}
																		className="text-white text-xs bg-blue-600 p-[4px] border-2 border-white rounded-lg focus:outline-none"
																	>
																		検索条件のみ
																	</button>

																	<button
																		type="button"
																		onClick={onClickAllReset}
																		className="text-white text-xs bg-red-500 p-[4px] border-2 border-white rounded-lg focus:outline-none"
																	>
																		リスト&検索条件
																	</button>
																</div>
															</details>

															<button
																type="submit"
																className="text-xs bg-red-500 p-[4px] border-2 border-white rounded-lg focus:outline-none"
															>
																🔍
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</form>
		</FormProvider>
	);
};

export default GeneralTable;
