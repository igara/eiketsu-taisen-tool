import type { ColumnType } from "kysely";

export type DescriptorTable = {
	no: ColumnType<string, string, string>;
	name: ColumnType<string, string, string>;
	descriptor: ColumnType<Buffer, Buffer, Buffer>;
};
