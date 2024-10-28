import type { SearchFormData } from "@/schema/SearchForm";
import SkillsJSON from "@eiketsu-taisen-tool/data/data/json/skills.json";
import { useRouter } from "next/navigation";
import React from "react";
import type { UseFormReturn } from "react-hook-form";

type Args = {
	formMethod: UseFormReturn<SearchFormData>;
};

export const useLogic = ({ formMethod }: Args) => {
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

	return {
		refDetailsElement,
		onKeyDownSummary,
		onClickWrapper,
	};
};
