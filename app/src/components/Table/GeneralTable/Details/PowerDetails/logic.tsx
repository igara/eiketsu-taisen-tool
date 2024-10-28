import PowersJSON from "@eiketsu-taisen-tool/data/data/json/powers.json";
import React from "react";

export const useLogic = () => {
	const powers = PowersJSON;
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
		powers,
		refDetailsElement,
		onKeyDownSummary,
		onClickWrapper,
	};
};
