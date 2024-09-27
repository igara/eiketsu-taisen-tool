"use client";

import { GeneralTableBody } from "@/components/TableBody/GeneralTableBody";
import type React from "react";
import { FormProvider } from "react-hook-form";
import { useLogic } from "./logic";

export const GeneralTable: React.FC = () => {
	const {
		generals,
		colors,
		periods,
		costs,
		unitTypes,
		skills,
		formMethod,
		onSubmit,
		refColorDetailsElement,
		refPeriodDetailsElement,
		refCostDetailsElement,
		refUnitTypeDetailsElement,
		refSkillDetailsElement,
		onClickColorDetails,
		onClickPeriodDetails,
		onClickCostDetails,
		onClickUnitTypeDetails,
		onClickSkillDetails,
		onClickReset,
		refTableScrollElement,
		defaultSelectedColors,
		defaultSelectedPeriods,
		defaultSelectedCosts,
		defaultSelectedUnitTypes,
		defaultSelectedSkills,
	} = useLogic();

	return (
		<div
			className="overflow-y-auto h-[100dvh] text-xs"
			ref={refTableScrollElement}
		>
			<table className="w-full h-full table-fixed border-collapse">
				<thead className="text-white w-full sticky z-50 top-0 bg-gradient-to-b from-[#954d26] via-[#ae853a] to-[#b59d52]">
					<tr>
						<th className="w-[80px] text-left p-[4px]">
							勢力
							<br />
							時代
						</th>

						<th className="w-[120px] text-left p-[4px]">
							名前【コスト】
							<br />
							【兵種】武力 / 知力
							<br />
							特技
						</th>

						<th className="text-left p-[4px]">
							計略名
							<br />
							効果時間
							<br />
							【必要士気】
							<br />
							説明
						</th>
					</tr>
				</thead>

				<tbody className="bg-white">
					<GeneralTableBody generals={generals} />
				</tbody>

				<tfoot className="sticky z-50 bottom-0 bg-gradient-to-b from-[#252423] via-[#3b3a38] to-[#464542]">
					<tr>
						<td className="p-[4px]" colSpan={3}>
							<div className="flex flex-col gap-[4px]">
								<div className="text-white flex gap-[4px]">
									<div>検索件数: {generals.length}</div>
									<div className="flex gap-[4px]">
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
									</div>
								</div>

								<div>
									<FormProvider {...formMethod}>
										<form onSubmit={formMethod.handleSubmit(onSubmit)}>
											<div className="flex flex-col gap-[4px]">
												<div className="flex gap-[4px]">
													<details ref={refColorDetailsElement}>
														<summary
															onKeyDown={onClickColorDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
														>
															勢力
														</summary>

														<div className="flex flex-col gap-[4px] p-[4px] pt-[8px]">
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

													<details ref={refPeriodDetailsElement}>
														<summary
															onKeyDown={onClickPeriodDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
														>
															時代
														</summary>

														<div className="flex flex-col gap-[4px] p-[4px] pt-[8px]">
															{periods.map((period) => (
																<div
																	key={period}
																	className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
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

													<details ref={refCostDetailsElement}>
														<summary
															onKeyDown={onClickCostDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
														>
															コスト
														</summary>

														<div className="flex flex-col gap-[4px] p-[4px] pt-[8px]">
															{costs.map((cost) => (
																<div
																	key={cost}
																	className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
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

													<details ref={refUnitTypeDetailsElement}>
														<summary
															onKeyDown={onClickUnitTypeDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
														>
															兵種
														</summary>

														<div className="flex flex-col gap-[4px] p-[4px] pt-[8px]">
															{unitTypes.map((unitType) => (
																<div
																	key={unitType}
																	className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
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

													<details ref={refSkillDetailsElement}>
														<summary
															onKeyDown={onClickSkillDetails}
															className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
														>
															特技
														</summary>

														<div className="flex flex-col gap-[4px] p-[4px] pt-[8px]">
															{skills.map((skill) => (
																<div
																	key={skill.name}
																	className="flex items-center gap-[4px] text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
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
												</div>

												<div className="flex items-center pr-[12px] pb-[12px]">
													<div className="flex items-center">
														<input
															type="text"
															placeholder="名前or計略 スペースで複数選択"
															className="w-[180px] p-[4px] text-xs rounded-lg"
															{...formMethod.register("search_word")}
														/>
													</div>

													<div className="flex justify-end gap-[28px] w-[100%]">
														<button
															type="button"
															onClick={onClickReset}
															className="text-white text-xs bg-blue-600 p-[4px] border-2 border-white rounded-lg focus:outline-none"
														>
															リセット
														</button>

														<button
															type="submit"
															className="text-xs bg-red-500 p-[4px] border-2 border-white rounded-lg focus:outline-none"
														>
															🔍
														</button>
													</div>
												</div>
											</div>
										</form>
									</FormProvider>
								</div>
							</div>
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
};

export default GeneralTable;
