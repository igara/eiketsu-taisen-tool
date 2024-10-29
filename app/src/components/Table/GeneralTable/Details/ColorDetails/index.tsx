import type { SearchFormData } from "@/schema/SearchForm";
import type { UseFormReturn } from "react-hook-form";
import { useLogic } from "./logic";

type Props = {
	formMethod: UseFormReturn<SearchFormData>;
};

export const ColorDetails: React.FC<Props> = ({ formMethod }) => {
	const { colors, refDetailsElement, onKeyDownSummary, onClickWrapper } =
		useLogic();

	return (
		<details ref={refDetailsElement} className="relative">
			<summary
				onKeyDown={onKeyDownSummary}
				className="text-black text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
			>
				勢力
			</summary>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="fixed z-10 w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.5)]"
				onClick={onClickWrapper}
			/>

			<div className="absolute z-10 bottom-[28px] flex flex-col gap-1 p-1 bg-[#252423] rounded-[4px]">
				{colors.map((color) => (
					<div
						key={color.name}
						className="bg-white border-2 border-white rounded-lg focus:outline-none overflow-hidden"
					>
						<div
							className="flex items-center gap-1 p-1 text-xs"
							style={{
								background: `rgba(${color.r},${color.g},${color.b},0.2)`,
							}}
						>
							<input
								type="checkbox"
								value={color.name}
								id={`color_${color.name}`}
								{...formMethod.register("color")}
							/>
							<label
								htmlFor={`color_${color.name}`}
								style={{
									color: `rgb(${color.r},${color.g},${color.b})`,
								}}
							>
								{color.name}
							</label>
						</div>
					</div>
				))}
			</div>
		</details>
	);
};
