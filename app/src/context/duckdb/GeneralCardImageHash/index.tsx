"use client";

import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm";
import React from "react";
import { createContext } from "react";

export interface GeneralCardImageHashProviderProps {
	children: React.ReactNode;
}

type GeneralCardImageHashDB = {
	db: duckdb.AsyncDuckDB;
	connection: () => Promise<duckdb.AsyncDuckDBConnection>;
};

const GeneralCardImageHashContext = createContext<{
	generalCardImageHashDB: null | GeneralCardImageHashDB;
}>({
	generalCardImageHashDB: null,
});

function GeneralCardImageHashProvider({
	children,
}: GeneralCardImageHashProviderProps) {
	const isImported = React.useRef(false);
	const [generalCardImageHashDB, setGeneralCardImageHashDB] =
		React.useState<GeneralCardImageHashDB | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (isImported.current) return;
		isImported.current = true;

		const initializeDuckDB = async () => {
			const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
				mvp: {
					mainModule: duckdb_wasm,
					mainWorker:
						global.window &&
						new URL(
							"@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js",
							import.meta.url,
						).toString(),
				},
				eh: {
					mainModule: duckdb_wasm_eh,
					mainWorker:
						global.window &&
						new URL(
							"@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js",
							import.meta.url,
						).toString(),
				},
			};

			const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
			if (!bundle.mainWorker) return;

			const worker = new Worker(bundle.mainWorker);
			const logger = new duckdb.ConsoleLogger();
			const db = new duckdb.AsyncDuckDB(logger, worker);
			await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

			// データベースファイルをフェッチして ArrayBuffer に変換
			const response = await fetch(
				"/eiketsu-taisen-tool/duckdb/general_card_image_hash.json",
			);
			const json = await response.json();

			// 仮想ファイルシステムにファイルを書き込み
			await db.registerFileText(
				"general_card_image_hash.json",
				JSON.stringify(json),
			);

			setGeneralCardImageHashDB({
				db,
				connection: async () => {
					const conn = await db.connect();
					await conn.insertJSONFromPath("general_card_image_hash.json", {
						name: "general_card_image_hash",
					});

					return conn;
				},
			});
		};

		initializeDuckDB();
	}, []);

	return (
		<GeneralCardImageHashContext.Provider
			value={{
				generalCardImageHashDB,
			}}
		>
			{children}
		</GeneralCardImageHashContext.Provider>
	);
}

export { GeneralCardImageHashContext, GeneralCardImageHashProvider };
