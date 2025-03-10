import CostsJSON from "@eiketsu-taisen-tool/data/data/json/costs.json";
import React from "react";

export const useLogic = () => {
	const costs = CostsJSON;
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
		costs,
		refDetailsElement,
		onKeyDownSummary,
		onClickWrapper,
	};
};
