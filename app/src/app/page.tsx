import dynamic from "next/dynamic";

const GeneralTable = dynamic(() => import("@/components/Table/GeneralTable"), {
	ssr: false,
});

export default function Home() {
	return (
		<main>
			<GeneralTable />
		</main>
	);
}
