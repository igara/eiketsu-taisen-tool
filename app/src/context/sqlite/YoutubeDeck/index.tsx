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
	const workerRef = React.useRef<Worker>();
	const isSqliteImported = React.useRef(false);
	const [youtubeDeckDB, setYoutubeDeckDB] =
		React.useState<Kysely<DatabaseInterface> | null>(null);

	React.useEffect(() => {
		if (isSqliteImported.current) return;
		isSqliteImported.current = true;

		const sqliteImport = async () => {
			try {
				workerRef.current = new Worker(
					new URL("./worker.tsx", import.meta.url),
				);
				workerRef.current.onmessage = (event: MessageEvent<boolean>) => {
					if (!event.data) return;

					const { dialect } = new SQLocalKysely({
						databasePath: "sqlite/youtube_deck.sqlite3",
						readOnly: true,
					});
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
				};

				workerRef.current.postMessage("install");
			} catch (e) {
				console.error(e);
			}
		};
		sqliteImport();

		return () => {
			workerRef.current?.terminate();
		};
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
