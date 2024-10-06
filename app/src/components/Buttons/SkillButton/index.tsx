"use client";

import type { Skill } from "@eiketsu-taisen-tool/data/types";
import type React from "react";
import { useLogic } from "./logic";

type Props = {
	skill: Skill;
};

export const SkillButton: React.FC<Props> = ({ skill }) => {
	const { isDisplay, onClick } = useLogic();

	return (
		<span className="relative">
			<span
				className={`${isDisplay ? "" : "hidden"} bg-[#efe6cb] absolute w-[50dvw] top-[-50%] left-[40px] border-black border-2 p-[4px] mt-[4px] z-10`}
			>
				{skill.description}
			</span>

			<button
				type="button"
				onClick={onClick}
				className="text-black text-xs p-[4px] border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947]"
			>
				{skill.name}
			</button>
		</span>
	);
};
