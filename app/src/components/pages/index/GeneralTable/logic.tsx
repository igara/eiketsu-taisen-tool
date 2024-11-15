import { pathInfo } from "@/lib/pathInfo";
import { type SearchFormData, SearchFormResolver } from "@/schema/SearchForm";
import GeneralsJSON from "@eiketsu-taisen-tool/data/data/json/generals.json";
import type { General } from "@eiketsu-taisen-tool/data/types";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

export type GeneralUI = General & {
	isFavorite: boolean;
	hidden: boolean;
};

export const useLogic = () => {
	const genNewGeneralInfo = (data: {
		color: string[];
		period: string[];
		appear: string[];
		cost: string[];
		unitType: string[];
		skill: string[];
		power: string[];
		intelligentzia: string[];
		stratCost: string[];
		stratRange: string[];
		searchWord: string;
		favoriteNo: string[];
		isDisplayFavorite: "true" | undefined;
	}) => {
		const newGeneralInfo = GeneralsJSON.reduce(
			(acc, general) => {
				const generalUI: GeneralUI = {
					...general,
					isFavorite: false,
					hidden: true,
				};

				const hasFavoriteNo = data.favoriteNo.some((fn) => fn === general.no);
				if (hasFavoriteNo) {
					generalUI.isFavorite = true;

					acc.favoriteCount.card += 1;
					acc.favoriteCount.power += +general.power;
					acc.favoriteCount.intelligentzia += +general.intelligentzia;
					acc.favoriteCount.cost += +general.cost;

					acc.favariteNames.push(general.name);
				}

				if (data.isDisplayFavorite === "true") {
					if (!hasFavoriteNo) {
						acc.generals.push(generalUI);
						return acc;
					}

					generalUI.hidden = false;
					if (!generalUI.hidden) {
						acc.searchCount += 1;
					}
					acc.generals.push(generalUI);
					return acc;
				}

				if (
					(data.color.length === 0 ||
						data.color.some((c) => c === general.color.name)) &&
					(data.period.length === 0 ||
						data.period.some((p) => p === general.period)) &&
					(data.appear.length === 0 ||
						data.appear.some((p) => p === general.appear)) &&
					(data.cost.length === 0 ||
						data.cost.some((c) => c === general.cost)) &&
					(data.unitType.length === 0 ||
						data.unitType.some((u) => u === general.unitType)) &&
					(data.skill.length === 0 ||
						data.skill.some(
							(s) => s && general.skill.some((gs) => gs.name === s),
						)) &&
					(data.power.length === 0 ||
						data.power.some((sr) => sr === general.power)) &&
					(data.intelligentzia.length === 0 ||
						data.intelligentzia.some((sr) => sr === general.intelligentzia)) &&
					(data.stratCost.length === 0 ||
						data.stratCost.some((sr) => sr === general.strat.cost)) &&
					(data.stratRange.length === 0 ||
						data.stratRange.some((sr) => sr === general.strat.range))
				) {
					if (data.searchWord) {
						const searchWords = data.searchWord
							? data.searchWord.split(/[\u3000\u0020]+/)
							: [];

						for (const searchWord of searchWords) {
							const regex = new RegExp(`${searchWord}`, "i");

							if (
								regex.test(general.name) ||
								regex.test(general.kanaName) ||
								regex.test(general.strat.name) ||
								regex.test(general.strat.kanaName) ||
								regex.test(general.strat.time) ||
								regex.test(JSON.stringify(general.strat.categories)) ||
								regex.test(general.strat.description)
							) {
								generalUI.hidden = false;
							}
						}
					} else {
						generalUI.hidden = false;
					}
				}

				if (!generalUI.hidden) {
					acc.searchCount += 1;
				}
				acc.generals.push(generalUI);
				return acc;
			},
			{
				generals: [],
				favoriteCount: {
					card: 0,
					power: 0,
					intelligentzia: 0,
					cost: 0,
				},
				favariteNames: [],
				searchCount: 0,
			} as {
				generals: GeneralUI[];
				favoriteCount: {
					card: number;
					power: number;
					intelligentzia: number;
					cost: number;
				};
				favariteNames: string[];
				searchCount: number;
			},
		);

		return newGeneralInfo;
	};

	const router = useRouter();
	const searchParams = useSearchParams();

	const defaultSelectedColors = searchParams.getAll(
		pathInfo["/"].searchParams["color[]"],
	);
	const defaultSelectedPeriods = searchParams.getAll(
		pathInfo["/"].searchParams["period[]"],
	);
	const defaultSelectedAppears = searchParams.getAll(
		pathInfo["/"].searchParams["appear[]"],
	);
	const defaultSelectedCosts = searchParams.getAll(
		pathInfo["/"].searchParams["cost[]"],
	);
	const defaultSelectedUnitTypes = searchParams.getAll(
		pathInfo["/"].searchParams["unitType[]"],
	);
	const defaultSelectedSkills = searchParams.getAll(
		pathInfo["/"].searchParams["skill[]"],
	);
	const defaultSelectedPowers = searchParams.getAll(
		pathInfo["/"].searchParams["power[]"],
	);
	const defaultSelectedIntelligentzias = searchParams.getAll(
		pathInfo["/"].searchParams["intelligentzia[]"],
	);
	const defaultSelectedStratCosts = searchParams.getAll(
		pathInfo["/"].searchParams["stratCost[]"],
	);
	const defaultSelectedStratRanges = searchParams.getAll(
		pathInfo["/"].searchParams["stratRange[]"],
	);
	const defaultSearchWord = searchParams.get(
		pathInfo["/"].searchParams.searchWord,
	);
	const defaultSearchFavoriteNos = searchParams.getAll(
		pathInfo["/"].searchParams["favoriteNo[]"],
	);
	const defaultIsDisplayFavorite = searchParams.get(
		pathInfo["/"].searchParams.isDisplayFavorite,
	);
	const defaultIsDisableSearchForm = searchParams.get(
		pathInfo["/"].searchParams.isDisableSearchForm,
	);
	const defaultIsDisableOption = searchParams.get(
		pathInfo["/"].searchParams.isDisableOption,
	);

	const isDisplayFavorite = defaultIsDisplayFavorite === "true";
	const isDisableSearchForm = defaultIsDisableSearchForm === "true";
	const isDisableOption = defaultIsDisableOption === "true";

	const generalInfo = genNewGeneralInfo({
		color: defaultSelectedColors,
		period: defaultSelectedPeriods,
		appear: defaultSelectedAppears,
		cost: defaultSelectedCosts,
		unitType: defaultSelectedUnitTypes,
		skill: defaultSelectedSkills,
		power: defaultSelectedPowers,
		intelligentzia: defaultSelectedIntelligentzias,
		stratCost: defaultSelectedStratCosts,
		stratRange: defaultSelectedStratRanges,
		searchWord: defaultSearchWord || "",
		favoriteNo: defaultSearchFavoriteNos,
		isDisplayFavorite: isDisplayFavorite ? "true" : undefined,
	});

	const formMethod = useForm<SearchFormData>({
		resolver: SearchFormResolver,
		defaultValues: {
			color: defaultSelectedColors,
			period: defaultSelectedPeriods,
			appear: defaultSelectedAppears,
			cost: defaultSelectedCosts,
			unitType: defaultSelectedUnitTypes,
			skill: defaultSelectedSkills,
			power: defaultSelectedPowers,
			intelligentzia: defaultSelectedIntelligentzias,
			stratCost: defaultSelectedStratCosts,
			stratRange: defaultSelectedStratRanges,
			searchWord: defaultSearchWord || "",
			favoriteNo: defaultSearchFavoriteNos,
			isDisplayFavorite: isDisplayFavorite ? "true" : undefined,
			isDisableSearchForm: isDisableSearchForm ? "true" : undefined,
			isDisableOption: isDisableOption ? "true" : undefined,
		},
	});

	formMethod.register("favoriteNo", {
		onChange: (e) => {
			const checked: boolean = e.target.checked;
			const favoriteNo = e.target.value;
			const newURLSearchParams = new URLSearchParams(window.location.search);

			newURLSearchParams.delete(pathInfo["/"].searchParams["favoriteNo[]"]);
			if (checked) {
				if (!defaultSearchFavoriteNos.includes(favoriteNo)) {
					newURLSearchParams.append(
						pathInfo["/"].searchParams["favoriteNo[]"],
						favoriteNo,
					);
				}
			}
			for (const fn of defaultSearchFavoriteNos) {
				if (fn === favoriteNo && !checked) {
					continue;
				}
				newURLSearchParams.append(
					pathInfo["/"].searchParams["favoriteNo[]"],
					fn,
				);
			}

			router.push(`/?${newURLSearchParams.toString()}`, {
				scroll: false,
			});
		},
	});

	formMethod.register("isDisplayFavorite", {
		onChange: (e) => {
			const checked: boolean = e.target.checked;
			const newURLSearchParams = new URLSearchParams(window.location.search);

			if (checked) {
				newURLSearchParams.append(
					pathInfo["/"].searchParams.isDisplayFavorite,
					"true",
				);
			} else {
				newURLSearchParams.delete(pathInfo["/"].searchParams.isDisplayFavorite);
			}

			router.push(`/?${newURLSearchParams.toString()}`, {
				scroll: false,
			});
		},
	});

	formMethod.register("isDisableSearchForm", {
		onChange: (e) => {
			const checked: boolean = e.target.checked;
			const newURLSearchParams = new URLSearchParams(window.location.search);

			if (checked) {
				newURLSearchParams.delete(
					pathInfo["/"].searchParams.isDisableSearchForm,
				);
			} else {
				newURLSearchParams.append(
					pathInfo["/"].searchParams.isDisableSearchForm,
					"true",
				);
			}

			router.push(`/?${newURLSearchParams.toString()}`);
		},
	});

	formMethod.register("isDisableOption", {
		onChange: (e) => {
			const checked: boolean = e.target.checked;
			const newURLSearchParams = new URLSearchParams(window.location.search);

			if (checked) {
				newURLSearchParams.delete(pathInfo["/"].searchParams.isDisableOption);
			} else {
				newURLSearchParams.append(
					pathInfo["/"].searchParams.isDisableOption,
					"true",
				);
			}

			router.push(`/?${newURLSearchParams.toString()}`);
		},
	});

	const onSubmit: SubmitHandler<SearchFormData> = (data) => {
		const newURLSearchParams = new URLSearchParams();

		if (data.color?.length) {
			for (const c of data.color) {
				c &&
					newURLSearchParams.append(pathInfo["/"].searchParams["color[]"], c);
			}
		}

		if (data.period?.length) {
			for (const p of data.period) {
				p &&
					newURLSearchParams.append(pathInfo["/"].searchParams["period[]"], p);
			}
		}

		if (data.appear?.length) {
			for (const p of data.appear) {
				p &&
					newURLSearchParams.append(pathInfo["/"].searchParams["appear[]"], p);
			}
		}

		if (data.cost?.length) {
			for (const c of data.cost) {
				c && newURLSearchParams.append(pathInfo["/"].searchParams["cost[]"], c);
			}
		}

		if (data.unitType?.length) {
			for (const u of data.unitType) {
				u &&
					newURLSearchParams.append(
						pathInfo["/"].searchParams["unitType[]"],
						u,
					);
			}
		}

		if (data.skill?.length) {
			for (const s of data.skill) {
				s &&
					newURLSearchParams.append(pathInfo["/"].searchParams["skill[]"], s);
			}
		}

		if (data.power?.length) {
			for (const p of data.power) {
				p &&
					newURLSearchParams.append(pathInfo["/"].searchParams["power[]"], p);
			}
		}

		if (data.intelligentzia?.length) {
			for (const i of data.intelligentzia) {
				i &&
					newURLSearchParams.append(
						pathInfo["/"].searchParams["intelligentzia[]"],
						i,
					);
			}
		}

		if (data.stratCost?.length) {
			for (const sc of data.stratCost) {
				sc &&
					newURLSearchParams.append(
						pathInfo["/"].searchParams["stratCost[]"],
						sc,
					);
			}
		}

		if (data.stratRange?.length) {
			for (const sr of data.stratRange) {
				sr &&
					newURLSearchParams.append(
						pathInfo["/"].searchParams["stratRange[]"],
						sr,
					);
			}
		}

		const searchWord = data.searchWord;
		if (searchWord) {
			newURLSearchParams.append(
				pathInfo["/"].searchParams.searchWord,
				searchWord,
			);
		}

		if (data.favoriteNo?.length) {
			for (const fn of data.favoriteNo) {
				fn &&
					newURLSearchParams.append(
						pathInfo["/"].searchParams["favoriteNo[]"],
						fn,
					);
			}
		}

		const isFavorite = data.isDisplayFavorite;
		if (isFavorite === "true") {
			newURLSearchParams.append(
				pathInfo["/"].searchParams.isDisplayFavorite,
				"true",
			);
		}

		router.push(`/?${newURLSearchParams.toString()}`);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (!isDisplayFavorite) return;
		if (!defaultSearchFavoriteNos.length) return;

		document.title = generalInfo.favariteNames.join("|");
	}, [defaultSearchFavoriteNos, isDisplayFavorite]);

	return {
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
	};
};
