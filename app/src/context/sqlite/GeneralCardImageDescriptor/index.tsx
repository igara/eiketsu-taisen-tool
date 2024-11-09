"use client";

import type { DatabaseInterface } from "@/sqlite/general_card_image_descriptor/opfs_db";
import { Kysely } from "kysely";
import React from "react";
import { createContext } from "react";
import { SQLocalKysely } from "sqlocal/kysely";

export interface GeneralCardImageDescriptorProviderProps {
	children: React.ReactNode;
}

const GeneralCardImageDescriptorContext = createContext<{
	generalCardImageDescriptorDB: Kysely<DatabaseInterface> | null;
}>({
	generalCardImageDescriptorDB: null,
});

function GeneralCardImageDescriptorProvider({
	children,
}: GeneralCardImageDescriptorProviderProps) {
	const isSqliteImported = React.useRef(false);
	const [generalCardImageDescriptorDB, setGeneralCardImageDescriptorDB] =
		React.useState<Kysely<DatabaseInterface> | null>(null);

	React.useEffect(() => {
		if (isSqliteImported.current) return;
		isSqliteImported.current = true;

		const sqliteImport = async () => {
			try {
				const opfsRoot = await navigator.storage.getDirectory();
				const dirHandle = await opfsRoot.getDirectoryHandle("sqlite", {
					create: true,
				});
				const fileHandle = await dirHandle.getFileHandle(
					"general_card_image_descriptor.sqlite3",
					{
						create: true,
					},
				);

				const res = await fetch(
					"/eiketsu-taisen-tool/sqlite/general_card_image_descriptor.sqlite3",
				);
				const blob = await res.blob();

				const writable = await fileHandle.createWritable();
				await writable.write(blob);
				await writable.close();

				const { dialect } = new SQLocalKysely(
					"sqlite/general_card_image_descriptor.sqlite3",
				);
				const db = new Kysely<DatabaseInterface>({
					dialect,
					log: (event) => {
						if (event.level === "query") {
							// console.log(event.query.sql);
							// console.log(event.query.parameters);
						}
					},
				});
				setGeneralCardImageDescriptorDB(db);
			} catch (_) {}
		};
		sqliteImport();
	}, []);

	return (
		<GeneralCardImageDescriptorContext.Provider
			value={{
				generalCardImageDescriptorDB,
			}}
		>
			{children}
		</GeneralCardImageDescriptorContext.Provider>
	);
}

export {
	GeneralCardImageDescriptorContext,
	GeneralCardImageDescriptorProvider,
};
