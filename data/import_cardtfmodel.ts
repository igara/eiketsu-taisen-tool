import fs from "node:fs";
import { parseArgs } from "node:util";
import tf from "@tensorflow/tfjs-node";
import Canvas from "canvas";
import { cardSize } from "./card_tf_model.ts";
import type { General } from "./types";

const {
	values: { cardImageTFModelForImage, cardImageTFModel },
} = parseArgs({
	options: {
		cardImageTFModelForImage: {
			type: "boolean",
			short: "b",
			default: false,
		},
		cardImageTFModel: {
			type: "boolean",
			short: "b",
			default: false,
		},
	},
});

const cardImageTFModelForImageExec = async () => {
	const GeneralJSON: General[] = JSON.parse(
		fs.readFileSync("data/json/generals.json", "utf8"),
	);

	const glossGradientHorizonTop = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientHorizonMiddle = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientHorizonBottom = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientVerticalLeft = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, 0);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientVerticalMiddle = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, 0);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientVerticalRight = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, 0);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientLeftTop = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientLeftMiddle = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientLeftBottom = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.6, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientRightTop = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(width, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientRightMiddle = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(width, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const glossGradientRightBottom = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(width, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

		ctx.fillStyle = glossGradient;
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImage = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientHorizonTop = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = tempCtx.createLinearGradient(0, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientHorizonMiddle = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = tempCtx.createLinearGradient(0, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientHorizonBottom = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = tempCtx.createLinearGradient(0, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientVerticalLeft = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, 0);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientVerticalMiddle = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, 0);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientVerticalRight = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, 0);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientLeftTop = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientLeftMiddle = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientLeftBottom = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(0, 0, width, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.6, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientRightTop = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(width, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientRightMiddle = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(width, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	const createDarkenedImageGlossGradientRightBottom = async ({
		dirName,
		inputPath,
		i,
	}: {
		dirName: string;
		inputPath: string;
		i: number;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// 元画像を描画
		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		const glossGradient = ctx.createLinearGradient(width, 0, 0, height);
		glossGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
		glossGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
		glossGradient.addColorStop(1, "rgba(255, 255, 255, 0.5)");

		tempCtx.fillStyle = glossGradient;
		tempCtx.fillRect(0, 0, width, height);

		// ファイル出力
		const buffer = tempCanvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/${i}.jpg`, buffer);
	};

	for (const general of GeneralJSON) {
		const dirName = `data/generals/${general.color.name}/${general.no}_${general.name}`;
		const inputPath = `${dirName}/2.jpg`;

		await glossGradientHorizonTop({ dirName, inputPath, i: 6 });
		await glossGradientHorizonMiddle({ dirName, inputPath, i: 7 });
		await glossGradientHorizonBottom({ dirName, inputPath, i: 8 });
		await glossGradientVerticalLeft({ dirName, inputPath, i: 9 });
		await glossGradientVerticalMiddle({ dirName, inputPath, i: 10 });
		await glossGradientVerticalRight({ dirName, inputPath, i: 11 });
		await glossGradientLeftTop({ dirName, inputPath, i: 12 });
		await glossGradientLeftMiddle({ dirName, inputPath, i: 13 });
		await glossGradientLeftBottom({ dirName, inputPath, i: 14 });
		await glossGradientRightTop({ dirName, inputPath, i: 15 });
		await glossGradientRightMiddle({ dirName, inputPath, i: 16 });
		await glossGradientRightBottom({ dirName, inputPath, i: 17 });
		await createDarkenedImage({ dirName, inputPath, i: 18 });
		await createDarkenedImageGlossGradientHorizonTop({
			dirName,
			inputPath,
			i: 19,
		});
		await createDarkenedImageGlossGradientHorizonMiddle({
			dirName,
			inputPath,
			i: 20,
		});
		await createDarkenedImageGlossGradientHorizonBottom({
			dirName,
			inputPath,
			i: 21,
		});
		await createDarkenedImageGlossGradientVerticalLeft({
			dirName,
			inputPath,
			i: 22,
		});
		await createDarkenedImageGlossGradientVerticalMiddle({
			dirName,
			inputPath,
			i: 23,
		});
		await createDarkenedImageGlossGradientVerticalRight({
			dirName,
			inputPath,
			i: 24,
		});
		await createDarkenedImageGlossGradientLeftTop({
			dirName,
			inputPath,
			i: 25,
		});
		await createDarkenedImageGlossGradientLeftMiddle({
			dirName,
			inputPath,
			i: 26,
		});
		await createDarkenedImageGlossGradientLeftBottom({
			dirName,
			inputPath,
			i: 27,
		});
		await createDarkenedImageGlossGradientRightTop({
			dirName,
			inputPath,
			i: 28,
		});
		await createDarkenedImageGlossGradientRightMiddle({
			dirName,
			inputPath,
			i: 29,
		});
		await createDarkenedImageGlossGradientRightBottom({
			dirName,
			inputPath,
			i: 30,
		});
	}
};
cardImageTFModelForImage && cardImageTFModelForImageExec();

// 画像をTensorに変換する関数
async function loadImageToTensor(imagePath: string) {
	const image = (await Canvas.loadImage(
		imagePath,
	)) as unknown as HTMLImageElement;
	const canvas = Canvas.createCanvas(
		image.width,
		image.height,
	) as unknown as HTMLCanvasElement;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.drawImage(image, 0, 0);
	const tensor = tf.browser
		.fromPixels(canvas)
		.resizeNearestNeighbor([cardSize.width, cardSize.height])
		.toFloat()
		.div(tf.scalar(255.0));
	return tensor;
}

// ディレクトリ内の画像を読み込んで、Tensorとラベルを生成する関数
async function loadImagesFromDirectories() {
	const generalsJSON: General[] = JSON.parse(
		fs.readFileSync("data/json/generals.json", "utf8"),
	);

	const classNames = [];
	const images: tf.Tensor<tf.Rank>[] = [];
	const labels = [];

	for (const general of generalsJSON) {
		const className = `${general.color.name}_${general.no}_${general.name}`;
		classNames.push(className);

		for (const i of Array(31).keys()) {
			if (i === 0) continue;
			if (i === 1) continue;
			if (i === 3) continue;

			const filePath = `data/generals/${general.color.name}/${general.no}_${general.name}/${i}.jpg`;
			const tensor = await loadImageToTensor(filePath);
			if (!tensor) continue;
			images.push(tensor);
			labels.push(classNames.indexOf(className));
		}
	}

	const xs = tf.stack(images);
	const ys = tf.tensor(labels, [labels.length, 1]);
	return { xs, ys, classNames };
}

const createCardImageTFModel = async () => {
	if (fs.existsSync("general-image")) {
		fs.rmdirSync("general-image", { recursive: true });
	}
	if (fs.existsSync("../app/public/tensorflow/general-image")) {
		fs.rmdirSync("../app/public/tensorflow/general-image", { recursive: true });
	}

	const { xs, ys, classNames } = await loadImagesFromDirectories();

	// モデルの構築
	const model = tf.sequential();
	model.add(
		tf.layers.conv2d({
			inputShape: [cardSize.width, cardSize.height, 3],
			filters: 8,
			kernelSize: 3,
			activation: "relu",
		}),
	);
	model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
	model.add(
		tf.layers.conv2d({ filters: 16, kernelSize: 3, activation: "relu" }),
	);
	model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
	model.add(tf.layers.flatten());
	model.add(
		tf.layers.dense({ units: classNames.length, activation: "softmax" }),
	);

	// コンパイル
	model.compile({
		optimizer: "adam",
		loss: "sparseCategoricalCrossentropy",
		metrics: ["accuracy"],
	});

	// トレーニング
	await model.fit(xs, ys, { epochs: 10 });

	// モデルを保存
	await model.save("file://./general-image"); // ローカルファイルに保存
	console.log("モデルのトレーニングが完了しました");
};
cardImageTFModel && createCardImageTFModel();
