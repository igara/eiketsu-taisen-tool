"use client";

import GeneralImageHashsJSON from "@eiketsu-taisen-tool/data/data/json/general_image_hashs.json";
import type { GeneralImageHash } from "@eiketsu-taisen-tool/data/types";
import cv, { min } from "@techstark/opencv-js";
import React from "react";

export const Camera: React.FC = () => {
	const refVideo = React.useRef<HTMLVideoElement>(null);

	const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
	const [device, setDivice] = React.useState<MediaDeviceInfo | null>(null);
	const [isVideo, setIsVideo] = React.useState(false);

	const GeneralImageHashs = GeneralImageHashsJSON as GeneralImageHash[];

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

	// cv.CV_32Fに変換する関数
	const convertToFloat32 = (mat: cv.Mat) => {
		const convertedMat = new cv.Mat();
		mat.convertTo(convertedMat, cv.CV_32F);
		return convertedMat;
	};

	const padToMatchSize = (
		mat: cv.Mat,
		targetRows: number,
		targetCols: number,
	) => {
		const paddedMat = new cv.Mat();
		const top = 0;
		const bottom = targetRows - mat.rows;
		const left = 0;
		const right = targetCols - mat.cols;

		cv.copyMakeBorder(
			mat,
			paddedMat,
			top,
			bottom,
			left,
			right,
			cv.BORDER_CONSTANT,
			new cv.Scalar(0, 0, 0, 0),
		);
		return paddedMat;
	};

	// ユークリッド距離を計算する関数（型とサイズ合わせ含む）
	const calculateEuclideanDistance = (desc1: cv.Mat, desc2: cv.Mat) => {
		// 型をcv.CV_32Fに変換
		let adjustedDesc1 =
			desc1.type() === cv.CV_32F ? desc1 : convertToFloat32(desc1);
		let adjustedDesc2 =
			desc2.type() === cv.CV_32F ? desc2 : convertToFloat32(desc2);

		// サイズが異なる場合はリサイズまたはパディング
		if (
			adjustedDesc1.rows !== adjustedDesc2.rows ||
			adjustedDesc1.cols !== adjustedDesc2.cols
		) {
			if (
				adjustedDesc1.rows * adjustedDesc1.cols >
				adjustedDesc2.rows * adjustedDesc2.cols
			) {
				adjustedDesc2 = padToMatchSize(
					adjustedDesc2,
					adjustedDesc1.rows,
					adjustedDesc1.cols,
				);
			} else {
				adjustedDesc1 = padToMatchSize(
					adjustedDesc1,
					adjustedDesc2.rows,
					adjustedDesc2.cols,
				);
			}
		}

		// データ配列を取得してユークリッド距離を計算
		const data1 = adjustedDesc1.data32F;
		const data2 = adjustedDesc2.data32F;

		if (data1.length !== data2.length) {
			throw new Error("データの長さが一致しません");
		}

		let sum = 0;
		for (let i = 0; i < data1.length; i++) {
			const diff = data1[i] - data2[i];
			sum += diff * diff;
		}

		// 必要なメモリの解放
		if (desc1 !== adjustedDesc1) adjustedDesc1.delete();
		if (desc2 !== adjustedDesc2) adjustedDesc2.delete();

		return Math.sqrt(sum); // ユークリッド距離
	};

	const calculateSimilarity = (desc1: cv.Mat, desc2: cv.Mat): number => {
		const distance = calculateEuclideanDistance(desc1, desc2);
		const similarity = 1 / (1 + distance); // 類似度の計算
		return similarity; // 0から1の範囲
	};

	const detectAndResizeCard = () => {
		if (!refVideo.current || !isVideo) return;
		const video = refVideo.current;

		try {
			const frameWidth = video.videoWidth;
			const frameHeight = video.videoHeight;

			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = frameWidth;
			canvas.height = frameHeight;
			ctx?.drawImage(video, 0, 0, frameWidth, frameHeight);

			// Canvasから画像データを取得してcv.Matに変換
			const imageData = ctx?.getImageData(0, 0, frameWidth, frameHeight);
			if (!imageData) return;

			const src = cv.matFromImageData(imageData);

			const gray = new cv.Mat();
			cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

			// カメラ画像から特徴を抽出
			const detector = new cv.ORB();
			const keyPoints = new cv.KeyPointVector();
			const descriptors = new cv.Mat();
			detector.detectAndCompute(gray, new cv.Mat(), keyPoints, descriptors);

			let maxDistance = 0;
			let card = "";
			// 事前計算された特徴量とマッチング
			for (const generalImageHash of GeneralImageHashs) {
				const precomputedDescriptor = cv.matFromArray(
					generalImageHash.cardImageHash.length / 32,
					32,
					cv.CV_32F,
					generalImageHash.cardImageHash,
				);

				// 距離を計算
				const distance = calculateSimilarity(
					descriptors,
					precomputedDescriptor,
				);
				precomputedDescriptor.delete();

				if (!card) {
					maxDistance = distance;
					card = `${generalImageHash.no}_${generalImageHash.name}`;
				}
				if (distance > maxDistance) {
					maxDistance = distance;
					card = `${generalImageHash.no}_${generalImageHash.name}`;
				}
			}

			console.log(card);

			// リソースの解放
			src.delete();
			gray.delete();
			descriptors.delete();
			keyPoints.delete();
		} catch (e) {
			console.error(e);
		}
	};

	React.useEffect(() => {
		if (!device) return;

		if (!refVideo) return;
		if (!refVideo.current) return;

		const video = refVideo.current;

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

				video.addEventListener("loadedmetadata", () => {
					setIsVideo(true);
				});
			} catch (e) {
				console.error(e);
			}
		};
		check();
	}, [device]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (!isVideo) return;

		const intervalId = setInterval(detectAndResizeCard, 1000);
		return () => clearInterval(intervalId);
	}, [isVideo]);

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
			</div>
		</main>
	);
};

export default Camera;
