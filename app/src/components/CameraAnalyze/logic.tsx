import { GeneralCardImageHashContext } from "@/context/duckdb/GeneralCardImageHash";
import cv from "@techstark/opencv-js";
import React from "react";

export const useLogic = () => {
	const { generalCardImageHashDB } = React.useContext(
		GeneralCardImageHashContext,
	);
	const refVideo = React.useRef<HTMLVideoElement>(null);
	const refVideoCanvas = React.useRef<HTMLCanvasElement>(null);
	const refMonoCanvas = React.useRef<HTMLCanvasElement>(null);
	const refCardCanvas = React.useRef<HTMLCanvasElement>(null);

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
		if (!isVideo) return;

		if (!refVideo.current) return;
		const video = refVideo.current;

		if (!refVideoCanvas.current) return;
		const videoCanvas = refVideoCanvas.current;
		const videoCanvasContext = videoCanvas.getContext("2d", {
			willReadFrequently: true,
		});
		if (!videoCanvasContext) return;

		if (!refMonoCanvas.current) return;
		const monoCanvas = refMonoCanvas.current;
		const monoCanvasContext = monoCanvas.getContext("2d", {
			willReadFrequently: true,
		});
		if (!monoCanvasContext) return;

		if (!refCardCanvas.current) return;
		const cardCanvas = refCardCanvas.current;
		const cardCanvasContext = cardCanvas.getContext("2d", {
			willReadFrequently: true,
		});
		if (!cardCanvasContext) return;

		try {
			const frameWidth = video.videoWidth;
			const frameHeight = video.videoHeight;

			videoCanvas.width = frameWidth;
			videoCanvas.height = frameHeight;
			videoCanvasContext.drawImage(video, 0, 0, frameWidth, frameHeight);

			monoCanvas.width = frameWidth;
			monoCanvas.height = frameHeight;

			const videoCanvasCVSRC = cv.imread(videoCanvas);
			const monoCVDST = new cv.Mat();
			cv.cvtColor(videoCanvasCVSRC, monoCVDST, cv.COLOR_RGBA2GRAY, 0);
			cv.threshold(monoCVDST, monoCVDST, 0, 255, cv.THRESH_OTSU);
			const contours = new cv.MatVector();
			const hierarchy = new cv.Mat();
			cv.findContours(
				monoCVDST,
				contours,
				hierarchy,
				cv.RETR_EXTERNAL,
				cv.CHAIN_APPROX_TC89_L1,
			);

			monoCVDST.delete();
			const videoCanvasCVDST = cv.Mat.zeros(
				videoCanvasCVSRC.rows,
				videoCanvasCVSRC.cols,
				cv.CV_8UC3,
			);
			for (let i = 0; i < contours.size(); i++) {
				const area = cv.contourArea(contours.get(i), false);
				if (area > 15000) {
					const approx = new cv.Mat();
					cv.approxPolyDP(
						contours.get(i),
						approx,
						0.01 * cv.arcLength(contours.get(i), true),
						true,
					);
					if (approx.size().width === 1 && approx.size().height === 4) {
						cv.drawContours(
							videoCanvasCVDST,
							contours,
							i,
							new cv.Scalar(255, 0, 0, 255),
							4,
							cv.LINE_8,
							hierarchy,
							100,
						);
						const { x, y, width, height } = cv.boundingRect(contours.get(i));
						cardCanvas.width = width;
						cardCanvas.height = height;
						// カードの描画
						cardCanvasContext.drawImage(
							videoCanvas,
							x,
							y,
							width,
							height,
							0,
							0,
							width,
							height,
						);
					} else {
						cv.drawContours(
							videoCanvasCVDST,
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

			cv.imshow(monoCanvas, videoCanvasCVDST);
			videoCanvasCVSRC.delete();
			videoCanvasCVDST.delete();
			hierarchy.delete();
			contours.delete();

			// Canvasから画像データを取得してcv.Matに変換
			// const imageData = monoCanvasContext?.getImageData(
			// 	0,
			// 	0,
			// 	frameWidth,
			// 	frameHeight,
			// );
			// if (!imageData) return;

			// const src = cv.matFromImageData(imageData);

			// const gray = new cv.Mat();
			// cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

			// // カメラ画像から特徴を抽出
			// const detector = new cv.ORB();
			// const keyPoints = new cv.KeyPointVector();
			// const descriptors = new cv.Mat();
			// detector.detectAndCompute(gray, new cv.Mat(), keyPoints, descriptors);
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

		const intervalId = setInterval(detectAndResizeCard, 500);
		return () => clearInterval(intervalId);
	}, [isVideo]);

	return {
		generalCardImageHashDB,
		onChangeDeviceSelect,
		devices,
		device,
		refVideo,
		refVideoCanvas,
		refMonoCanvas,
		refCardCanvas,
	};
};
