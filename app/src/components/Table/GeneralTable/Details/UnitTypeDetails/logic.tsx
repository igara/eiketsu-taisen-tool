import UnitTypesJSON from "@eiketsu-taisen-tool/data/data/json/unitTypes.json";
import React from "react";

export const useLogic = () => {
	const unitTypes = UnitTypesJSON;
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
		unitTypes,
		refDetailsElement,
		onKeyDownSummary,
		onClickWrapper,
	};
};
