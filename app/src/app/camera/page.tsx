import { Camera } from "@/components/pages/camera";
import { Suspense } from "react";

export default function Youtube() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Camera />
		</Suspense>
	);
}
