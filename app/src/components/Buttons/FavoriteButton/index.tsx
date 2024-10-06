"use client";

import type { SearchFormData } from "@/schema/SearchForm";
import type { General } from "@eiketsu-taisen-tool/data/types";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useLogic } from "./logic";

type Props = {
	general: General;
	formMethod: UseFormReturn<SearchFormData>;
	defaultSearchFavoriteNos: SearchFormData["favoriteNo"];
};

export const FavoriteButton: React.FC<Props> = ({
	general,
	formMethod,
	defaultSearchFavoriteNos,
}) => {
	const { isFavorite } = useLogic({ general, defaultSearchFavoriteNos });

	return (
		<div>
			<input
				type="checkbox"
				value={general.no}
				id={`favoriteNo_${general.no}`}
				{...formMethod.register("favoriteNo")}
				className="opacity-0 absolute"
				defaultChecked={isFavorite}
			/>
			<label
				htmlFor={`favoriteNo_${general.no}`}
				className={`flex items-center justify-center w-[32px] h-[32px] p-[4px] text-base rounded-full cursor-pointer ${isFavorite ? "text-[#eb4926] bg-[#f3b33e]" : "text-gray-600  bg-gray-400"}`}
			>
				★
			</label>
		</div>
	);
};
