import fs from "node:fs";
import { parseArgs } from "node:util";
import imageHash from "image-hash";
import DOMParser from "node-html-parser";
import sharp from "sharp";
import type { General, GeneralImageHash, Skill } from "./types";

const {
	values: { mainExec },
} = parseArgs({
	options: {
		mainExec: {
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

const main = async () => {
	fs.mkdirSync("data/json", { recursive: true });
	fs.mkdirSync("../app/public/images/stratRange", { recursive: true });

	const headers = {
		"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	};

	const gameWikiResult = await fetch("https://eiketsudb.gamewiki.jp/cardlist/", { headers });
	const gameWikiHTML = await gameWikiResult.text();
	const gameWikiDOM = DOMParser.parse(gameWikiHTML);

	const gameWikiTables = gameWikiDOM.getElementsByTagName("table");
	if (!gameWikiTables || gameWikiTables.length === 0) {
		console.error("[gameWiki] No table found in the HTML");
		console.log("[gameWiki] HTML preview:", gameWikiHTML.substring(0, 500));
		throw new Error("[gameWiki] Expected table element not found");
	}

	const gameWikiTbody = gameWikiTables[0].getElementsByTagName("tbody");
	if (!gameWikiTbody || gameWikiTbody.length === 0) {
		console.error("[gameWiki] No tbody found in the table");
		throw new Error("[gameWiki] Expected tbody element not found");
	}

	const gameWikiData = gameWikiTbody[0]
		.getElementsByTagName("tr")
		.map((tr) => {
			const tds = tr.getElementsByTagName("td");
			const no = tds[0].innerText;
			const url = tds[2].getElementsByTagName("a")[0].getAttribute("href");

			return { no, url };
		});

	let atWikiData: { no: string; url: string | undefined }[] = [];
	try {
		const atWikiResult = await fetch(
			"https://w.atwiki.jp/eiketsu-taisen/pages/216.html",
			{ headers },
		);
		const atWikiHTML = await atWikiResult.text();
		const atWikiDOM = DOMParser.parse(atWikiHTML);

		const atWikiTables = atWikiDOM.getElementsByTagName("table");
		if (!atWikiTables || atWikiTables.length === 0) {
			console.warn("[atWiki] No table found in the HTML (possibly blocked by Cloudflare)");
			console.log("[atWiki] HTML preview:", atWikiHTML.substring(0, 500));
			console.log("[atWiki] Skipping atWiki data...");
		} else {
			atWikiData = atWikiTables[0]
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
			console.log(`[atWiki] Successfully loaded ${atWikiData.length} entries`);
		}
	} catch (error) {
		console.error("[atWiki] Failed to fetch data:", error);
		console.log("[atWiki] Continuing without atWiki data...");
	}

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

	const wayToGets = baseJSON.wayToGet.map((wayToGet) => {
		const w = wayToGet.split(",");
		return w[0];
	});
	fs.writeFileSync(
		"data/json/wayToGets.json",
		JSON.stringify(wayToGets, null, 2),
	);

	const appearPatterns = baseJSON.appearPattern.map((pattern) => {
		const p = pattern.split(",");
		const from = p[0];
		const to = p[1];
		const wayToGet = +p[2];

		return `${wayToGets[wayToGet]}: ${from}〜${to}`;
	});
	fs.writeFileSync(
		"data/json/appearPatterns.json",
		JSON.stringify(appearPatterns, null, 2),
	);
	// const illusts = baseJSON.illust;
	// const cv = baseJSON.cv;

	const kabukies = baseJSON.kabuki[0].split(":");

	const setAppears = new Set<string>();
	const setStratCosts = new Set<string>();
	const setPowers = new Set<string>();
	const setIntelligentzias = new Set<string>();

	const generals: General[] = [];
	const generalImageHashs: GeneralImageHash[] = [];
	for (const general of baseJSON.general) {
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
		const appear = `第${g[7]}弾-${g[8]}`;
		const appearPattern = g[25].split(":").map((n) => {
			const ap = Number.parseInt(n);

			return appearPatterns[ap];
		});
		const detailImageId = g[1];
		const name = g[3];
		const kanaName = g[4];
		const color = colors[Number.parseInt(g[5])];
		const period = periods[Number.parseInt(g[6])];
		const cost = costs[Number.parseInt(g[13])];
		const unitType = unitTypes[Number.parseInt(g[15])];

		setAppears.add(appear);
		setStratCosts.add(strat.cost);
		setPowers.add(power);
		setIntelligentzias.add(intelligentzia);

		const dirName = `data/generals/${color.name}/${no}_${name}`;
		fs.mkdirSync(dirName, { recursive: true });

		const imageUrl = `https://image.eiketsu-taisen.net/general/card_ds/${detailImageId}.jpg`;

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

		const thumbnailUrl = `https://image.eiketsu-taisen.net/general/card_small/${id}.jpg`;
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

		const publicDir = `../app/public/images/generals/${no}_${name}`;
		fs.mkdirSync(publicDir, { recursive: true });
		await t5.toFile(`${publicDir}/5.jpg`);

		const ge = {
			no,
			appear,
			appearPatterns: appearPattern,
			id,
			detailImageId,
			name,
			kanaName,
			color,
			period,
			cost,
			unitType,
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

		fs.writeFileSync(`${dirName}/index.json`, JSON.stringify(ge, null, 2));

		generals.push(ge);

		const deckImageHash = await hashImage(`${dirName}/5.jpg`);

		const gi = {
			no,
			deckImageHash,
			name,
			kanaName,
			color: {
				name: color.name,
			},
		};
		generalImageHashs.push(gi);
	}

	const stratCosts = Array.from(setStratCosts).sort((a, b) => +a - +b);
	const powers = Array.from(setPowers).sort((a, b) => +a - +b);
	const intelligentzias = Array.from(setIntelligentzias).sort(
		(a, b) => +a - +b,
	);
	const appears = Array.from(setAppears);

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
	fs.writeFileSync(
		"data/json/general_image_hashs.json",
		JSON.stringify(generalImageHashs, null, 2),
	);
	fs.writeFileSync("data/json/appears.json", JSON.stringify(appears, null, 2));
};
mainExec && main();
