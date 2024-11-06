import { GeneralCardImageHashContext } from "@/context/duckdb/GeneralCardImageHash";
import cv from "@techstark/opencv-js";
import React from "react";

export const useLogic = () => {
	const { generalCardImageHashDB } = React.useContext(
		GeneralCardImageHashContext,
	);
	const refVideo = React.useRef<HTMLVideoElement>(null);

	const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
	const [device, setDivice] = React.useState<MediaDeviceInfo | null>(null);
	const [isVideo, setIsVideo] = React.useState(false);

	const onChangeDeviceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const deviceId = e.target.value;
		const selectedDevice = devices.find(
			(device) => device.deviceId === deviceId,
		);
		if (!selectedDevice) return;

		setDivice(selectedDevice);
	};

	React.useEffect(() => {
		if (!generalCardImageHashDB) return;

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

				// if (generalCardImageHashDB) {
				// const connection = await generalCardImageHashDB.connection();
				// const result = await connection.query(
				// 	"SELECT * FROM general_card_image_hash;",
				// );
				// const rows = result.toArray();
				// for (const row of rows) {
				// 	console.log(row.no);
				// 	console.log(row.name);
				// }
				// }
			} catch (_) {}
		};
		getDevices();
	}, [generalCardImageHashDB]);

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

	return {
		generalCardImageHashDB,
		onChangeDeviceSelect,
		devices,
		device,
		refVideo,
	};
};
