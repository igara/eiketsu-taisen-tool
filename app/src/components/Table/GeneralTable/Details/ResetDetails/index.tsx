import type { SearchFormData } from "@/schema/SearchForm";
import type { UseFormReturn } from "react-hook-form";
import { useLogic } from "./logic";

type Props = {
	formMethod: UseFormReturn<SearchFormData>;
	defaultSearchFavoriteNos: string[];
	defaultIsDisplayFavorite: string | null;
	refTableScrollElement: React.RefObject<HTMLFormElement>;
};

export const ResetDetails: React.FC<Props> = ({
	formMethod,
	defaultSearchFavoriteNos,
	defaultIsDisplayFavorite,
	refTableScrollElement,
}) => {
	const {
		refDetailsElement,
		onKeyDownSummary,
		onClickWrapper,
		onClickSearchReset,
		onClickAllReset,
	} = useLogic({
		formMethod,
		defaultSearchFavoriteNos,
		defaultIsDisplayFavorite,
		refTableScrollElement,
	});

	return (
		<details ref={refDetailsElement} className="relative">
			<summary
				onKeyDown={onKeyDownSummary}
				className="text-white text-xs bg-blue-600 p-1 border-2 border-white rounded-lg focus:outline-none"
			>
				リセット
			</summary>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="fixed z-10 w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.5)]"
				onClick={onClickWrapper}
			/>

			<div className="absolute z-10 bottom-[28px] flex flex-col gap-1 p-1 bg-[#252423] rounded-[4px]">
				<button
					type="button"
					onClick={onClickSearchReset}
					className="text-white text-xs bg-blue-600 p-1 border-2 border-white rounded-lg focus:outline-none"
				>
					検索条件のみ
				</button>

				<button
					type="button"
					onClick={onClickAllReset}
					className="text-white text-xs bg-red-500 p-1 border-2 border-white rounded-lg focus:outline-none"
				>
					リスト&検索条件
				</button>
			</div>
		</details>
	);
};
