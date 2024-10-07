import fs from "node:fs";
import { google, type youtube_v3 } from "googleapis";
import DOMParser from "node-html-parser";
import sharp from "sharp";
import type { Skill } from "./types";

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

		const res = await fetch(imageUrl);
		const arrayBuffer = await res.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		fs.writeFileSync(`${dirName}/1.jpg`, buffer);

		const img = await sharp(buffer);
		const { width, height } = await img.metadata();
		if (!(width && height)) continue;

		img
			.clone()
			.extract({
				left: 0,
				top: 0,
				width: width / 2,
				height: height,
			})
			.toFile(`${dirName}/2.jpg`);

		img
			.clone()
			.extract({
				left: width / 2,
				top: 0,
				width: width / 2,
				height: height,
			})
			.toFile(`${dirName}/3.jpg`);
	}
};
main();

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

	const videos = allItems.reduce(
		(acc, item) => {
			const snippet = item.snippet;
			if (!snippet) return acc;

			const { title, resourceId, thumbnails } = snippet;

			if (
				!title ||
				!resourceId ||
				!resourceId.videoId ||
				!thumbnails ||
				!thumbnails.high ||
				!thumbnails.high.url
			) {
				return acc;
			}

			const thumbnailUrl = thumbnails.high.url;

			acc.push({
				title,
				videoUrl: `https://www.youtube.com/watch?v=${resourceId.videoId}`,
				thumbnailUrl,
			});

			return acc;
		},
		[] as { title: string; videoUrl: string; thumbnailUrl: string }[],
	);

	console.log(videos);
};
youtubeImport();
