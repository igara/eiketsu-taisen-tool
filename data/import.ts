import fs from "node:fs";
import { parseArgs } from "node:util";
import dayjs from "dayjs";
import { google, type youtube_v3 } from "googleapis";
import imageHash from "image-hash";
import DOMParser from "node-html-parser";
import sqlite from "node-sqlite3-wasm";
import sharp from "sharp";
import type { General, Skill } from "./types";

const {
	values: {
		mainExec,
		youtubeImportExec,
		youtubeDeckImportExec,
		youtubeDeckTableCreate,
	},
} = parseArgs({
	options: {
		mainExec: {
			type: "boolean",
			short: "b",
			default: false,
		},
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

type Base = {
	data: string[];
	path: string[];
	general: string[];
	color: string[];
	period: string[];
	generalAppearVer: string[];
	generalAppearFilterGroup: string[];
	indexInitial: string[];
	cardType: string[];
	cost: string[];
	generalRarity: string[];
	unitType: string[];
	skill: string[];
	strat: string[];
	stratCategory: string[];
	stratRange: string[];
	stratTime: string[];
	illust: string[];
	illustView: string[];
	cv: string[];
	equip: string[];
	equipRarity: string[];
	equipEffectMain: string[];
	equipEffectSub: string[];
	equipFilter: string[];
	equipEffectSystem: string[];
	equipEffectSystemColorType: string[];
	school: string[];
	schoolDetail: string[];
	schoolLevel: string[];
	appearPattern: string[];
	wayToGet: string[];
	soul: string[];
	soulEffect: string[];
	soulEffectColorType: string[];
	soulRarity: string[];
	equipCategory: string[];
	playerData: null;
	playerequip: null;
	playersoul: string[];
	kabuki: string[];
	kabukiRank: string[];
	message: null;
	error_id: number;
};

type Youtube = {
	id: string;
	title: string;
	videoUrl: string;
	thumbnailUrl: string;
	cacheImagePath: string;
	version: number;
};

const main = async () => {
	fs.mkdirSync("data/json", { recursive: true });
	fs.mkdirSync("../app/public/images/stratRange", { recursive: true });

	const gameWikiResult = await fetch("https://eiketsudb.gamewiki.jp/cardlist/");
	const gameWikiHTML = await gameWikiResult.text();
	const gameWikiDOM = DOMParser.parse(gameWikiHTML);

	const gameWikiData = gameWikiDOM
		.getElementsByTagName("table")[0]
		.getElementsByTagName("tbody")[0]
		.getElementsByTagName("tr")
		.map((tr) => {
			const tds = tr.getElementsByTagName("td");
			const no = tds[0].innerText;
			const url = tds[2].getElementsByTagName("a")[0].getAttribute("href");

			return { no, url };
		});

	const atWikiResult = await fetch(
		"https://w.atwiki.jp/eiketsu-taisen/pages/216.html",
	);
	const atWikiHTML = await atWikiResult.text();
	const atWikiDOM = DOMParser.parse(atWikiHTML);
	const atWikiData = atWikiDOM
		.getElementsByTagName("table")[0]
		.getElementsByTagName("tr")
		.reduce(
			(previousValue, tr) => {
				const tds = tr.getElementsByTagName("td");

				if (tds[0]) {
					const no = tds[0].innerText;
					let url = tds[4].getElementsByTagName("a")[0].getAttribute("href");
					if (url) {
						url = url.replace("//", "https://");
					}

					previousValue.push({
						no,
						url,
					});
				}

				return previousValue;
			},
			[] as { no: string; url: string | undefined }[],
		);

	const baseJSONResult = await fetch(
		"https://eiketsu-taisen.net/datalist/api/base",
	);
	const baseJSON: Base = await baseJSONResult.json();

	const indexInitials = baseJSON.indexInitial;
	fs.writeFileSync(
		"data/json/indexInitials.json",
		JSON.stringify(indexInitials, null, 2),
	);

	const colors = baseJSON.color.map((color) => {
		const c = color.split(",");

		return { name: c[1], r: c[2], g: c[3], b: c[4] };
	});
	fs.writeFileSync("data/json/colors.json", JSON.stringify(colors, null, 2));

	const periods = baseJSON.period.map((period) => {
		const p = period.split(",");
		return p[1];
	});
	fs.writeFileSync("data/json/periods.json", JSON.stringify(periods, null, 2));

	const costs = baseJSON.cost.map((cost) => {
		const c = cost.split(",");
		return c[1];
	});
	fs.writeFileSync("data/json/costs.json", JSON.stringify(costs, null, 2));

	const unitTypes = baseJSON.unitType.map((unitType) => {
		const u = unitType.split(",");
		return u[1];
	});
	fs.writeFileSync(
		"data/json/unitTypes.json",
		JSON.stringify(unitTypes, null, 2),
	);

	const skills = baseJSON.skill.map((skill) => {
		const s = skill.split(",");
		return {
			name: s[1],
			shortName: s[2],
			description: s[3],
		};
	});
	fs.writeFileSync("data/json/skills.json", JSON.stringify(skills, null, 2));

	const stratCategories = baseJSON.stratCategory.map((stratCategory) => {
		const sc = stratCategory.split(",");
		return sc[1];
	});
	fs.writeFileSync(
		"data/json/stratCategories.json",
		JSON.stringify(stratCategories, null, 2),
	);

	const stratRanges = baseJSON.stratRange;
	fs.writeFileSync(
		"data/json/stratRanges.json",
		JSON.stringify(stratRanges, null, 2),
	);

	for (const stratRange of stratRanges) {
		const iconUrl = `https://image.eiketsu-taisen.net/strat/range/icon/${stratRange}.png`;

		const res = await fetch(iconUrl);
		const arrayBuffer = await res.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		fs.writeFileSync(
			`../app/public/images/stratRange/${stratRange}.png`,
			buffer,
		);
	}

	const stratTimes = baseJSON.stratTime;
	fs.writeFileSync(
		"data/json/stratTimes.json",
		JSON.stringify(stratTimes, null, 2),
	);

	const strats = baseJSON.strat.map((strat) => {
		const s = strat.split(",");
		const c = s[5].split(":");
		const categories = c.map((category) => {
			return Number.parseInt(category);
		});
		const range = Number.parseInt(s[6]);
		const time = Number.parseInt(s[7]);

		return {
			name: s[1],
			kanaName: s[2],
			cost: s[3],
			description: s[4],
			categories,
			range,
			time,
		};
	});
	// const illusts = baseJSON.illust;
	// const cv = baseJSON.cv;

	const kabukies = baseJSON.kabuki[0].split(":");

	const generals = baseJSON.general.map((general) => {
		const g = general.split(",");

		const indexInitial = Number.parseInt(g[10]);
		const noIndex = Number.parseInt(g[12]);
		const no = `${indexInitials[indexInitial]}${noIndex.toString().padStart(3, "0")}`;

		const strat = strats[Number.parseInt(g[22])];
		const kabuki = kabukies[Number.parseInt(g[22])];
		const skill: Skill[] = [];

		const skill1 = Number.parseInt(g[19]);
		const skill2 = Number.parseInt(g[20]);
		const skill3 = Number.parseInt(g[21]);
		if (skill1 !== -1) {
			const s = skills[skill1];
			skill.push({
				name: s.name,
				shortName: s.shortName,
				description: s.description,
			});
		}
		if (skill2 !== -1) {
			const s = skills[skill2];
			skill.push({
				name: s.name,
				shortName: s.shortName,
				description: s.description,
			});
		}
		if (skill3 !== -1) {
			const s = skills[skill3];
			skill.push({
				name: s.name,
				shortName: s.shortName,
				description: s.description,
			});
		}

		const categories = strat.categories.map((category) => {
			return stratCategories[category];
		});

		const id = g[0];

		return {
			no,
			id,
			detailImageId: g[1],
			name: g[3],
			kanaName: g[4],
			color: colors[Number.parseInt(g[5])],
			period: periods[Number.parseInt(g[6])],
			cost: costs[Number.parseInt(g[13])],
			unitType: unitTypes[Number.parseInt(g[15])],
			strat: {
				name: strat.name,
				kanaName: strat.kanaName,
				cost: strat.cost,
				description: strat.description,
				categories,
				time: stratTimes[strat.time],
				range: stratRanges[strat.range],
			},
			power: g[17],
			intelligentzia: g[18],
			skill,
			kabuki,
			url: {
				official: `https://eiketsu-taisen.net/datalist/?s=general&c=${id}`,
				atWiki: atWikiData.find((d) => d.no === no)?.url,
				gameWiki: gameWikiData.find((d) => d.no === no)?.url,
			},
		};
	});

	fs.writeFileSync(
		"data/json/generals.json",
		JSON.stringify(generals, null, 2),
	);

	for (const general of generals) {
		const dirName = `data/generals/${general.color.name}/${general.no}_${general.name}`;
		fs.mkdirSync(dirName, { recursive: true });

		fs.writeFileSync(`${dirName}/index.json`, JSON.stringify(general, null, 2));

		const imageUrl = `https://image.eiketsu-taisen.net/general/card_ds/${general.detailImageId}.jpg`;

		const imageRes = await fetch(imageUrl);
		const imageArrayBuffer = await imageRes.arrayBuffer();
		const imageBuffer = Buffer.from(imageArrayBuffer);
		fs.writeFileSync(`${dirName}/1.jpg`, imageBuffer);

		const image = await sharp(imageBuffer);
		const { width, height } = await image.metadata();
		if (!(width && height)) continue;

		await image
			.clone()
			.extract({
				left: 0,
				top: 0,
				width: width / 2,
				height: height,
			})
			.toFile(`${dirName}/2.jpg`);

		await image
			.clone()
			.extract({
				left: width / 2,
				top: 0,
				width: width / 2,
				height: height,
			})
			.toFile(`${dirName}/3.jpg`);

		const thumbnailUrl = `https://image.eiketsu-taisen.net/general/card_small/${general.id}.jpg`;
		const thumbnailRes = await fetch(thumbnailUrl);
		const thumbnailArrayBuffer = await thumbnailRes.arrayBuffer();
		const thumbnailBuffer = Buffer.from(thumbnailArrayBuffer);
		fs.writeFileSync(`${dirName}/4.jpg`, thumbnailBuffer);

		const thumbnail = await sharp(thumbnailBuffer);
		await thumbnail
			.clone()
			.extract({
				left: 10,
				top: 11,
				width: 140,
				height: 215,
			})
			.toFile(`${dirName}/5.jpg`);
	}
};
mainExec && main();

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

		const titleMatch = title.match(
			/[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])/g,
		);
		const titleDate = titleMatch?.[0].toString();
		let version = 0;

		if (
			dayjs(titleDate).isSame("2023/11/02") ||
			dayjs(titleDate).isAfter("2023/11/02")
		) {
			version = 3;
		}
		if (
			dayjs(titleDate).isSame("2023/10/31") ||
			dayjs(titleDate).isBefore("2023/10/31")
		) {
			version = 2;
		}
		if (
			dayjs(titleDate).isSame("2022/12/20") ||
			dayjs(titleDate).isBefore("2022/12/20")
		) {
			version = 1;
		}

		acc.push({
			id,
			title,
			videoUrl: `https://www.youtube.com/watch?v=${id}`,
			thumbnailUrl,
			cacheImagePath: `${dirName}`,
			version,
		});

		return acc;
	}, [] as Youtube[]);

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

	fs.writeFileSync("data/json/youtube.json", JSON.stringify(videos, null, 2));
};
youtubeImportExec && youtubeImport();

