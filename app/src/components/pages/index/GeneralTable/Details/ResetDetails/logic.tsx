import { pathInfo } from "@/lib/pathInfo";
import type { SearchFormData } from "@/schema/SearchForm";
import SkillsJSON from "@eiketsu-taisen-tool/data/data/json/skills.json";
import { useRouter } from "next/navigation";
import React from "react";
import type { UseFormReturn } from "react-hook-form";

type Args = {
	formMethod: UseFormReturn<SearchFormData>;
	defaultSearchFavoriteNos: string[];
	defaultIsDisplayFavorite: string | null;
};

export const useLogic = ({
	formMethod,
	defaultSearchFavoriteNos,
	defaultIsDisplayFavorite,
}: Args) => {
	const router = useRouter();
	const refDetailsElement = React.useRef<HTMLDetailsElement>(null);

	const onKeyDownSummary: React.FormEventHandler<HTMLElement> = (e) => {
		e.preventDefault();

		if (refDetailsElement.current !== null) {
			refDetailsElement.current.open = !refDetailsElement.current.open;
		}
	};

	const onClickWrapper: React.MouseEventHandler<HTMLDivElement> = (e) => {
		e.stopPropagation();

		if (refDetailsElement.current !== null) {
			refDetailsElement.current.open = false;
		}
	};

	const onClickSearchReset: React.FormEventHandler<HTMLButtonElement> = () => {
		formMethod.setValue("color", []);
		formMethod.setValue("period", []);
		formMethod.setValue("appear", []);
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

		const newURLSearchParams = new URLSearchParams();
		if (defaultSearchFavoriteNos.length) {
			for (const fn of defaultSearchFavoriteNos) {
				newURLSearchParams.append(
					pathInfo["/"].searchParams["favoriteNo[]"],
					fn,
				);
			}
		}

		if (defaultIsDisplayFavorite === "true") {
			newURLSearchParams.append(
				pathInfo["/"].searchParams.isDisplayFavorite,
				"true",
			);
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
		formMethod.setValue("appear", []);
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

		router.push("/");
	};

	return {
		refDetailsElement,
		onKeyDownSummary,
		onClickWrapper,
		onClickSearchReset,
		onClickAllReset,
	};
};
