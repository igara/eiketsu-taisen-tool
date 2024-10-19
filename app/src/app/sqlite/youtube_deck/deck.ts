import type { ColumnType, Insertable, Selectable } from "kysely";

export type DeckTable = {
	title: ColumnType<string, string, never>;
	video_url: ColumnType<string, string, string>;
	thumbnail_url: ColumnType<string, string, string>;
	player: ColumnType<number, number, never>;
	dist: ColumnType<string, string, string>;
	no: ColumnType<string, string, string>;
	name: ColumnType<string, string, string>;
};

export type Deck = Selectable<DeckTable>;
export type NewDeck = Insertable<DeckTable>;
