import React from "react";

export const useLogic = () => {
	const [isDisplay, setIsDisplay] = React.useState(false);
	const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
		setIsDisplay(!isDisplay);
	};

	return {
		isDisplay,
		onClick,
	};
};