const hashImage = (imagePath: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		imageHash.imageHash(
			imagePath,
			16,
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
	if (!process.env.GOOGLE_KEY) return;

	const YoutubeJSON: Youtube[] = JSON.parse(
		fs.readFileSync("data/json/youtube.json", "utf8"),
	);

	const GeneralsJSON: General[] = JSON.parse(
		fs.readFileSync("data/json/generals.json", "utf8"),
	);

	const db = new sqlite.Database("youtube_deck.db");

	if (youtubeDeckTableCreate) {
		db.exec(
			"DROP TABLE IF EXISTS decks; " +
				`CREATE TABLE IF NOT EXISTS decks (
		title TEXT,
		video_url TEXT,
		thumbnail_url TEXT,
		player TEXT,
		no TEXT,
		name TEXT,
		PRIMARY KEY(
			 title,
			 video_url,
			 thumbnail_url,
			 player,
			no,
			 name
		));`,
		);
	}

	type GeneralInfo = {
		generals: { no: string; name: string; hashImage: string; path: string }[];
	};
	const generalAllInfo = await GeneralsJSON.reduce<Promise<GeneralInfo>>(
		async (acc: Promise<GeneralInfo>, general): Promise<GeneralInfo> => {
			const imagePath = `data/generals/${general.color.name}/${general.no}_${general.name}/5.jpg`;
			const newHashImage = await hashImage(imagePath);
			(await acc).generals.push({
				no: general.no,
				name: general.name,
				hashImage: newHashImage,
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
	}[] = await Promise.all([
		...[...Array(59)].map(async (_, index) => {
			const i = index + 1;
			const imagePath = `data/dummy/dummy/${i}.jpg`;
			return {
				path: imagePath,
				hashImage: await hashImage(imagePath),
				no: "",
				name: "",
			};
		}),
		...generalAllInfo.generals,
	]);

	for (const video of YoutubeJSON) {
		const { version, cacheImagePath } = video;

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
						left: 694,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_1.jpg`),
				img
					.clone()
					.extract({
						left: 823,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_2.jpg`),
				img
					.clone()
					.extract({
						left: 954,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_3.jpg`),
				img
					.clone()
					.extract({
						left: 1082,
						top: 303,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_4.jpg`),
				img
					.clone()
					.extract({
						left: 694,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_5.jpg`),
				img
					.clone()
					.extract({
						left: 823,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_6.jpg`),
				img
					.clone()
					.extract({
						left: 954,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_7.jpg`),
				img
					.clone()
					.extract({
						left: 1082,
						top: 517,
						width: cardSize.width,
						height: cardSize.height,
					})
					.toFile(`${cacheImagePath}/blue_8.jpg`),
			]);
		}

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
				imagePath: "",
				originalImagePath: "",
				allImagePath: "",
			};
			acc[`blue${i}`] = {
				no: "",
				name: "",
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
						imagePath: generalImg.path,
						originalImagePath: `${cacheImagePath}/${color}_${num}.jpg`,
						allImagePath,
					};
				}
			}
		};

		for (const generalImage of allGeneralImages) {
			await diffCheck(generalImage, "red", 1);
			await diffCheck(generalImage, "red", 2);
			await diffCheck(generalImage, "red", 3);
			await diffCheck(generalImage, "red", 4);
			await diffCheck(generalImage, "red", 5);
			await diffCheck(generalImage, "red", 6);
			await diffCheck(generalImage, "red", 7);
			await diffCheck(generalImage, "red", 8);
			await diffCheck(generalImage, "blue", 1);
			await diffCheck(generalImage, "blue", 2);
			await diffCheck(generalImage, "blue", 3);
			await diffCheck(generalImage, "blue", 4);
			await diffCheck(generalImage, "blue", 5);
			await diffCheck(generalImage, "blue", 6);
			await diffCheck(generalImage, "blue", 7);
			await diffCheck(generalImage, "blue", 8);
		}

		const insertDeck = (detectionGeneral: DetectionGeneral, player: string) => {
			if (detectionGeneral.no) {
				try {
					db.run(
						`INSERT INTO decks VALUES (
					:title,
					:video_url,
					:thumbnail_url,
					:player,
					:no,
					:name
					)`,
						{
							":title": video.title,
							":video_url": video.videoUrl,
							":thumbnail_url": video.thumbnailUrl,
							":player": player,
							":no": detectionGeneral.no,
							":name": detectionGeneral.name,
						},
					);
				} catch (_) {}
			}
		};
		insertDeck(detectionGenerals.red1, "player1");
		insertDeck(detectionGenerals.red2, "player1");
		insertDeck(detectionGenerals.red3, "player1");
		insertDeck(detectionGenerals.red4, "player1");
		insertDeck(detectionGenerals.red5, "player1");
		insertDeck(detectionGenerals.red6, "player1");
		insertDeck(detectionGenerals.red7, "player1");
		insertDeck(detectionGenerals.red8, "player1");
		insertDeck(detectionGenerals.blue1, "player2");
		insertDeck(detectionGenerals.blue2, "player2");
		insertDeck(detectionGenerals.blue3, "player2");
		insertDeck(detectionGenerals.blue4, "player2");
		insertDeck(detectionGenerals.blue5, "player2");
		insertDeck(detectionGenerals.blue6, "player2");
		insertDeck(detectionGenerals.blue7, "player2");
		insertDeck(detectionGenerals.blue8, "player2");
	}
};
youtubeDeckImportExec && youtubeDeckImport();
