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
		dummyCheckExec,
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
		dummyCheckExec: {
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
	player1_name: string;
	player2_name: string;
};

async function processInBatches<T>(
	promises: Promise<T>[],
	batchSize: number,
): Promise<T[]> {
	let results: T[] = [];

	// promises を batchSize ごとに分割して順次処理
	for (let i = 0; i < promises.length; i += batchSize) {
		const batch = promises.slice(i, i + batchSize); // batchSize件ずつに分割
		const batchResults = await Promise.all(batch); // batchSize件並列実行
		results = results.concat(batchResults); // 結果を保存
	}

	return results; // 全ての結果を返す
}

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

	const setStratCosts = new Set<string>();
	const setPowers = new Set<string>();
	const setIntelligentzias = new Set<string>();
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
		const power = g[17];
		const intelligentzia = g[18];

		setStratCosts.add(strat.cost);
		setPowers.add(power);
		setIntelligentzias.add(intelligentzia);

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
			power,
			intelligentzia,
			skill,
			kabuki,
			url: {
				official: `https://eiketsu-taisen.net/datalist/?s=general&c=${id}`,
				atWiki: atWikiData.find((d) => d.no === no)?.url,
				gameWiki: gameWikiData.find((d) => d.no === no)?.url,
			},
		};
	});
	const stratCosts = Array.from(setStratCosts).sort((a, b) => +a - +b);
	const powers = Array.from(setPowers).sort((a, b) => +a - +b);
	const intelligentzias = Array.from(setIntelligentzias).sort(
		(a, b) => +a - +b,
	);

	fs.writeFileSync(
		"data/json/stratCosts.json",
		JSON.stringify(stratCosts, null, 2),
	);
	fs.writeFileSync("data/json/powers.json", JSON.stringify(powers, null, 2));
	fs.writeFileSync(
		"data/json/intelligentzias.json",
		JSON.stringify(intelligentzias, null, 2),
	);
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
		const t5 = thumbnail.clone().extract({
			left: 10,
			top: 11,
			width: 140,
			height: 215,
		});
		await t5.toFile(`${dirName}/5.jpg`);

		const publicDir = `../app/public/images/generals/${general.no}_${general.name}`;
		fs.mkdirSync(publicDir, { recursive: true });
		await t5.toFile(`${publicDir}/5.jpg`);
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

		const titleDateMatch = title.match(
			/[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])/g,
		);
		const titleDate = titleDateMatch?.[0].toString();
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
		...[...Array(126)].map(async (_, index) => {
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
					:name
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

const dummyCheck = async () => {
	const allDummyImages: {
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
	]);

	for (const dummyImage1 of allDummyImages) {
		for (const dummyImage2 of allDummyImages) {
			const diff = dummyImage1.hashImage
				.split("")
				.reduce((acc, char, index) => {
					return acc + (char !== dummyImage2.hashImage[index] ? 1 : 0);
				}, 0);

			if (diff === 0) continue;
			if (diff <= 10) {
				console.log("-----------------");
				console.log(dummyImage1.path);
				console.log(dummyImage2.path);
				console.log(diff);
				console.log("-----------------");
			}
		}
	}
};
dummyCheckExec && dummyCheck();
