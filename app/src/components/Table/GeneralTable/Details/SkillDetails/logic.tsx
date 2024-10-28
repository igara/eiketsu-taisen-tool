import SkillsJSON from "@eiketsu-taisen-tool/data/data/json/skills.json";
import React from "react";

export const useLogic = () => {
	const skills = SkillsJSON;
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
		skills,
		refDetailsElement,
		onKeyDownSummary,
		onClickWrapper,
	};
};
