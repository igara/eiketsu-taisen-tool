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

	const refWrapperElement = React.useRef<HTMLFormElement>(null);

	const router = useRouter();
	const searchParams = useSearchParams();

	const defaultSelectedColors = searchParams.getAll("color[]");
	const defaultSelectedPeriods = searchParams.getAll("period[]");
	const defaultSelectedAppears = searchParams.getAll("appear[]");
	const defaultSelectedCosts = searchParams.getAll("cost[]");
	const defaultSelectedUnitTypes = searchParams.getAll("unitType[]");
	const defaultSelectedSkills = searchParams.getAll("skill[]");
	const defaultSelectedPowers = searchParams.getAll("power[]");
	const defaultSelectedIntelligentzias =
		searchParams.getAll("intelligentzia[]");
	const defaultSelectedStratCosts = searchParams.getAll("stratCost[]");
	const defaultSelectedStratRanges = searchParams.getAll("stratRange[]");
	const defaultSearchWord = searchParams.get("searchWord");
	const defaultSearchFavoriteNos = searchParams.getAll("favoriteNo[]");
	const defaultIsDisplayFavorite = searchParams.get("isDisplayFavorite");
	const defaultIsDisableSearchForm = searchParams.get("isDisableSearchForm");
	const defaultIsDisableOption = searchParams.get("isDisableOption");

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

			newURLSearchParams.delete("favoriteNo[]");
			if (checked) {
				if (!defaultSearchFavoriteNos.includes(favoriteNo)) {
					newURLSearchParams.append("favoriteNo[]", favoriteNo);
				}
			}
			for (const fn of defaultSearchFavoriteNos) {
				if (fn === favoriteNo && !checked) {
					continue;
				}
				newURLSearchParams.append("favoriteNo[]", fn);
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
				newURLSearchParams.append("isDisplayFavorite", "true");
			} else {
				newURLSearchParams.delete("isDisplayFavorite");
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
				newURLSearchParams.delete("isDisableSearchForm");
			} else {
				newURLSearchParams.append("isDisableSearchForm", "true");
			}

			router.push(`/?${newURLSearchParams.toString()}`);
		},
	});

	formMethod.register("isDisableOption", {
		onChange: (e) => {
			const checked: boolean = e.target.checked;
			const newURLSearchParams = new URLSearchParams(window.location.search);

			if (checked) {
				newURLSearchParams.delete("isDisableOption");
			} else {
				newURLSearchParams.append("isDisableOption", "true");
			}

			router.push(`/?${newURLSearchParams.toString()}`);
		},
	});

	const onSubmit: SubmitHandler<SearchFormData> = (data) => {
		const newURLSearchParams = new URLSearchParams();

		if (data.color?.length) {
			for (const c of data.color) {
				c && newURLSearchParams.append("color[]", c);
			}
		}

		if (data.period?.length) {
			for (const p of data.period) {
				p && newURLSearchParams.append("period[]", p);
			}
		}

		if (data.appear?.length) {
			for (const p of data.appear) {
				p && newURLSearchParams.append("appear[]", p);
			}
		}

		if (data.cost?.length) {
			for (const c of data.cost) {
				c && newURLSearchParams.append("cost[]", c);
			}
		}

		if (data.unitType?.length) {
			for (const u of data.unitType) {
				u && newURLSearchParams.append("unitType[]", u);
			}
		}

		if (data.skill?.length) {
			for (const s of data.skill) {
				s && newURLSearchParams.append("skill[]", s);
			}
		}

		if (data.power?.length) {
			for (const p of data.power) {
				p && newURLSearchParams.append("power[]", p);
			}
		}

		if (data.intelligentzia?.length) {
			for (const i of data.intelligentzia) {
				i && newURLSearchParams.append("intelligentzia[]", i);
			}
		}

		if (data.stratCost?.length) {
			for (const sc of data.stratCost) {
				sc && newURLSearchParams.append("stratCost[]", sc);
			}
		}

		if (data.stratRange?.length) {
			for (const sr of data.stratRange) {
				sr && newURLSearchParams.append("stratRange[]", sr);
			}
		}

		const searchWord = data.searchWord;
		if (searchWord) {
			newURLSearchParams.append("searchWord", searchWord);
		}

		if (data.favoriteNo?.length) {
			for (const fn of data.favoriteNo) {
				fn && newURLSearchParams.append("favoriteNo[]", fn);
			}
		}

		const isFavorite = data.isDisplayFavorite;
		if (isFavorite === "true") {
			newURLSearchParams.append("isDisplayFavorite", "true");
		}

		router.push(`/?${newURLSearchParams.toString()}`);
	};

	const MAX_COST = 9;

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
		MAX_COST,
		refWrapperElement,
	};
};
