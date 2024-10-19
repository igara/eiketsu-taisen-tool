import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { DeckTable } from "./deck";

export interface DatabaseInterface {
	decks: DeckTable;
}

const dialect = new SqliteDialect({
	database: new Database("src/app/sqlite/youtube_deck/youtube_deck.sqlite3"),
});

export const youtubeDeckDB = new Kysely<DatabaseInterface>({
	dialect,
	log: (event) => {
		if (event.level === "query") {
			console.log(event.query.sql);
			console.log(event.query.parameters);
		}
	},
});
