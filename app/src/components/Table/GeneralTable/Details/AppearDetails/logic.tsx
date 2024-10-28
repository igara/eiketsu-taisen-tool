import AppearsJSON from "@eiketsu-taisen-tool/data/data/json/appears.json";
import React from "react";

export const useLogic = () => {
	const appears = AppearsJSON;
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
		appears,
		refDetailsElement,
		onKeyDownSummary,
		onClickWrapper,
	};
};
