import { type SearchFormData, SearchFormResolver } from "@/schema/SearchForm";
import ColorsJSON from "@eiketsu-taisen-tool/data/data/json/colors.json";
import CostsJSON from "@eiketsu-taisen-tool/data/data/json/costs.json";
import GeneralsJSON from "@eiketsu-taisen-tool/data/data/json/generals.json";
import PeriodsJSON from "@eiketsu-taisen-tool/data/data/json/periods.json";
import SkillsJSON from "@eiketsu-taisen-tool/data/data/json/skills.json";
import StratRangesJSON from "@eiketsu-taisen-tool/data/data/json/stratRanges.json";
import UnitTypesJSON from "@eiketsu-taisen-tool/data/data/json/unitTypes.json";
import type { General } from "@eiketsu-taisen-tool/data/import";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

export const useLogic = () => {
	const genNewGenerals = (data: SearchFormData) => {
		let newGenerals: General[] = GeneralsJSON;
		if (data.color?.length) {
			newGenerals = newGenerals.filter((general) => {
				return data.color?.some((c) => c === general.color.name);
			});
		}

		if (data.period?.length) {
			newGenerals = newGenerals.filter((general) => {
				return data.period?.some((p) => p === general.period);
			});
		}

		if (data.cost?.length) {
			newGenerals = newGenerals.filter((general) => {
				return data.cost?.some((p) => p === general.cost);
			});
		}

		if (data.unitType?.length) {
			newGenerals = newGenerals.filter((general) => {
				return data.unitType?.some((u) => u === general.unitType);
			});
		}

		if (data.skill?.length) {
			newGenerals = newGenerals.filter((general) => {
				return data.skill?.some(
					(s) => s && general.skill.find((gs) => gs.name === s),
				);
			});
		}

		if (data.stratRange?.length) {
			newGenerals = newGenerals.filter((general) => {
				return data.stratRange?.some((sr) => sr === general.strat.range);
			});
		}

		const searchWords = data.search_word
			? data.search_word.split(/[\u3000\u0020]+/)
			: [];

		for (const searchWord of searchWords) {
			const regex = new RegExp(`${searchWord}`, "i");

			newGenerals = newGenerals.filter((general) => {
				return (
					regex.test(general.name) ||
					regex.test(general.kanaName) ||
					regex.test(general.strat.name) ||
					regex.test(general.strat.kanaName) ||
					regex.test(general.strat.time) ||
					regex.test(JSON.stringify(general.strat.categories)) ||
					regex.test(general.strat.description)
				);
			});
		}

		return newGenerals;
	};

	const router = useRouter();
	const searchParams = useSearchParams();

	const defaultSelectedColors = searchParams.getAll("color[]");
	const defaultSelectedPeriods = searchParams.getAll("period[]");
	const defaultSelectedCosts = searchParams.getAll("cost[]");
	const defaultSelectedUnitTypes = searchParams.getAll("unitType[]");
	const defaultSelectedSkills = searchParams.getAll("skill[]");
	const defaultSelectedStratRanges = searchParams.getAll("stratRange[]");
	const defaultSearchWord = searchParams.get("search_word");

	const colors = ColorsJSON;
	const periods = PeriodsJSON;
	const costs = CostsJSON;
	const unitTypes = UnitTypesJSON;
	const skills = SkillsJSON;
	const stratRanges = StratRangesJSON;

	const generals = genNewGenerals({
		color: defaultSelectedColors,
		period: defaultSelectedPeriods,
		cost: defaultSelectedCosts,
		unitType: defaultSelectedUnitTypes,
		skill: defaultSelectedSkills,
		stratRange: defaultSelectedStratRanges,
		search_word: defaultSearchWord || "",
	});

	const refTableScrollElement = React.useRef<HTMLDivElement>(null);
	const refColorDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refPeriodDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refCostDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refUnitTypeDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refSkillDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refStratRangesDetailsElement = React.useRef<HTMLDetailsElement>(null);

	const formMethod = useForm<SearchFormData>({
		resolver: SearchFormResolver,
		defaultValues: {
			color: defaultSelectedColors,
			period: defaultSelectedPeriods,
			cost: defaultSelectedCosts,
			unitType: defaultSelectedUnitTypes,
			skill: defaultSelectedSkills,
			stratRange: defaultSelectedStratRanges,
			search_word: defaultSearchWord || "",
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
	const onClickStratRangesDetails: React.FormEventHandler<HTMLElement> = (
		e,
	) => {
		e.preventDefault();
		if (refStratRangesDetailsElement.current !== null) {
			refStratRangesDetailsElement.current.open =
				!refStratRangesDetailsElement.current.open;
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

		if (data.stratRange?.length) {
			for (const sr of data.stratRange) {
				sr && newURLSearchParams.append("stratRange[]", sr);
			}
		}

		const searchWord = data.search_word;
		if (searchWord) {
			newURLSearchParams.append("search_word", searchWord);
		}

		const tableScrollElement = refTableScrollElement.current;

		if (tableScrollElement !== null) {
			tableScrollElement.scrollTop = 0;
		}

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
		if (refStratRangesDetailsElement.current !== null) {
			refStratRangesDetailsElement.current.open = false;
		}

		router.push(`/?${newURLSearchParams.toString()}`);
	};

	const onClickReset: React.FormEventHandler<HTMLButtonElement> = () => {
		formMethod.setValue("color", []);
		formMethod.setValue("period", []);
		formMethod.setValue("cost", []);
		formMethod.setValue("unitType", []);
		formMethod.setValue("skill", []);
		formMethod.setValue("stratRange", []);
		formMethod.setValue("search_word", "");

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
		if (refStratRangesDetailsElement.current !== null) {
			refStratRangesDetailsElement.current.open = false;
		}

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
		if (!refStratRangesDetailsElement.current) return;

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

		if (!refStratRangesDetailsElement.current?.contains(target)) {
			refStratRangesDetailsElement.current.open = false;
		}
	};

	return {
		generals,
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
		onClickColorDetails,
		onClickPeriodDetails,
		onClickCostDetails,
		onClickUnitTypeDetails,
		onClickSkillDetails,
		onClickStratRangesDetails,
		onClickReset,
		refTableScrollElement,
		defaultSelectedColors,
		defaultSelectedPeriods,
		defaultSelectedCosts,
		defaultSelectedUnitTypes,
		defaultSelectedSkills,
		defaultSelectedStratRanges,
		defaultSearchWord,
	};
};
