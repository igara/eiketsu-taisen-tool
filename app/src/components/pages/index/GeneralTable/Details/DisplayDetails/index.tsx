import type { SearchFormData } from "@/schema/SearchForm";
import type { UseFormReturn } from "react-hook-form";
import { useLogic } from "./logic";

type Props = {
	formMethod: UseFormReturn<SearchFormData>;
	isDisableSearchForm: boolean;
	isDisableOption: boolean;
};

export const DisplayDetails: React.FC<Props> = ({
	formMethod,
	isDisableSearchForm,
	isDisableOption,
}) => {
	const { refDetailsElement, onKeyDownSummary, onClickWrapper } = useLogic({
		formMethod,
	});

	return (
		<details ref={refDetailsElement} className="relative">
			<summary
				onKeyDown={onKeyDownSummary}
				className="text-black text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]"
			>
				表示切り替え
			</summary>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="fixed z-10 w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.5)]"
				onClick={onClickWrapper}
			/>

			<div className="absolute z-10 bottom-[28px] w-[100px] flex flex-col gap-1 p-1 bg-[#252423] rounded-[4px]">
				<div className="flex items-center gap-1 text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]">
					<input
						type="checkbox"
						value="true"
						id="isDisableSearchForm"
						{...formMethod.register("isDisableSearchForm")}
						checked={!isDisableSearchForm}
					/>
					<label htmlFor="isDisableSearchForm" className="text-black">
						検索入力/選択箇所
					</label>
				</div>

				<div className="flex items-center gap-1 text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]">
					<input
						type="checkbox"
						value="true"
						id="isDisableOption"
						{...formMethod.register("isDisableOption")}
						checked={!isDisableOption}
					/>
					<label htmlFor="isDisableOption" className="text-black">
						外部リンク/リスト登録
					</label>
				</div>

				<div className="flex items-center gap-1 text-xs p-1 border-2 border-white rounded-lg focus:outline-none bg-gradient-to-b from-[#efebe3] via-[#bbb197] to-[#857947] dark:bg-[#954d26]">
					<input
						type="checkbox"
						value="true"
						id="isDisplayFavorite"
						{...formMethod.register("isDisplayFavorite")}
					/>
					<label htmlFor="isDisplayFavorite" className="flex gap-1 text-black">
						<span className="flex items-center justify-center w-[16px] h-[16px] p-[2px] text-xs rounded-full cursor-pointer text-[#eb4926] bg-[#f3b33e]">
							★
						</span>
						表示
					</label>
				</div>
			</div>
		</details>
	);
};
