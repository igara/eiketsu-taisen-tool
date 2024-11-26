import type { SearchFormData } from "@/schema/SearchForm";
import React from "react";
import type { UseFormReturn } from "react-hook-form";

type Args = {
	formMethod: UseFormReturn<SearchFormData>;
};

export const useLogic = ({ formMethod }: Args) => {
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
