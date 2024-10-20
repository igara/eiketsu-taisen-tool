import type { pathInfo } from "@/lib/pathInfo";
import type { NextPage } from "next";

type SearchParams = (typeof pathInfo)["/"];
type PageProps = SearchParams;

const Hoge: NextPage<PageProps> = async ({ searchParams }) => {
	return (
		<main>
			hoge color[]: {searchParams["color[]"]}
			period[]: {searchParams["period[]"]}
			cost[]: {searchParams["cost[]"]}
			unitType[]: {searchParams["unitType[]"]}
			skill[]: {searchParams["skill[]"]}
			stratRange[]: {searchParams["stratRange[]"]}
		</main>
	);
};

export default Hoge;
