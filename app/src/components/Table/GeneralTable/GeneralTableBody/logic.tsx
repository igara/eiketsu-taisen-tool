import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import type { GeneralUI } from "../logic";

type Args = {
	generals: GeneralUI[];
};

export const useLogic = ({ generals }: Args) => {
	const displayGeneral = generals.filter((general) => !general.hidden);
	const refWrapperElement = React.useRef<HTMLTableSectionElement>(null);
	const rowVirtualizer = useVirtualizer({
		count: displayGeneral.length,
		getScrollElement: () => refWrapperElement.current,
		estimateSize: () => 160,
		overscan: 10,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		rowVirtualizer.measure();
	}, [refWrapperElement.current]);

	return {
		refWrapperElement,
		displayGeneral,
		rowVirtualizer,
	};
};
