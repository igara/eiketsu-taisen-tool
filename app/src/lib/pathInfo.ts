import { pagesPath } from "@/lib/$path";

export const pathInfo = {
	[pagesPath.$url().pathname]: {
		searchParams: {
			"color[]": "color[]",
			"period[]": "period[]",
			"appear[]": "appear[]",
			"cost[]": "cost[]",
			"unitType[]": "unitType[]",
			"power[]": "power[]",
			"intelligentzia[]": "intelligentzia[]",
			"skill[]": "skill[]",
			"stratCost[]": "stratCost[]",
			"stratRange[]": "stratRange[]",
			"favoriteNo[]": "favoriteNo[]",
			searchWord: "searchWord",
			isDisplayFavorite: "isDisplayFavorite",
			isDisableSearchForm: "isDisableSearchForm",
			isDisableOption: "isDisableOption",
		},
	},
	[pagesPath.camera.$url().pathname]: {
		searchParams: {
			"favoriteNo[]": "favoriteNo[]",
		},
	},
	[pagesPath.youtube.card_ranking.$url().pathname]: {
		searchParams: {
			date_from: "date_from",
			date_to: "date_to",
			general_name: "general_name",
		},
	},
};
