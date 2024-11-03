"use client";

import GeneralsJSON from "@eiketsu-taisen-tool/data/data/json/generals.json";
import OpenCV from "@techstark/opencv-js";
import blockhash from "blockhash-core";
import { Jimp, type JimpInstance } from "jimp";
import React from "react";

const createImageDataFromJimp = async (jimpImage: JimpInstance) => {
	const { width, height } = jimpImage.bitmap;
	const data = new Uint8ClampedArray(jimpImage.bitmap.data); // RGBAデータをUint8ClampedArrayに変換

	return {
		data,
		width,
		height,
	} as blockhash.ImageData; // ImageData形式として返す
};

const hammingDistance = (hash1: string, hash2: string): number => {
	let distance = 0;
	for (let i = 0; i < hash1.length; i++) {
		if (hash1[i] !== hash2[i]) distance++;
	}
	return distance;
};

export const Camera: React.FC = () => {
	const refVideo = React.useRef<HTMLVideoElement>(null);
	const refCanvas = React.useRef<HTMLCanvasElement>(null);

	const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
	const [device, setDivice] = React.useState<MediaDeviceInfo | null>(null);

	const onChangeDeviceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const deviceId = e.target.value;
		const selectedDevice = devices.find(
			(device) => device.deviceId === deviceId,
		);
		if (!selectedDevice) return;

		setDivice(selectedDevice);
	};

	React.useEffect(() => {
		const getDevices = async () => {
			try {
				await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false,
				});

				const enumerateDevices =
					await window.navigator.mediaDevices.enumerateDevices();
				setDevices(
					enumerateDevices.filter(
						(device) => device.kind === "videoinput" && device.label,
					),
				);
			} catch (_) {}
		};
		getDevices();
	}, []);

	const detectAndResizeCard = async () => {
		if (!refCanvas.current || !refVideo.current) return;

		const canvas = refCanvas.current;
		const context = canvas.getContext("2d");
		if (!context) return;

		canvas.width = refVideo.current.videoWidth;
		canvas.height = refVideo.current.videoHeight;
		context.drawImage(refVideo.current, 0, 0, canvas.width, canvas.height);

		// Canvasから画像データを取得
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

		// OpenCVを使って画像を処理
		const src = OpenCV.matFromImageData(imageData);
		const dst = new OpenCV.Mat();
		OpenCV.cvtColor(src, src, OpenCV.COLOR_RGBA2GRAY); // グレースケールに変換
		OpenCV.GaussianBlur(src, src, new OpenCV.Size(5, 5), 0); // ぼかし処理
		OpenCV.Canny(src, dst, 50, 100); // エッジ検出

		// 輪郭を検出
		const contours = new OpenCV.MatVector();
		const hierarchy = new OpenCV.Mat();
		OpenCV.findContours(
			dst,
			contours,
			hierarchy,
			OpenCV.RETR_CCOMP,
			OpenCV.CHAIN_APPROX_SIMPLE,
		);

		// 最も大きな輪郭を取得
		let maxArea = 0;
		let cardContour = null;
		for (let i = 0; i < contours.size(); i++) {
			const area = OpenCV.contourArea(contours.get(i));
			if (area > maxArea) {
				maxArea = area;
				cardContour = contours.get(i);
			}
		}

		if (cardContour) {
			const boundingRect = OpenCV.boundingRect(cardContour);
			const cardImage = src.roi(boundingRect); // カード部分を切り出し
			const resizedCardImage = new OpenCV.Mat();
			OpenCV.resize(cardImage, resizedCardImage, new OpenCV.Size(256, 256)); // リサイズ

			// Jimpに変換
			const cardBuffer = Buffer.from(
				new Uint8ClampedArray(resizedCardImage.data),
			);
			const jimpImage = new Jimp({
				data: cardBuffer,
				width: resizedCardImage.cols,
				height: resizedCardImage.rows,
			});

			// blockhashでハッシュを生成
			const imageData = await createImageDataFromJimp(jimpImage); // JimpからImageDataを生成
			const hash = blockhash.bmvbhash(imageData, 16); // ハッシュを生成

			// ハッシュデータベースと比較
			let bestMatch: string | null = null;
			let lowestDistance = Number.POSITIVE_INFINITY;

			for (const general of GeneralsJSON) {
				const distance = hammingDistance(hash, general.cardImageHash);

				if (distance < lowestDistance) {
					bestMatch = `${general.no}_${general.name}`;
					lowestDistance = distance;
				}
			}

			// 結果を設定
			const THRESHOLD = 40;
			if (lowestDistance <= THRESHOLD) {
				console.log(`識別結果: ${bestMatch}（距離: ${lowestDistance}）`);
				alert(`識別結果: ${bestMatch}（距離: ${lowestDistance}）`);
			} else {
				console.log(
					`識別結果: 識別できませんでした（距離: ${lowestDistance}）`,
				);
			}
		}

		// メモリの解放
		src.delete();
		dst.delete();
		contours.delete();
		hierarchy.delete();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (!device) return;

		if (!refVideo) return;
		if (!refVideo.current) return;
		if (!refCanvas) return;
		if (!refCanvas.current) return;

		const video = refVideo.current;
		const canvas = refCanvas.current;

		const check = async () => {
			try {
				if (!window.navigator.mediaDevices.getUserMedia) return;

				const stream = await window.navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						deviceId: device.deviceId,
					},
				});
				video.srcObject = stream;

				video.onloadedmetadata = () => {
					video.play();
					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
				};
			} catch (e) {
				console.error(e);
			}
		};
		check();

		const intervalId = window.setInterval(detectAndResizeCard, 1000);

		return () => {
			window.clearInterval(intervalId); // コンポーネントのアンマウント時にクリア
		};
	}, [device]);

	return (
		<main>
			<div>
				<select onChange={onChangeDeviceSelect}>
					<option value={0}>カメラ選択してください</option>
					{devices.map((device, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<option key={index} value={device.deviceId}>
							{device.label}
						</option>
					))}
				</select>
			</div>

			<div className={device ? "" : "hidden"}>
				<video muted autoPlay playsInline ref={refVideo} className="w-4/12" />
				<canvas
					ref={refCanvas}
					className="w-4/12"
					// className="hidden"
				/>
			</div>
		</main>
	);
};

export default Camera;
