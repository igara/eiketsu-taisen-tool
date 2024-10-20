import type { General } from "@eiketsu-taisen-tool/data/types";
import React from "react";

export const useLogic = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const refContentDivElement = React.useRef<HTMLDivElement>(null);

	const onClickImageButton: React.MouseEventHandler<
		HTMLButtonElement
	> = async () => {
		setIsOpen(true);

		document.body.style.overflow = "hidden";
	};

	const onClickDialogCloseButton: React.MouseEventHandler<HTMLButtonElement> = (
		e,
	) => {
		e.preventDefault();
		e.stopPropagation();

		document.body.style.overflow = "auto";

		setIsOpen(false);
	};

	const onClickDialog = (e: React.MouseEvent<HTMLDialogElement>) => {
		if (!refContentDivElement.current) return;

		if (!refContentDivElement.current.contains(e.target as Node)) {
			setIsOpen(false);
			document.body.style.overflow = "auto";
		}
	};

	return {
		isOpen,
		onClickImageButton,
		onClickDialogCloseButton,
		onClickDialog,
		refContentDivElement,
	};
};
