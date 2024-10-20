import { pagesPath } from "@/lib/$path";

export const pathInfo = {
	[pagesPath.$url().pathname]: {
		searchParams: {
			"color[]": "color[]",
			"period[]": "period[]",
			"cost[]": "cost[]",
			"unitType[]": "unitType[]",
			"skill[]": "skill[]",
			"stratRange[]": "stratRange[]",
			"favoriteNo[]": "favoriteNo[]",
			searchWord: "searchWord",
			isDisplayFavorite: "isDisplayFavorite",
			isDisableHeader: "isDisableHeader",
			isDisableOption: "isDisableOption",
		},
	},
};
