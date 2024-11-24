import type { ColumnType } from "kysely";

export type DeckTable = {
	title: ColumnType<string, string, string>;
	video_url: ColumnType<string, string, string>;
	thumbnail_url: ColumnType<string, string, string>;
	player: ColumnType<number, number, number>;
	player_name: ColumnType<string, string, string>;
	dist: ColumnType<string, string, string>;
	no: ColumnType<string, string, string>;
	name: ColumnType<string, string, string>;
	kana_name: ColumnType<string, string, string>;
	create_at: ColumnType<string, string, string>;
};
