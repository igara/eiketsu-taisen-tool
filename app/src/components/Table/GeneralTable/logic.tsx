import { type SearchFormData, SearchFormResolver } from "@/schema/SearchForm";
import ColorsJSON from "@eiketsu-taisen-tool/data/data/json/colors.json";
import CostsJSON from "@eiketsu-taisen-tool/data/data/json/costs.json";
import GeneralsJSON from "@eiketsu-taisen-tool/data/data/json/generals.json";
import IntelligentziasJSON from "@eiketsu-taisen-tool/data/data/json/intelligentzias.json";
import PeriodsJSON from "@eiketsu-taisen-tool/data/data/json/periods.json";
import PowersJSON from "@eiketsu-taisen-tool/data/data/json/powers.json";
import SkillsJSON from "@eiketsu-taisen-tool/data/data/json/skills.json";
import StratCostsJSON from "@eiketsu-taisen-tool/data/data/json/stratCosts.json";
import StratRangesJSON from "@eiketsu-taisen-tool/data/data/json/stratRanges.json";
import UnitTypesJSON from "@eiketsu-taisen-tool/data/data/json/unitTypes.json";
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
				searchCount: 0,
			} as {
				generals: GeneralUI[];
				favoriteCount: {
					card: number;
					power: number;
					intelligentzia: number;
					cost: number;
				};
				searchCount: number;
			},
		);

		return newGeneralInfo;
	};

	const router = useRouter();
	const searchParams = useSearchParams();

	const defaultSelectedColors = searchParams.getAll("color[]");
	const defaultSelectedPeriods = searchParams.getAll("period[]");
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

	const colors = ColorsJSON;
	const periods = PeriodsJSON;
	const costs = CostsJSON;
	const unitTypes = UnitTypesJSON;
	const skills = SkillsJSON;
	const powers = PowersJSON;
	const intelligentzias = IntelligentziasJSON;
	const stratCosts = StratCostsJSON;
	const stratRanges = StratRangesJSON;

	const isDisplayFavorite = defaultIsDisplayFavorite === "true";
	const isDisableSearchForm = defaultIsDisableSearchForm === "true";
	const isDisableOption = defaultIsDisableOption === "true";

	const generalInfo = genNewGeneralInfo({
		color: defaultSelectedColors,
		period: defaultSelectedPeriods,
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

	const refTableScrollElement = React.useRef<HTMLFormElement>(null);
	const refColorDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refPeriodDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refCostDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refUnitTypeDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refSkillDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refPowersDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refIntelligentziasDetailsElement =
		React.useRef<HTMLDetailsElement>(null);
	const refStratCostsDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refStratRangesDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refResetDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refDisplayDetailsElement = React.useRef<HTMLDetailsElement>(null);

	const formMethod = useForm<SearchFormData>({
		resolver: SearchFormResolver,
		defaultValues: {
			color: defaultSelectedColors,
			period: defaultSelectedPeriods,
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

	const onClickColorDetails: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		if (refColorDetailsElement.current !== null) {
			refColorDetailsElement.current.open =
				!refColorDetailsElement.current.open;
		}
	};
	const onClickPeriodDetails: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		if (refPeriodDetailsElement.current !== null) {
			refPeriodDetailsElement.current.open =
				!refPeriodDetailsElement.current.open;
		}
	};
	const onClickCostDetails: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		if (refCostDetailsElement.current !== null) {
			refCostDetailsElement.current.open = !refCostDetailsElement.current.open;
		}
	};
	const onClickUnitTypeDetails: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		if (refUnitTypeDetailsElement.current !== null) {
			refUnitTypeDetailsElement.current.open =
				!refUnitTypeDetailsElement.current.open;
		}
	};
	const onClickSkillDetails: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		if (refSkillDetailsElement.current !== null) {
			refSkillDetailsElement.current.open =
				!refSkillDetailsElement.current.open;
		}
	};
	const onClickPowersDetails: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		if (refPowersDetailsElement.current !== null) {
			refPowersDetailsElement.current.open =
				!refPowersDetailsElement.current.open;
		}
	};
	const onClickIntelligentziasDetails: React.FormEventHandler<HTMLElement> = (
		e,
	) => {
		e.preventDefault();
		if (refIntelligentziasDetailsElement.current !== null) {
			refIntelligentziasDetailsElement.current.open =
				!refIntelligentziasDetailsElement.current.open;
		}
	};
	const onClickStratRangesDetails: React.FormEventHandler<HTMLElement> = (
		e,
	) => {
		e.preventDefault();
		if (refStratRangesDetailsElement.current !== null) {
			refStratRangesDetailsElement.current.open =
				!refStratRangesDetailsElement.current.open;
		}
	};
	const onClickStratCostsDetails: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		if (refStratCostsDetailsElement.current !== null) {
			refStratCostsDetailsElement.current.open =
				!refStratCostsDetailsElement.current.open;
		}
	};
	const onClickResetDetails: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		if (refResetDetailsElement.current !== null) {
			refResetDetailsElement.current.open =
				!refResetDetailsElement.current.open;
		}
	};
	const onClickDisplayDetails: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();
		if (refDisplayDetailsElement.current !== null) {
			refDisplayDetailsElement.current.open =
				!refDisplayDetailsElement.current.open;
		}
	};

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

	const closeAllDetails = () => {
		if (refColorDetailsElement.current !== null) {
			refColorDetailsElement.current.open = false;
		}
		if (refPeriodDetailsElement.current !== null) {
			refPeriodDetailsElement.current.open = false;
		}
		if (refCostDetailsElement.current !== null) {
			refCostDetailsElement.current.open = false;
		}
		if (refUnitTypeDetailsElement.current !== null) {
			refUnitTypeDetailsElement.current.open = false;
		}
		if (refSkillDetailsElement.current !== null) {
			refSkillDetailsElement.current.open = false;
		}
		if (refPowersDetailsElement.current !== null) {
			refPowersDetailsElement.current.open = false;
		}
		if (refIntelligentziasDetailsElement.current !== null) {
			refIntelligentziasDetailsElement.current.open = false;
		}
		if (refStratCostsDetailsElement.current !== null) {
			refStratCostsDetailsElement.current.open = false;
		}
		if (refStratRangesDetailsElement.current !== null) {
			refStratRangesDetailsElement.current.open = false;
		}
		if (refResetDetailsElement.current !== null) {
			refResetDetailsElement.current.open = false;
		}
		if (refDisplayDetailsElement.current !== null) {
			refDisplayDetailsElement.current.open = false;
		}
	};

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

		const tableScrollElement = refTableScrollElement.current;

		if (tableScrollElement !== null) {
			tableScrollElement.scrollTop = 0;
		}

		closeAllDetails();

		router.push(`/?${newURLSearchParams.toString()}`);
	};

	const onClickSearchReset: React.FormEventHandler<HTMLButtonElement> = () => {
		formMethod.setValue("color", []);
		formMethod.setValue("period", []);
		formMethod.setValue("cost", []);
		formMethod.setValue("unitType", []);
		formMethod.setValue("skill", []);
		formMethod.setValue("power", []);
		formMethod.setValue("intelligentzia", []);
		formMethod.setValue("stratCost", []);
		formMethod.setValue("stratRange", []);
		formMethod.setValue("searchWord", "");
		formMethod.setValue("favoriteNo", defaultSearchFavoriteNos);
		formMethod.setValue(
			"isDisplayFavorite",
			defaultIsDisplayFavorite === "true" ? "true" : undefined,
		);

		closeAllDetails();

		const tableScrollElement = refTableScrollElement.current;

		if (tableScrollElement !== null) {
			tableScrollElement.scrollTop = 0;
		}

		const newURLSearchParams = new URLSearchParams();
		if (defaultSearchFavoriteNos.length) {
			for (const fn of defaultSearchFavoriteNos) {
				newURLSearchParams.append("favoriteNo[]", fn);
			}
		}

		if (defaultIsDisplayFavorite === "true") {
			newURLSearchParams.append("isDisplayFavorite", "true");
		}

		if (
			defaultSearchFavoriteNos.length ||
			defaultIsDisplayFavorite === "true"
		) {
			router.push(`/?${newURLSearchParams.toString()}`);
			return;
		}

		router.push("/");
	};

	const onClickAllReset: React.FormEventHandler<HTMLButtonElement> = () => {
		formMethod.setValue("color", []);
		formMethod.setValue("period", []);
		formMethod.setValue("cost", []);
		formMethod.setValue("unitType", []);
		formMethod.setValue("skill", []);
		formMethod.setValue("power", []);
		formMethod.setValue("intelligentzia", []);
		formMethod.setValue("stratCost", []);
		formMethod.setValue("stratRange", []);
		formMethod.setValue("searchWord", "");
		formMethod.setValue("favoriteNo", []);
		formMethod.setValue("isDisplayFavorite", undefined);

		closeAllDetails();

		const tableScrollElement = refTableScrollElement.current;

		if (tableScrollElement !== null) {
			tableScrollElement.scrollTop = 0;
		}

		router.push("/");
	};

	React.useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleClickOutside = (e: MouseEvent) => {
		const target = e.target as Node;
		if (!target) return;

		if (!refColorDetailsElement.current) return;
		if (!refPeriodDetailsElement.current) return;
		if (!refCostDetailsElement.current) return;
		if (!refUnitTypeDetailsElement.current) return;
		if (!refSkillDetailsElement.current) return;
		if (!refPowersDetailsElement.current) return;
		if (!refIntelligentziasDetailsElement.current) return;
		if (!refStratCostsDetailsElement.current) return;
		if (!refStratRangesDetailsElement.current) return;
		if (!refResetDetailsElement.current) return;
		if (!refDisplayDetailsElement.current) return;

		if (!refColorDetailsElement.current?.contains(target)) {
			refColorDetailsElement.current.open = false;
		}

		if (!refPeriodDetailsElement.current?.contains(target)) {
			refPeriodDetailsElement.current.open = false;
		}

		if (!refCostDetailsElement.current?.contains(target)) {
			refCostDetailsElement.current.open = false;
		}

		if (!refUnitTypeDetailsElement.current?.contains(target)) {
			refUnitTypeDetailsElement.current.open = false;
		}

		if (!refSkillDetailsElement.current?.contains(target)) {
			refSkillDetailsElement.current.open = false;
		}

		if (!refPowersDetailsElement.current?.contains(target)) {
			refPowersDetailsElement.current.open = false;
		}

		if (!refIntelligentziasDetailsElement.current?.contains(target)) {
			refIntelligentziasDetailsElement.current.open = false;
		}

		if (!refStratCostsDetailsElement.current?.contains(target)) {
			refStratCostsDetailsElement.current.open = false;
		}

		if (!refStratRangesDetailsElement.current?.contains(target)) {
			refStratRangesDetailsElement.current.open = false;
		}

		if (!refResetDetailsElement.current?.contains(target)) {
			refResetDetailsElement.current.open = false;
		}

		if (!refDisplayDetailsElement.current?.contains(target)) {
			refDisplayDetailsElement.current.open = false;
		}
	};

	const MAX_COST = 9;

	return {
		isDisplayFavorite,
		isDisableSearchForm,
		isDisableOption,
		generalInfo,
		colors,
		periods,
		costs,
		unitTypes,
		skills,
		powers,
		intelligentzias,
		stratCosts,
		stratRanges,
		formMethod,
		onSubmit,
		refColorDetailsElement,
		refPeriodDetailsElement,
		refCostDetailsElement,
		refUnitTypeDetailsElement,
		refSkillDetailsElement,
		refPowersDetailsElement,
		refIntelligentziasDetailsElement,
		refStratCostsDetailsElement,
		refStratRangesDetailsElement,
		refResetDetailsElement,
		refDisplayDetailsElement,
		onClickColorDetails,
		onClickPeriodDetails,
		onClickCostDetails,
		onClickUnitTypeDetails,
		onClickSkillDetails,
		onClickPowersDetails,
		onClickIntelligentziasDetails,
		onClickStratCostsDetails,
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
		defaultSelectedPowers,
		defaultSelectedIntelligentzias,
		defaultSelectedStratCosts,
		defaultSelectedStratRanges,
		defaultSearchWord,
		defaultSearchFavoriteNos,
		MAX_COST,
	};
};
