import { type SearchFormData, SearchFormResolver } from "@/schema/SearchForm";
import ColorsJSON from "@eiketsu-taisen-tool/data/colors.json";
import CostsJSON from "@eiketsu-taisen-tool/data/costs.json";
import GeneralsJSON from "@eiketsu-taisen-tool/data/generals.json";
import type { General } from "@eiketsu-taisen-tool/data/import";
import PeriodsJSON from "@eiketsu-taisen-tool/data/periods.json";
import SkillsJSON from "@eiketsu-taisen-tool/data/skills.json";
import UnitTypesJSON from "@eiketsu-taisen-tool/data/unitTypes.json";
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

		return newGenerals;
	};

	const router = useRouter();
	const searchParams = useSearchParams();

	const defaultSelectedColors = searchParams.getAll("color[]");
	const defaultSelectedPeriods = searchParams.getAll("period[]");
	const defaultSelectedCosts = searchParams.getAll("cost[]");
	const defaultSelectedUnitTypes = searchParams.getAll("unitType[]");
	const defaultSelectedSkills = searchParams.getAll("skill[]");

	const colors = ColorsJSON;
	const periods = PeriodsJSON;
	const costs = CostsJSON;
	const unitTypes = UnitTypesJSON;
	const skills = SkillsJSON;

	const generals = genNewGenerals({
		color: defaultSelectedColors,
		period: defaultSelectedPeriods,
		cost: defaultSelectedCosts,
		unitType: defaultSelectedUnitTypes,
		skill: defaultSelectedSkills,
	});

	const refTableScrollElement = React.useRef<HTMLDivElement>(null);
	const refColorDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refPeriodDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refCostDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refUnitTypeDetailsElement = React.useRef<HTMLDetailsElement>(null);
	const refSkillDetailsElement = React.useRef<HTMLDetailsElement>(null);

	const formMethod = useForm<SearchFormData>({
		resolver: SearchFormResolver,
		defaultValues: {
			color: defaultSelectedColors,
			period: defaultSelectedPeriods,
			cost: defaultSelectedCosts,
			unitType: defaultSelectedUnitTypes,
			skill: defaultSelectedSkills,
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

	const onSubmit: SubmitHandler<SearchFormData> = (data) => {
		const newURLSearchParams = new URLSearchParams();

		if (data.color?.length) {
			// biome-ignore lint/complexity/noForEach: <explanation>
			data.color.forEach((c) => {
				c && newURLSearchParams.append("color[]", c);
			});
		}

		if (data.period?.length) {
			// biome-ignore lint/complexity/noForEach: <explanation>
			data.period.forEach((p) => {
				p && newURLSearchParams.append("period[]", p);
			});
		}

		if (data.cost?.length) {
			// biome-ignore lint/complexity/noForEach: <explanation>
			data.cost.forEach((c) => {
				c && newURLSearchParams.append("cost[]", c);
			});
		}

		if (data.unitType?.length) {
			// biome-ignore lint/complexity/noForEach: <explanation>
			data.unitType.forEach((u) => {
				u && newURLSearchParams.append("unitType[]", u);
			});
		}

		if (data.skill?.length) {
			// biome-ignore lint/complexity/noForEach: <explanation>
			data.skill.forEach((s) => {
				s && newURLSearchParams.append("skill[]", s);
			});
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

		router.push(`/?${newURLSearchParams.toString()}`);
	};

	const onClickReset: React.FormEventHandler<HTMLButtonElement> = () => {
		formMethod.setValue("color", []);
		formMethod.setValue("period", []);
		formMethod.setValue("cost", []);
		formMethod.setValue("unitType", []);
		formMethod.setValue("skill", []);

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

		const tableScrollElement = refTableScrollElement.current;

		if (tableScrollElement !== null) {
			tableScrollElement.scrollTop = 0;
		}

		router.push("/");
	};

	return {
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
	};
};
