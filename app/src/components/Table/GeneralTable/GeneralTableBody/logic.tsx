import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import type { GeneralUI } from "../logic";

type Args = {
	generals: GeneralUI[];
	refWrapperElement: React.RefObject<HTMLFormElement>;
};

export const useLogic = ({ generals, refWrapperElement }: Args) => {
	const rowVirtualizer = useVirtualizer({
		count: generals.length,
		getScrollElement: () => refWrapperElement.current,
		estimateSize: () => 160,
		overscan: 50,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		rowVirtualizer.measure();
	}, [refWrapperElement.current]);

	return {
		rowVirtualizer,
	};
};
