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

			const res = await fetch(
				"/eiketsu-taisen-tool/sqlite/youtube_deck.sqlite3",
			);
			const blob = await res.blob();
			const buffer = await blob.arrayBuffer();

			const fileSyncHandle = await fileHandle.createSyncAccessHandle();
			fileSyncHandle.write(buffer);
			fileSyncHandle.close();

			postMessage(true);
			return;
		} catch (e) {
			console.error(e);
		}
	}

	postMessage(false);
	return;
});
