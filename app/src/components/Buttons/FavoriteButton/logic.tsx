import type { SearchFormData } from "@/schema/SearchForm";
import type { General } from "@eiketsu-taisen-tool/data/types";

type Args = {
	general?: General;
	defaultSearchFavoriteNos: SearchFormData["favoriteNo"];
};

export const useLogic = ({ general, defaultSearchFavoriteNos }: Args) => {
	const isFavorite = !!defaultSearchFavoriteNos?.includes(general?.no);

	return {
		isFavorite,
	};
};
