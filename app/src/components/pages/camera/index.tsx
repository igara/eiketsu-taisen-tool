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
	const refPreviewCanvas = React.useRef<HTMLCanvasElement>(null);

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
		if (!refCanvas.current || !refVideo.current || !refPreviewCanvas.current)
			return;

		const canvas = refCanvas.current;
		const context = canvas.getContext("2d");
		if (!context) return;

		const video = refVideo.current;
		const previewCanvas = refPreviewCanvas.current;
		const previewContext = previewCanvas.getContext("2d");
		if (!previewContext) return;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		// Canvasから画像データを取得
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

		// OpenCVを使って画像を処理
		const src = OpenCV.imread(canvas);
		let dst = new OpenCV.Mat();
		OpenCV.cvtColor(src, dst, OpenCV.COLOR_RGBA2GRAY, 0);
		OpenCV.threshold(dst, dst, 0, 255, OpenCV.THRESH_OTSU);

		// 輪郭を検出
		const contours = new OpenCV.MatVector();
		const hierarchy = new OpenCV.Mat();
		OpenCV.findContours(
			dst,
			contours,
			hierarchy,
			OpenCV.RETR_EXTERNAL,
			OpenCV.CHAIN_APPROX_TC89_L1,
		);
		dst.delete();
		dst = cv.Mat.zeros(src.rows, src.cols, OpenCV.CV_8UC3);

		for (let i = 0; i < contours.size(); i++) {
			// ある程度のサイズ以上の輪郭のみ処理
			const area = OpenCV.contourArea(contours.get(i), false);
			if (area > 15000) {
				const approx = new OpenCV.Mat();
				// cv.Matは行列で、幅1, 高さ4のものが4頂点に近似できた範囲になる
				OpenCV.approxPolyDP(
					contours.get(i),
					approx,
					0.01 * cv.arcLength(contours.get(i), true),
					true,
				);
				if (approx.size().width === 1 && approx.size().height === 4) {
					// 四角形に近似できる領域は赤で輪郭線描画
					OpenCV.drawContours(
						dst,
						contours,
						i,
						new cv.Scalar(255, 0, 0, 255),
						4,
						cv.LINE_8,
						hierarchy,
						100,
					);

					const { x, y, width, height } = OpenCV.boundingRect(contours.get(i));

					previewCanvas.width = width;
					previewCanvas.height = height;
					previewContext.drawImage(
						canvas,
						x,
						y,
						width,
						height,
						0,
						0,
						previewCanvas.width,
						previewCanvas.height,
					);

					// blockhashでハッシュを生成
					const imageData = previewContext.getImageData(0, 0, width, height);
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
					}
				} else {
					// それ以外の輪郭は緑で描画
					OpenCV.drawContours(
						dst,
						contours,
						i,
						new cv.Scalar(0, 255, 0, 255),
						1,
						cv.LINE_8,
						hierarchy,
						100,
					);
				}
				approx.delete();
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

		const intervalId = window.setInterval(detectAndResizeCard, 500);

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
				<canvas
					ref={refPreviewCanvas}
					className="w-4/12"
					// className="hidden"
				/>
			</div>
		</main>
	);
};

export default Camera;
