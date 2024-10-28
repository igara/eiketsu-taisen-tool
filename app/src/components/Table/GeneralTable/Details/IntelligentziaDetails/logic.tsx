import IntelligentziasJSON from "@eiketsu-taisen-tool/data/data/json/intelligentzias.json";
import React from "react";

export const useLogic = () => {
	const intelligentzias = IntelligentziasJSON;
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
		intelligentzias,
		refDetailsElement,
		onKeyDownSummary,
		onClickWrapper,
	};
};
