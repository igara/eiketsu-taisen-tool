"use client";

import type { Skill } from "@eiketsu-taisen-tool/data/import";
import React from "react";

type Props = {
	skill: Skill;
};

export const SkillButton: React.FC<Props> = ({ skill }) => {
	const [isDisplay, setIsDisplay] = React.useState(false);
	const onClick = () => {
		setIsDisplay(!isDisplay);
	};

	return (
		<span className="relative">
			<span
				className={`${isDisplay ? "" : "hidden"} absolute w-[50dvw] top-[28px] bg-white dark:bg-black border-black dark:border-white border-2 p-[4px]`}
			>
				{skill.description}
			</span>

			<button
				type="button"
				onClick={onClick}
				className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm p-[4px] dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
			>
				{skill.name}
			</button>
		</span>
	);
};
