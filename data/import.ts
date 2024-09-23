import fs from "node:fs";

type Base = {
	data: string[];
	path: string[];
	general: string[];
	color: string[];
	period: string[];
	generalAppearVer: string[];
	generalAppearFilterGroup: string[];
	indexInitial: string[];
	cardType: string[];
	cost: string[];
	generalRarity: string[];
	unitType: string[];
	skill: string[];
	strat: string[];
	stratCategory: string[];
	stratRange: string[];
	stratTime: string[];
	illust: string[];
	illustView: string[];
	cv: string[];
	equip: string[];
	equipRarity: string[];
	equipEffectMain: string[];
	equipEffectSub: string[];
	equipFilter: string[];
	equipEffectSystem: string[];
	equipEffectSystemColorType: string[];
	school: string[];
	schoolDetail: string[];
	schoolLevel: string[];
	appearPattern: string[];
	wayToGet: string[];
	soul: string[];
	soulEffect: string[];
	soulEffectColorType: string[];
	soulRarity: string[];
	equipCategory: string[];
	playerData: null;
	playerequip: null;
	playersoul: string[];
	kabuki: string[];
	kabukiRank: string[];
	message: null;
	error_id: number;
};

export type Skill = {
	name: string;
	shortName: string;
	description: string;
};

const main = async () => {
	const result = await fetch("https://eiketsu-taisen.net/datalist/api/base");
	const baseJSON: Base = await result.json();

	const colors = baseJSON.color.map((color) => {
		const c = color.split(",");
		return c[1];
	});
	fs.writeFileSync("colors.json", JSON.stringify(colors, null, 2));

	const periods = baseJSON.period.map((period) => {
		const p = period.split(",");
		return p[1];
	});
	fs.writeFileSync("periods.json", JSON.stringify(periods, null, 2));

	const costs = baseJSON.cost.map((cost) => {
		const c = cost.split(",");
		return c[1];
	});
	fs.writeFileSync("costs.json", JSON.stringify(costs, null, 2));

	const unitTypes = baseJSON.unitType.map((unitType) => {
		const u = unitType.split(",");
		return u[1];
	});
	fs.writeFileSync("unitTypes.json", JSON.stringify(unitTypes, null, 2));

	const skills = baseJSON.skill.map((skill) => {
		const s = skill.split(",");
		return {
			name: s[1],
			shortName: s[2],
			description: s[3],
		};
	});
	fs.writeFileSync("skills.json", JSON.stringify(skills, null, 2));

	const stratCategories = baseJSON.stratCategory.map((stratCategory) => {
		const sc = stratCategory.split(",");
		return sc[1];
	});
	fs.writeFileSync(
		"stratCategories.json",
		JSON.stringify(stratCategories, null, 2),
	);

	const stratRanges = baseJSON.stratRange;
	fs.writeFileSync("stratRanges.json", JSON.stringify(stratRanges, null, 2));

	const stratTimes = baseJSON.stratTime;
	fs.writeFileSync("stratTimes.json", JSON.stringify(stratTimes, null, 2));

	const strats = baseJSON.strat.map((strat) => {
		const s = strat.split(",");
		const category = Number.parseInt(s[5]);
		const range = Number.parseInt(s[6]);
		const time = Number.parseInt(s[7]);

		return {
			name: s[1],
			kanaName: s[2],
			cost: s[3],
			description: s[4],
			category,
			range,
			time,
		};
	});
	// const illusts = baseJSON.illust;
	// const cv = baseJSON.cv;

	const generals = baseJSON.general.map((general) => {
		const g = general.split(",");
		const strat = strats[Number.parseInt(g[22])];
		const skill: Skill[] = [];

		const skill1 = Number.parseInt(g[19]);
		const skill2 = Number.parseInt(g[20]);
		const skill3 = Number.parseInt(g[21]);
		if (skill1 !== -1) {
			const s = skills[skill1];
			skill.push({
				name: s.name,
				shortName: s.shortName,
				description: s.description,
			});
		}
		if (skill2 !== -1) {
			const s = skills[skill2];
			skill.push({
				name: s.name,
				shortName: s.shortName,
				description: s.description,
			});
		}
		if (skill3 !== -1) {
			const s = skills[skill3];
			skill.push({
				name: s.name,
				shortName: s.shortName,
				description: s.description,
			});
		}

		return {
			id: g[0],
			detailImageId: g[1],
			name: g[3],
			kanaName: g[4],
			color: colors[Number.parseInt(g[5])],
			period: periods[Number.parseInt(g[6])],
			cost: costs[Number.parseInt(g[13])],
			unitType: unitTypes[Number.parseInt(g[15])],
			strat: {
				name: strat.name,
				kanaName: strat.kanaName,
				cost: strat.cost,
				description: strat.description,
				category: stratCategories[strat.category],
				time: stratTimes[strat.time],
				range: stratRanges[strat.range],
			},
			power: g[17],
			intelligentzia: g[18],
			skill,
		};
	});

	fs.writeFileSync("generals.json", JSON.stringify(generals, null, 2));
};
main();

export type General = {
	id: string;
	detailImageId: string;
	name: string;
	kanaName: string;
	color: string;
	period: string;
	cost: string;
	unitType: string;
	strat: {
		name: string;
		kanaName: string;
		cost: string;
		description: string;
		category: string;
		time: string;
		range: string;
	};
	power: string;
	intelligentzia: string;
	skill: Skill[];
};
