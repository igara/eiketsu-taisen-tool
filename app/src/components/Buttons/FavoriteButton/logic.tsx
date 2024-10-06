import type { SearchFormData } from "@/schema/SearchForm";
import type { General } from "@eiketsu-taisen-tool/data/types";
import type { UseFormReturn } from "react-hook-form";

type Args = {
	general: General;
	formMethod: UseFormReturn<SearchFormData>;
};

export const useLogic = ({ general, formMethod }: Args) => {
	const favoriteNos = formMethod.getValues("favoriteNo");
	const isFavorite = !!favoriteNos?.includes(general.no);

	return {
		isFavorite,
	};
};
