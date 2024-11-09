import type { DescriptorTable } from "./descriptor";

export interface DatabaseInterface {
	general_card_image_descriptors: DescriptorTable;
	sqlite_master: {
		type: string;
		name: string;
		tbl_name: string;
		rootpage: number;
		sql: string;
	};
}
