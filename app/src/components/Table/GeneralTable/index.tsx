"use client";

import { GeneralTableBody } from "@/components/Table/GeneralTable/GeneralTableBody";
import Image from "next/image";
import type React from "react";
import { FormProvider } from "react-hook-form";
import { AppearDetails } from "./Details/AppearDetails";
import { ColorDetails } from "./Details/ColorDetails";
import { CostDetails } from "./Details/CostDetails";
import { DisplayDetails } from "./Details/DisplayDetails";
import { IntelligentziaDetails } from "./Details/IntelligentziaDetails";
import { PeriodDetails } from "./Details/PeriodDetails";
import { PowerDetails } from "./Details/PowerDetails";
import { ResetDetails } from "./Details/ResetDetails";
import { SkillDetails } from "./Details/SkillDetails";
import { StratCostDetails } from "./Details/StratCostDetails";
import { StratRangeDetails } from "./Details/StratRangeDetails";
import { UnitTypeDetails } from "./Details/UnitTypeDetails";
import { useLogic } from "./logic";

export const GeneralTable: React.FC = () => {
	const {
		isDisplayFavorite,
		isDisableSearchForm,
		isDisableOption,
		generalInfo,
		formMethod,
		onSubmit,
		defaultSelectedColors,
		defaultSelectedPeriods,
		defaultSelectedAppears,
		defaultSelectedCosts,
		defaultSelectedUnitTypes,
		defaultSelectedSkills,
		defaultSelectedPowers,
		defaultSelectedIntelligentzias,
		defaultSelectedStratCosts,
		defaultSelectedStratRanges,
		defaultSearchWord,
		defaultSearchFavoriteNos,
		defaultIsDisplayFavorite,
		MAX_COST,
		refWrapperElement,
	} = useLogic();

	return (
		<FormProvider {...formMethod}>
			<form
				onSubmit={formMethod.handleSubmit(onSubmit)}
				className="h-[100dvh] w-[100dvw] text-xs overflow-y-auto"
				ref={refWrapperElement}
			>
				<table className="h-[100dvh] w-[100dvw] table-fixed border-collapse">
					<GeneralTableBody
						generals={generalInfo.generals}
						formMethod={formMethod}
						defaultSearchFavoriteNos={defaultSearchFavoriteNos}
						isDisableOption={isDisableOption}
						refWrapperElement={refWrapperElement}
					/>

					<tfoot className="sticky z-50 bottom-0 bg-[#252423]">
						<tr>
							<td className="p-1" colSpan={3}>
								<div className="flex flex-col gap-1">
									<div
										className={`text-white flex gap-1 ${isDisplayFavorite ? "hidden" : ""}`}
									>
										<div>検索件数: {generalInfo.searchCount}</div>
										<div className="flex gap-1 flex-wrap">
											<span>選択条件:</span>

											{defaultSelectedColors.length > 0 && (
												<span>勢力({defaultSelectedColors.join(",")})</span>
											)}
											{defaultSelectedPeriods.length > 0 && (
												<span>時代({defaultSelectedPeriods.join(",")})</span>
											)}
											{defaultSelectedAppears.length > 0 && (
												<span>登場弾({defaultSelectedAppears.join(",")})</span>
											)}
											{defaultSelectedCosts.length > 0 && (
												<span>コスト({defaultSelectedCosts.join(",")})</span>
											)}
											{defaultSelectedUnitTypes.length > 0 && (
												<span>兵種({defaultSelectedUnitTypes.join(",")})</span>
											)}
											{defaultSelectedPowers.length > 0 && (
												<span>武力({defaultSelectedPowers.join(",")})</span>
											)}
											{defaultSelectedIntelligentzias.length > 0 && (
												<span>
													知力({defaultSelectedIntelligentzias.join(",")})
												</span>
											)}
											{defaultSelectedSkills.length > 0 && (
												<span>特技({defaultSelectedSkills.join(",")})</span>
											)}
											{defaultSelectedStratCosts.length > 0 && (
												<span>士気({defaultSelectedStratCosts.join(",")})</span>
											)}
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

									<div className="text-white flex gap-1">
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
								</div>
							</td>
						</tr>

						<tr
							className={
								isDisplayFavorite || isDisableSearchForm
									? "hidden"
									: "text-white"
							}
						>
							<td colSpan={3}>
								<div className="flex gap-1">
									<div className="w-[80px] flex flex-col flex-grow-0 flex-shrink-0 gap-1">
										<ColorDetails formMethod={formMethod} />
										<PeriodDetails formMethod={formMethod} />
										<p>No</p>
										<AppearDetails formMethod={formMethod} />
									</div>

									<div className="w-[100px] flex flex-col flex-grow-0 flex-shrink-0 gap-1">
										<p>名前</p>
										<CostDetails formMethod={formMethod} />
										<UnitTypeDetails formMethod={formMethod} />

										<div className="flex gap-1">
											<PowerDetails formMethod={formMethod} />
											<IntelligentziaDetails formMethod={formMethod} />
										</div>

										<SkillDetails formMethod={formMethod} />
									</div>

									<div className="w-full flex flex-col gap-1">
										<div className="flex">
											<div className="w-full flex flex-col gap-1">
												<p>計略名</p>
												<p>効果時間</p>

												<StratCostDetails formMethod={formMethod} />
											</div>

											<div className="flex justify-center items-center w-[100px] border-l-2 border-b-2 border-white">
												<StratRangeDetails formMethod={formMethod} />
											</div>
										</div>

										<p className="pb-1">説明</p>
									</div>
								</div>
							</td>
						</tr>
						<tr
							className={
								isDisplayFavorite || isDisableSearchForm ? "hidden" : ""
							}
						>
							<td className="p-1" colSpan={3}>
								<input
									type="text"
									placeholder="名前or計略 スペースで複数選択"
									className="w-full p-1 text-xs rounded-lg"
									{...formMethod.register("searchWord")}
								/>
							</td>
						</tr>

						<tr>
							<td className="p-1" colSpan={3}>
								<div className="flex flex-col gap-1">
									<div>
										<div className="flex flex-col gap-1">
											<div className="flex items-center pr-[12px] pb-[12px]">
												<div className="flex justify-end gap-1 w-[100%]">
													<DisplayDetails
														formMethod={formMethod}
														isDisableOption={isDisableOption}
														isDisableSearchForm={isDisableSearchForm}
													/>

													<div className="flex items-center gap-1 text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]">
														<input
															type="checkbox"
															value="true"
															id="isDisplayFavorite"
															{...formMethod.register("isDisplayFavorite")}
														/>
														<label
															htmlFor="isDisplayFavorite"
															className="flex gap-1 text-black"
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
														<ResetDetails
															formMethod={formMethod}
															defaultSearchFavoriteNos={
																defaultSearchFavoriteNos
															}
															defaultIsDisplayFavorite={
																defaultIsDisplayFavorite
															}
														/>

														<button
															type="submit"
															className="text-xs bg-red-500 p-1 border-2 border-white rounded-lg focus:outline-none"
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
			</form>
		</FormProvider>
	);
};
