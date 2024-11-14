// import { GeneralTable } from "@/components/Table/GeneralTable";
import { YoutubeDeckProvider } from "@/context/sqlite/YoutubeDeck";

export const YouTube: React.FC = () => {
	return (
		<YoutubeDeckProvider>
			<main>{/* <GeneralTable /> */}</main>
		</YoutubeDeckProvider>
	);
};

export default YouTube;
