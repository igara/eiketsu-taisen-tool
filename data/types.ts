export type Skill = {
	name: string;
	shortName: string;
	description: string;
};

export type General = {
	no: string;
	id: string;
	detailImageId: string;
	name: string;
	kanaName: string;
	color: {
		name: string;
		r: string;
		g: string;
		b: string;
	};
	period: string;
	cost: string;
	unitType: string;
	strat: {
		name: string;
		kanaName: string;
		cost: string;
		description: string;
		categories: string[];
		time: string;
		range: string;
	};
	power: string;
	intelligentzia: string;
	skill: Skill[];
	kabuki: string;
	url: {
		official: string;
		atWiki?: string;
		gameWiki?: string;
	};
};
