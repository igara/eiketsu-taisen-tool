import { SQLocal } from "sqlocal";

self.addEventListener("message", async (e: MessageEvent<string>) => {
	if (e.data === "install") {
		try {
			const opfsRoot = await navigator.storage.getDirectory();
			const dirHandle = await opfsRoot.getDirectoryHandle("sqlite", {
				create: true,
			});

			const fileHandle = await dirHandle.getFileHandle("youtube_deck.sqlite3", {
				create: true,
			});

			const handle = await fileHandle.createSyncAccessHandle();

			const res = await fetch(
				"/eiketsu-taisen-tool/sqlite/youtube_deck.sqlite3",
			);
			const blob = await res.blob();
			const buffer = await blob.arrayBuffer();
			handle.write(buffer);
			handle.close();

			postMessage(true);
			return;
		} catch (e) {
			console.error(e);
		}
	}

	postMessage(false);
	return;
});
