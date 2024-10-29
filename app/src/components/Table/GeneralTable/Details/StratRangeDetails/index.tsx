import type { SearchFormData } from "@/schema/SearchForm";
import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";
import { useLogic } from "./logic";

type Props = {
	formMethod: UseFormReturn<SearchFormData>;
};

export const StratRangeDetails: React.FC<Props> = ({ formMethod }) => {
	const { stratRanges, refDetailsElement, onKeyDownSummary, onClickWrapper } =
		useLogic();

	return (
		<details ref={refDetailsElement} className="relative">
			<summary
				onKeyDown={onKeyDownSummary}
				className="w-[50px] text-black text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
			>
				範囲
			</summary>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="fixed z-10 w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.5)]"
				onClick={onClickWrapper}
			/>

			<div className="absolute z-10 bottom-[30px] right-[-10px] w-[130px] flex flex-wrap gap-1 p-1 bg-[#252423] rounded-[4px]">
				{stratRanges.map((stratRange) => (
					<div
						key={stratRange}
						className="flex items-center gap-1 text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
					>
						<input
							type="checkbox"
							value={stratRange}
							id={`stratRange_${stratRange}`}
							{...formMethod.register("stratRange")}
						/>
						<label htmlFor={`stratRange_${stratRange}`} className="text-black">
							<Image
								src={`/eiketsu-taisen-tool/images/stratRange/${stratRange}.png`}
								alt={stratRange}
								width={18}
								height={36}
							/>
						</label>
					</div>
				))}
			</div>
		</details>
	);
};
