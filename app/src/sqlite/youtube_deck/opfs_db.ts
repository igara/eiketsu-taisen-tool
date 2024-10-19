import type { DeckTable } from "@eiketsu-taisen-tool/data/sqlite/youtube_deck/deck";
import { Kysely } from "kysely";
import { SQLocalKysely } from "sqlocal/kysely";

export interface DatabaseInterface {
	decks: DeckTable;
	sqlite_master: {
		type: string;
		name: string;
		tbl_name: string;
		rootpage: number;
		sql: string;
	};
}

const { dialect } = new SQLocalKysely("sqlite/youtube_deck.sqlite3");

export const youtubeDeckDB = new Kysely<DatabaseInterface>({
	dialect,
	log: (event) => {
		if (event.level === "query") {
			// console.log(event.query.sql);
			// console.log(event.query.parameters);
		}
	},
});
