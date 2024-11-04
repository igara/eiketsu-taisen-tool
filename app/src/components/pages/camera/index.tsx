"use client";

import GeneralImageHashsJSON from "@eiketsu-taisen-tool/data/data/json/general_image_hashs.json";
import type { GeneralImageHash } from "@eiketsu-taisen-tool/data/types";
import OpenCV from "@techstark/opencv-js";
import React from "react";

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

	const detectAndResizeCard = () => {
		if (!refCanvas.current || !refVideo.current) return;

		const canvas = refCanvas.current;
		const context = canvas.getContext("2d", { willReadFrequently: true });
		if (!context) return;

		const video = refVideo.current;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		context.canvas.width = video.videoWidth;
		context.canvas.height = video.videoHeight;
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		try {
			const src = OpenCV.imread(canvas);
			const gray = new OpenCV.Mat();
			OpenCV.cvtColor(src, gray, OpenCV.COLOR_RGBA2GRAY);

			// ORBで特徴点を抽出
			const orb = new OpenCV.ORB();
			const keypoints = new OpenCV.KeyPointVector();
			const descriptors = new OpenCV.Mat();
			orb.detectAndCompute(gray, new OpenCV.Mat(), keypoints, descriptors);

			// 事前に計算した特徴量とマッチング
			let maxMatches = 0;
			let detectedCard = "";
			const generalImageHashs = GeneralImageHashsJSON as GeneralImageHash[];
			for (const general of generalImageHashs) {
				const refDescriptorsArray = general.cardImageHash;

				// Float32Arrayの特徴量データをMatに変換
				const refDescriptorsMat = OpenCV.matFromArray(
					refDescriptorsArray.length / 32,
					32,
					OpenCV.CV_32F,
					refDescriptorsArray,
				);

				// 特徴点マッチング
				const bf = new OpenCV.BFMatcher(OpenCV.NORM_L2, true); // ORBと互換性のあるマッチャー
				const matches = new OpenCV.DMatchVector();
				bf.match(descriptors, refDescriptorsMat, matches);

				if (matches.size() > maxMatches) {
					maxMatches = matches.size();
					detectedCard = `${general.no}_${general.name}`;
				}

				bf.delete();
				refDescriptorsMat.delete();
				matches.delete();
			}

			if (maxMatches > 50) {
				console.log(detectedCard);
			}

			// メモリ解放
			src.delete();
			gray.delete();
			descriptors.delete();
		} catch (e) {
			console.error(e);
		}
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
			</div>
		</main>
	);
};

export default Camera;
