import type { DeckTable } from "./deck";

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
