import { Index } from "@/components/pages/index";
import { Suspense } from "react";

export default function Home() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Index />
		</Suspense>
	);
}
