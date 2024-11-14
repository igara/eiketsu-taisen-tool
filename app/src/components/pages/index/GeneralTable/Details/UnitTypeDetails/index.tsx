import type { SearchFormData } from "@/schema/SearchForm";
import type { UseFormReturn } from "react-hook-form";
import { useLogic } from "./logic";

type Props = {
	formMethod: UseFormReturn<SearchFormData>;
};

export const UnitTypeDetails: React.FC<Props> = ({ formMethod }) => {
	const { unitTypes, refDetailsElement, onKeyDownSummary, onClickWrapper } =
		useLogic();

	return (
		<details ref={refDetailsElement} className="relative">
			<summary
				onKeyDown={onKeyDownSummary}
				className="text-black text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
			>
				兵種
			</summary>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="fixed z-10 w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.5)]"
				onClick={onClickWrapper}
			/>

			<div className="absolute z-10 bottom-[28px] w-[80px] flex flex-col gap-1 p-1 bg-[#252423] rounded-[4px]">
				{unitTypes.map((unitType) => (
					<div
						key={unitType}
						className="flex items-center gap-1 text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
					>
						<input
							type="checkbox"
							value={unitType}
							id={`unitType_${unitType}`}
							{...formMethod.register("unitType")}
						/>
						<label htmlFor={`unitType_${unitType}`} className="text-black">
							{unitType}
						</label>
					</div>
				))}
			</div>
		</details>
	);
};
