import type { ColumnType } from "kysely";

export type DeckTable = {
	title: ColumnType<string, string, string>;
	video_url: ColumnType<string, string, string>;
	thumbnail_url: ColumnType<string, string, string>;
	player: ColumnType<number, number, number>;
	dist: ColumnType<string, string, string>;
	no: ColumnType<string, string, string>;
	name: ColumnType<string, string, string>;
};
