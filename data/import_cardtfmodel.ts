import fs from "node:fs";
import { parseArgs } from "node:util";
import tf from "@tensorflow/tfjs-node";
import Canvas from "canvas";
import { cardSize } from "./card_tf_model";
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
	}: {
		dirName: string;
		inputPath: string;
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
		fs.writeFileSync(`${dirName}/6.jpg`, buffer);
	};

	const glossGradientHorizonMiddle = async ({
		dirName,
		inputPath,
	}: {
		dirName: string;
		inputPath: string;
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
		fs.writeFileSync(`${dirName}/7.jpg`, buffer);
	};

	const glossGradientHorizonBottom = async ({
		dirName,
		inputPath,
	}: {
		dirName: string;
		inputPath: string;
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
		fs.writeFileSync(`${dirName}/8.jpg`, buffer);
	};

	const glossGradientVerticalLeft = async ({
		dirName,
		inputPath,
	}: {
		dirName: string;
		inputPath: string;
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
		fs.writeFileSync(`${dirName}/9.jpg`, buffer);
	};

	const glossGradientVerticalMiddle = async ({
		dirName,
		inputPath,
	}: {
		dirName: string;
		inputPath: string;
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
		fs.writeFileSync(`${dirName}/10.jpg`, buffer);
	};

	const glossGradientVerticalRight = async ({
		dirName,
		inputPath,
	}: {
		dirName: string;
		inputPath: string;
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
		fs.writeFileSync(`${dirName}/11.jpg`, buffer);
	};

	const createDarkenedImage = async ({
		dirName,
		inputPath,
	}: {
		dirName: string;
		inputPath: string;
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
		fs.writeFileSync(`${dirName}/12.jpg`, buffer);
	};

	const createBlurredImage = async ({
		dirName,
		inputPath,
	}: {
		dirName: string;
		inputPath: string;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		ctx.globalAlpha = 0.1;
		const blurAmount = 5;

		// 指定されたぼかし量に応じて、少しずつずらして画像を重ねて描画
		for (let y = -blurAmount; y <= blurAmount; y += 1) {
			for (let x = -blurAmount; x <= blurAmount; x += 1) {
				ctx.drawImage(image, x, y, width, height);
			}
		}

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/13.jpg`, buffer);
	};

	const createBlurredAndDarkenedImage = async ({
		dirName,
		inputPath,
	}: {
		dirName: string;
		inputPath: string;
	}) => {
		const image = await Canvas.loadImage(inputPath);
		const width = image.width;
		const height = image.height;

		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(image, 0, 0, width, height);

		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height);

		const tempCanvas = Canvas.createCanvas(width, height);
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.drawImage(canvas, 0, 0, width, height);

		ctx.globalAlpha = 0.1;
		const blurAmount = 5;

		// 指定されたぼかし量に応じて、少しずつずらして画像を重ねて描画
		for (let y = -blurAmount; y <= blurAmount; y += 1) {
			for (let x = -blurAmount; x <= blurAmount; x += 1) {
				ctx.drawImage(tempCanvas, x, y, width, height);
			}
		}

		// ファイル出力
		const buffer = canvas.toBuffer("image/jpeg");
		fs.writeFileSync(`${dirName}/14.jpg`, buffer);
	};

	for (const general of GeneralJSON) {
		const dirName = `data/generals/${general.color.name}/${general.no}_${general.name}`;
		const inputPath = `${dirName}/2.jpg`;

		await glossGradientHorizonTop({ dirName, inputPath });
		await glossGradientHorizonMiddle({ dirName, inputPath });
		await glossGradientHorizonBottom({ dirName, inputPath });
		await glossGradientVerticalLeft({ dirName, inputPath });
		await glossGradientVerticalMiddle({ dirName, inputPath });
		await glossGradientVerticalRight({ dirName, inputPath });
		await createDarkenedImage({ dirName, inputPath });
		await createBlurredImage({ dirName, inputPath });
		await createBlurredAndDarkenedImage({ dirName, inputPath });
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

		for (const i of Array(15).keys()) {
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
