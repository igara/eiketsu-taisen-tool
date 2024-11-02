import { YouTube } from "@/components/pages/youtube";
import { Suspense } from "react";

export default function Youtube() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<YouTube />
		</Suspense>
	);
}
