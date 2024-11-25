import fs from "node:fs";
import { parseArgs } from "node:util";
import dayjs from "dayjs";
import { google, type youtube_v3 } from "googleapis";
import imageHash from "image-hash";
import sqlite from "node-sqlite3-wasm";
import sharp from "sharp";
import type { GeneralImageHash } from "./types";

const {
	values: { youtubeImportExec, youtubeDeckImportExec, youtubeDeckTableCreate },
} = parseArgs({
	options: {
		youtubeImportExec: {
			type: "boolean",
			short: "b",
			default: false,
		},
		youtubeDeckImportExec: {
			type: "boolean",
			short: "b",
			default: false,
		},
		youtubeDeckTableCreate: {
			type: "boolean",
			short: "b",
			default: false,
		},
	},
});

type Youtube = {
	id: string;
	title: string;
	videoUrl: string;
	thumbnailUrl: string;
	cacheImagePath: string;
	version: number;
	player1_name: string;
	player2_name: string;
	createAt: string;
};

const youtubeImport = async () => {
	if (!process.env.GOOGLE_KEY) return;

	const youtube = google.youtube({
		version: "v3",
		auth: process.env.GOOGLE_KEY,
	});

	let nextPageToken = "";
	let allItems: youtube_v3.Schema$PlaylistItem[] = [];

	do {
		const response = await youtube.playlistItems.list({
			playlistId: "PLvy-GrTTg3WxIPplHPm5GYOfgX8Hw8uMu",
			part: ["snippet"],
			maxResults: 50,
			pageToken: nextPageToken,
		});

		const items = response.data.items || [];
		allItems = allItems.concat(items);

		nextPageToken = response.data.nextPageToken || "";
	} while (nextPageToken);

	const videos = allItems.reduce((acc, item) => {
		const snippet = item.snippet;
		if (!snippet) return acc;

		const { title, resourceId, thumbnails } = snippet;

		if (
			!title ||
			!resourceId ||
			!resourceId.videoId ||
			!thumbnails ||
			!thumbnails.maxres ||
			!thumbnails.maxres.url
		) {
			return acc;
		}

		const thumbnailUrl = thumbnails.maxres.url;

		const id = resourceId.videoId;

		const dirName = `data/youtube/${id}`;
		fs.mkdirSync(dirName, { recursive: true });

		const titleDateMatch = title.match(
			/[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])/g,
		);
		const titleDate = titleDateMatch?.[0].toString();
		const titleDateDay = dayjs(titleDate);
		let version = 0;

		if (
			titleDateDay.isSame("2023/11/02") ||
			titleDateDay.isAfter("2023/11/02")
		) {
			version = 3;
		}
		if (
			titleDateDay.isSame("2023/10/31") ||
			titleDateDay.isBefore("2023/10/31")
		) {
			version = 2;
		}
		if (
			titleDateDay.isSame("2022/12/20") ||
			titleDateDay.isBefore("2022/12/20")
		) {
			version = 1;
		}

		const playerNameMatch = title.match(
			/頂上対決【\d{4}\/\d{2}\/\d{2}】([^ ]+) VS ([^ ]+)/,
		);
		if (!playerNameMatch) return acc;

		acc.push({
			id,
			title,
			videoUrl: `https://www.youtube.com/watch?v=${id}`,
			thumbnailUrl,
			cacheImagePath: `${dirName}`,
			version,
			player1_name: playerNameMatch[1],
			player2_name: playerNameMatch[2],
			createAt: titleDateDay.format("YYYY-MM-DD"),
		});

		return acc;
	}, [] as Youtube[]);

	fs.writeFileSync("data/json/youtube.json", JSON.stringify(videos, null, 2));

	for (const video of videos) {
		const { thumbnailUrl, id } = video;
		const dirName = `data/youtube/${id}`;

		if (fs.existsSync(`${dirName}/all.jpg`)) continue;

		const res = await fetch(thumbnailUrl);
		const arrayBuffer = await res.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const allImagePath = `${dirName}/all.jpg`;
		fs.writeFileSync(allImagePath, buffer);
	}

	for (const video of videos) {
		const { cacheImagePath, version } = video;
		const allImagePath = `${cacheImagePath}/all.jpg`;
		const img = await sharp(allImagePath);

		if (version === 1) {
			const cardSize = {
				width: 92,
				height: 138,
			};

			await Promise.all([
				img
					.clone()
					.extract({
						left: 47,
						top: 295,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_1.jpg`),
				img
					.clone()
					.extract({
						left: 194,
						top: 295,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_2.jpg`),
				img
					.clone()
					.extract({
						left: 340,
						top: 295,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_3.jpg`),
				img
					.clone()
					.extract({
						left: 487,
						top: 295,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_4.jpg`),
				img
					.clone()
					.extract({
						left: 486,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_5.jpg`),
				img
					.clone()
					.extract({
						left: 340,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_6.jpg`),
				img
					.clone()
					.extract({
						left: 191,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_7.jpg`),
				img
					.clone()
					.extract({
						left: 47,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_8.jpg`),
				img
					.clone()
					.extract({
						left: 700,
						top: 295,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_1.jpg`),
				img
					.clone()
					.extract({
						left: 847,
						top: 295,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_2.jpg`),
				img
					.clone()
					.extract({
						left: 994,
						top: 295,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_3.jpg`),
				img
					.clone()
					.extract({
						left: 1140,
						top: 295,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_4.jpg`),
				img
					.clone()
					.extract({
						left: 700,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_5.jpg`),
				img
					.clone()
					.extract({
						left: 848,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_6.jpg`),
				img
					.clone()
					.extract({
						left: 994,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_7.jpg`),
				img
					.clone()
					.extract({
						left: 1140,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_8.jpg`),
			]);
		}

		if (version === 2) {
			const cardSize = {
				width: 92,
				height: 138,
			};

			await Promise.all([
				img
					.clone()
					.extract({
						left: 47,
						top: 294,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_1.jpg`),
				img
					.clone()
					.extract({
						left: 192,
						top: 294,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_2.jpg`),
				img
					.clone()
					.extract({
						left: 340,
						top: 294,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_3.jpg`),
				img
					.clone()
					.extract({
						left: 486,
						top: 294,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_4.jpg`),
				img
					.clone()
					.extract({
						left: 486,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_5.jpg`),
				img
					.clone()
					.extract({
						left: 340,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_6.jpg`),
				img
					.clone()
					.extract({
						left: 192,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_7.jpg`),
				img
					.clone()
					.extract({
						left: 47,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_8.jpg`),
				img
					.clone()
					.extract({
						left: 700,
						top: 294,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_1.jpg`),
				img
					.clone()
					.extract({
						left: 848,
						top: 294,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_2.jpg`),
				img
					.clone()
					.extract({
						left: 994,
						top: 294,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_3.jpg`),
				img
					.clone()
					.extract({
						left: 1140,
						top: 294,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_4.jpg`),
				img
					.clone()
					.extract({
						left: 700,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_5.jpg`),
				img
					.clone()
					.extract({
						left: 848,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_6.jpg`),
				img
					.clone()
					.extract({
						left: 994,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_7.jpg`),
				img
					.clone()
					.extract({
						left: 1140,
						top: 502,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_8.jpg`),
			]);
		}

		if (version === 3) {
			const cardSize = {
				width: 92,
				height: 142,
			};

			await Promise.all([
				img
					.clone()
					.extract({
						left: 107,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_1.jpg`),
				img
					.clone()
					.extract({
						left: 236,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_2.jpg`),
				img
					.clone()
					.extract({
						left: 365,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_3.jpg`),
				img
					.clone()
					.extract({
						left: 495,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_4.jpg`),
				img
					.clone()
					.extract({
						left: 495,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_5.jpg`),
				img
					.clone()
					.extract({
						left: 365,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_6.jpg`),
				img
					.clone()
					.extract({
						left: 236,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_7.jpg`),
				img
					.clone()
					.extract({
						left: 107,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/red_8.jpg`),
				img
					.clone()
					.extract({
						left: 692,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_1.jpg`),
				img
					.clone()
					.extract({
						left: 822,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_2.jpg`),
				img
					.clone()
					.extract({
						left: 952,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_3.jpg`),
				img
					.clone()
					.extract({
						left: 1081,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_4.jpg`),
				img
					.clone()
					.extract({
						left: 692,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_5.jpg`),
				img
					.clone()
					.extract({
						left: 822,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_6.jpg`),
				img
					.clone()
					.extract({
						left: 952,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_7.jpg`),
				img
					.clone()
					.extract({
						left: 1081,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_8.jpg`),
			]);
		}
	}
};
youtubeImportExec && youtubeImport();

const hashImage = (imagePath: string, bits = 16): Promise<string> => {
	return new Promise((resolve, reject) => {
		imageHash.imageHash(
			imagePath,
			bits,
			true,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(error: any, data: string | PromiseLike<string>) => {
				if (error) {
					reject(error);
				} else {
					resolve(data);
				}
			},
		);
	});
};

const youtubeDeckImport = async () => {
	const YoutubeJSON: Youtube[] = JSON.parse(
		fs.readFileSync("data/json/youtube.json", "utf8"),
	);

	const GeneralImageHashsJSON: GeneralImageHash[] = JSON.parse(
		fs.readFileSync("data/json/general_image_hashs.json", "utf8"),
	);

	fs.mkdirSync("../app/public/sqlite", { recursive: true });
	const db = new sqlite.Database("../app/public/sqlite/youtube_deck.sqlite3");

	if (youtubeDeckTableCreate) {
		db.exec(
			"DROP TABLE IF EXISTS decks; " +
				`CREATE TABLE IF NOT EXISTS decks (
		title TEXT,
		video_url TEXT,
		thumbnail_url TEXT,
		player INTEGER,
		player_name TEXT,
		dist TEXT,
		no TEXT,
		name TEXT,
		kana_name TEXT,
		create_at DATETIME DEFAULT (DATETIME('now', 'localtime')),
		PRIMARY KEY(
			 title,
			 video_url,
			 thumbnail_url,
			 player,
			 player_name,
			 dist,
       no,
			 name
		));`,
		);
	}

	type GeneralInfo = {
		generals: {
			no: string;
			name: string;
			kanaName: string;
			hashImage: string;
			path: string;
		}[];
	};
	const generalAllInfo = await GeneralImageHashsJSON.reduce<
		Promise<GeneralInfo>
	>(
		async (acc: Promise<GeneralInfo>, general): Promise<GeneralInfo> => {
			const imagePath = `data/generals/${general.color.name}/${general.no}_${general.name}/5.jpg`;
			(await acc).generals.push({
				no: general.no,
				name: general.name,
				kanaName: general.kanaName,
				hashImage: general.deckImageHash,
				path: imagePath,
			});

			return await acc;
		},
		Promise.resolve<GeneralInfo>({
			generals: [],
		}),
	);

	const allGeneralImages: {
		path: string;
		hashImage: string;
		no: string;
		name: string;
		kanaName: string;
	}[] = await Promise.all([
		...[...Array(126)].map(async (_, index) => {
			const i = index + 1;
			const imagePath = `data/dummy/dummy/${i}.jpg`;
			return {
				path: imagePath,
				hashImage: await hashImage(imagePath),
				no: "",
				name: "",
				kanaName: "",
			};
		}),
		...generalAllInfo.generals,
	]);

	const insertDiffCheckResult = async (video: Youtube) => {
		const { cacheImagePath } = video;
		const allImagePath = `${cacheImagePath}/all.jpg`;

		const minDiff = {
			red1: 100,
			red2: 100,
			red3: 100,
			red4: 100,
			red5: 100,
			red6: 100,
			red7: 100,
			red8: 100,
			blue1: 100,
			blue2: 100,
			blue3: 100,
			blue4: 100,
			blue5: 100,
			blue6: 100,
			blue7: 100,
			blue8: 100,
		};
		type DetectionGeneral = {
			no: string;
			name: string;
			kanaName: string;
			imagePath: string;
			originalImagePath: string;
			allImagePath: string;
		};
		const detectionGenerals: {
			[generalNoName in
				| "red1"
				| "red2"
				| "red3"
				| "red4"
				| "red5"
				| "red6"
				| "red7"
				| "red8"
				| "blue1"
				| "blue2"
				| "blue3"
				| "blue4"
				| "blue5"
				| "blue6"
				| "blue7"
				| "blue8"]: DetectionGeneral;
		} = [...Array(8)].reduce((acc, _, index) => {
			const i = index + 1;
			acc[`red${i}`] = {
				no: "",
				name: "",
				kanaName: "",
				imagePath: "",
				originalImagePath: "",
				allImagePath: "",
			};
			acc[`blue${i}`] = {
				no: "",
				name: "",
				kanaName: "",
				imagePath: "",
				originalImagePath: "",
				allImagePath: "",
			};
			return acc;
		}, {});

		const diffThreshold = 50;

		const diffCheck = async (
			generalImg: {
				path: string;
				hashImage: string;
				no: string;
				name: string;
				kanaName: string;
			},
			color: "red" | "blue",
			num: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
		) => {
			const colorGeneralImage = await hashImage(
				`${cacheImagePath}/${color}_${num}.jpg`,
			);
			const colorDiff = colorGeneralImage
				.split("")
				.reduce((acc, char, index) => {
					return acc + (char !== generalImg.hashImage[index] ? 1 : 0);
				}, 0);
			if (colorDiff <= diffThreshold) {
				if (colorDiff < minDiff[`${color}${num}`]) {
					minDiff[`${color}${num}`] = colorDiff;
					detectionGenerals[`${color}${num}`] = {
						no: generalImg.no,
						name: generalImg.name,
						kanaName: generalImg.kanaName,
						imagePath: generalImg.path,
						originalImagePath: `${cacheImagePath}/${color}_${num}.jpg`,
						allImagePath,
					};
				}
			}
		};

		for (const generalImage of allGeneralImages) {
			await Promise.all([
				diffCheck(generalImage, "red", 1),
				diffCheck(generalImage, "red", 2),
				diffCheck(generalImage, "red", 3),
				diffCheck(generalImage, "red", 4),
				diffCheck(generalImage, "red", 5),
				diffCheck(generalImage, "red", 6),
				diffCheck(generalImage, "red", 7),
				diffCheck(generalImage, "red", 8),
				diffCheck(generalImage, "blue", 1),
				diffCheck(generalImage, "blue", 2),
				diffCheck(generalImage, "blue", 3),
				diffCheck(generalImage, "blue", 4),
				diffCheck(generalImage, "blue", 5),
				diffCheck(generalImage, "blue", 6),
				diffCheck(generalImage, "blue", 7),
				diffCheck(generalImage, "blue", 8),
			]);
		}

		const insertDeck = (detectionGeneral: DetectionGeneral, player: 1 | 2) => {
			if (detectionGeneral.no) {
				try {
					db.run(
						`INSERT INTO decks VALUES (
					:title,
					:video_url,
					:thumbnail_url,
					:player,
					:player_name,
					:dist,
					:no,
					:name,
					:kana_name,
					:create_at
					)`,
						{
							":title": video.title,
							":video_url": video.videoUrl,
							":thumbnail_url": video.thumbnailUrl,
							":player": player,
							":player_name": video[`player${player}_name`],
							":dist": detectionGeneral.originalImagePath,
							":no": detectionGeneral.no,
							":name": detectionGeneral.name,
							":kana_name": detectionGeneral.kanaName,
							":create_at": video.createAt,
						},
					);
				} catch (_) {}
			}
		};
		insertDeck(detectionGenerals.red1, 1);
		insertDeck(detectionGenerals.red2, 1);
		insertDeck(detectionGenerals.red3, 1);
		insertDeck(detectionGenerals.red4, 1);
		insertDeck(detectionGenerals.red5, 1);
		insertDeck(detectionGenerals.red6, 1);
		insertDeck(detectionGenerals.red7, 1);
		insertDeck(detectionGenerals.red8, 1);
		insertDeck(detectionGenerals.blue1, 2);
		insertDeck(detectionGenerals.blue2, 2);
		insertDeck(detectionGenerals.blue3, 2);
		insertDeck(detectionGenerals.blue4, 2);
		insertDeck(detectionGenerals.blue5, 2);
		insertDeck(detectionGenerals.blue6, 2);
		insertDeck(detectionGenerals.blue7, 2);
		insertDeck(detectionGenerals.blue8, 2);
	};

	// const v1Videos = YoutubeJSON.filter((video) => video.version === 1);
	// const v2Videos = YoutubeJSON.filter((video) => video.version === 2);
	// const v3Videos = YoutubeJSON.filter((video) => video.version === 3);

	for (const video of YoutubeJSON) {
		await insertDiffCheckResult(video);
	}
};
youtubeDeckImportExec && youtubeDeckImport();
