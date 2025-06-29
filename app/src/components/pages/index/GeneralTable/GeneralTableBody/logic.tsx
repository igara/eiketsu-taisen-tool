import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";
import { GeneralUI } from "../logic";

export const useLogic = (generals: GeneralUI[]) => {
	const parentRef = useRef<HTMLDivElement>(null);
	
	// 測定済みの高さをキャッシュするためのMap
	const measuredHeights = useRef(new Map<number, number>());

	// 表示される武将のみをフィルタリング
	const visibleGenerals = generals.filter((general) => !general.hidden);

	const virtualizer = useVirtualizer({
		count: visibleGenerals.length,
		getScrollElement: () => parentRef.current,
		estimateSize: (index) => {
			// まず測定済みの高さがあるかチェック
			const measuredHeight = measuredHeights.current.get(index);
			if (measuredHeight) {
				return measuredHeight;
			}
			
			const general = visibleGenerals[index];
			if (!general) return 150; // フォールバック値
			
			// 基本の高さ
			let estimatedHeight = 150;
			return estimatedHeight;
		},
		overscan: 5, // 画面外にレンダリングする追加アイテム数
		// 実際の要素の高さを測定して動的に調整
		measureElement: (element) => {
			const height = element?.getBoundingClientRect().height ?? 150;
			
			// 要素のdata-index属性から対応するインデックスを取得
			const indexStr = element?.getAttribute('data-index');
			if (indexStr) {
				const index = parseInt(indexStr, 10);
				// 測定した高さをキャッシュに保存
				measuredHeights.current.set(index, height);
			}
			
			return height;
		},
	});

	// 要素の高さを測定するためのコールバック
	const measureElement = useCallback((node: HTMLDivElement | null, index: number) => {
		if (node) {
			// data-index属性を設定して、measureElementで使用できるようにする
			node.setAttribute('data-index', index.toString());
			
			// 要素がレンダリングされた後に高さを測定して仮想化を更新
			requestAnimationFrame(() => {
				virtualizer.measureElement(node);
			});
		}
	}, [virtualizer]);

	return {
		parentRef,
		visibleGenerals,
		virtualizer,
		measureElement,
	};
};
