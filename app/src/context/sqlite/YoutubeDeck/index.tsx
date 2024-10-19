"use client";

import type { DatabaseInterface } from "@/sqlite/youtube_deck/opfs_db";
import { Kysely } from "kysely";
import React from "react";
import { createContext } from "react";
import { SQLocalKysely } from "sqlocal/kysely";

export interface YotubeDeckProviderProps {
	children: React.ReactNode;
}

const YoutubeDeckContext = createContext<{
	youtubeDeckDB: Kysely<DatabaseInterface> | null;
}>({
	youtubeDeckDB: null,
});

function YoutubeDeckProvider({ children }: YotubeDeckProviderProps) {
	const isSqliteImported = React.useRef(false);
	const [youtubeDeckDB, setYoutubeDeckDB] =
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
					"youtube_deck.sqlite3",
					{
						create: true,
					},
				);

				const res = await fetch(
					"/eiketsu-taisen-tool/sqlite/youtube_deck.sqlite3",
				);
				const blob = await res.blob();

				const writable = await fileHandle.createWritable();
				await writable.write(blob);
				await writable.close();

				const { dialect } = new SQLocalKysely("sqlite/youtube_deck.sqlite3");
				const db = new Kysely<DatabaseInterface>({
					dialect,
					log: (event) => {
						if (event.level === "query") {
							// console.log(event.query.sql);
							// console.log(event.query.parameters);
						}
					},
				});
				setYoutubeDeckDB(db);
			} catch (_) {}
		};
		sqliteImport();
	}, []);

	return (
		<YoutubeDeckContext.Provider
			value={{
				youtubeDeckDB,
			}}
		>
			{children}
		</YoutubeDeckContext.Provider>
	);
}

export { YoutubeDeckContext, YoutubeDeckProvider };
