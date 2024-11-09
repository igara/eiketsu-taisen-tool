import { GeneralCardImageDescriptorContext } from "@/context/sqlite/GeneralCardImageDescriptor";
import type { GeneralCardImageDescriptor } from "@eiketsu-taisen-tool/data/types";
import cv from "@techstark/opencv-js";
import React from "react";

function calculateDistance(
	descriptorA: Float32Array,
	descriptorB: Float32Array,
): number {
	let sum = 0;
	for (let i = 0; i < descriptorA.length; i++) {
		const d1 = Number.isNaN(descriptorA[i]) ? 0 : descriptorA[i];
		const d2 = Number.isNaN(descriptorB[i]) ? 0 : descriptorB[i];
		const diff = d1 - d2;
		sum += diff * diff;
	}

	return Math.sqrt(sum);
}

function findMostSimilarDescriptor(
	descriptors: GeneralCardImageDescriptor[],
	queryDescriptor: Float32Array,
) {
	let minDistance = Number.POSITIVE_INFINITY;
	let mostSimilar = {
		no: "",
		name: "",
	};

	for (const descriptor of descriptors) {
		const distance = calculateDistance(
			new Float32Array(JSON.parse(descriptor.descriptor)),
			queryDescriptor,
		);

		if (distance < minDistance) {
			minDistance = distance;
			mostSimilar = {
				no: descriptor.no,
				name: descriptor.name,
			};
		}
	}

	return mostSimilar;
}

function createTargerSizeFloat32Array(
	targetSize: number,
	featureArray: Float32Array,
) {
	let newArray = new Float32Array();
	if (featureArray.length > targetSize) {
		const trimmedArray = featureArray.slice(0, targetSize);
		newArray = new Float32Array(Array.from(trimmedArray));
	} else {
		const paddedArray = new Float32Array(targetSize);
		paddedArray.set(featureArray);
		newArray = new Float32Array(Array.from(paddedArray));
	}

	return newArray;
}

export const useLogic = () => {
	const { generalCardImageDescriptorDB } = React.useContext(
		GeneralCardImageDescriptorContext,
	);
	const refVideo = React.useRef<HTMLVideoElement>(null);
	const refVideoCanvas = React.useRef<HTMLCanvasElement>(null);
	const refMonoCanvas = React.useRef<HTMLCanvasElement>(null);
	const refAutoCardCanvas = React.useRef<HTMLCanvasElement>(null);
	const refSelectedCardCanvas = React.useRef<HTMLCanvasElement>(null);

	const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
	const [device, setDivice] = React.useState<MediaDeviceInfo | null>(null);
	const [isVideo, setIsVideo] = React.useState(false);
	const [selectedVideoCanvasPosition, setSelectedVideoCanvasPosition] =
		React.useState({
			from: {
				x: 0,
				y: 0,
			},
			to: {
				x: 0,
				y: 0,
			},
		});
	const [isSelectingVideoCanvasPosition, setIsSelectingVideoCanvasPosition] =
		React.useState(false);
	const [autoCardNo, setAutoCardNo] = React.useState("");
	const [selectedCardNo, setSelectedCardNo] = React.useState("");

	const onChangeDeviceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const deviceId = e.target.value;
		const selectedDevice = devices.find(
			(device) => device.deviceId === deviceId,
		);
		if (!selectedDevice) return;

		setDivice(selectedDevice);
	};

	React.useEffect(() => {
		if (!generalCardImageDescriptorDB) return;

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
	}, [generalCardImageDescriptorDB]);

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

		if (!refAutoCardCanvas.current) return;
		const cardCanvas = refAutoCardCanvas.current;
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

			// 矩形選択に基づいた線を描画
			const { from, to } = selectedVideoCanvasPosition;
			videoCanvasContext.beginPath();
			videoCanvasContext.rect(from.x, from.y, to.x - from.x, to.y - from.y);
			videoCanvasContext.strokeStyle = "red"; // 線の色を設定
			videoCanvasContext.lineWidth = 2; // 線の太さを設定
			videoCanvasContext.stroke();

			monoCanvas.width = frameWidth;
			monoCanvas.height = frameHeight;

			const videoCanvasCVSRC = cv.imread(videoCanvas);
			const monoCVDST = new cv.Mat();
			cv.cvtColor(videoCanvasCVSRC, monoCVDST, cv.COLOR_RGBA2GRAY, 0);
			cv.threshold(monoCVDST, monoCVDST, 0, 255, cv.THRESH_OTSU);
			const videoCanvasContours = new cv.MatVector();
			const videoCanvasHierarchy = new cv.Mat();
			cv.findContours(
				monoCVDST,
				videoCanvasContours,
				videoCanvasHierarchy,
				cv.RETR_EXTERNAL,
				cv.CHAIN_APPROX_TC89_L1,
			);

			monoCVDST.delete();
			const videoCanvasCVDST = cv.Mat.zeros(
				videoCanvasCVSRC.rows,
				videoCanvasCVSRC.cols,
				cv.CV_8UC3,
			);
			for (let i = 0; i < videoCanvasContours.size(); i++) {
				const area = cv.contourArea(videoCanvasContours.get(i), false);
				if (area > 15000) {
					const approx = new cv.Mat();
					cv.approxPolyDP(
						videoCanvasContours.get(i),
						approx,
						0.01 * cv.arcLength(videoCanvasContours.get(i), true),
						true,
					);
					if (approx.size().width === 1 && approx.size().height === 4) {
						cv.drawContours(
							videoCanvasCVDST,
							videoCanvasContours,
							i,
							new cv.Scalar(255, 0, 0, 255),
							4,
							cv.LINE_8,
							videoCanvasHierarchy,
							100,
						);
						const { x, y, width, height } = cv.boundingRect(
							videoCanvasContours.get(i),
						);
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
							videoCanvasContours,
							i,
							new cv.Scalar(0, 255, 0, 255),
							1,
							cv.LINE_8,
							videoCanvasHierarchy,
							100,
						);
					}
					approx.delete();
				}
			}

			cv.imshow(monoCanvas, videoCanvasCVDST);
			videoCanvasCVSRC.delete();
			videoCanvasCVDST.delete();
			videoCanvasHierarchy.delete();
			videoCanvasContours.delete();
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

		const intervalId = setInterval(detectAndResizeCard, 1000 / 120);
		return () => clearInterval(intervalId);
	}, [isVideo, selectedVideoCanvasPosition]);

	// キャンバス内の位置を実際の解像度に合わせるための関数
	const adjustForCanvasScale = (clientX: number, clientY: number) => {
		if (!refVideoCanvas.current)
			return {
				x: 0,
				y: 0,
			};
		const videoCanvas = refVideoCanvas.current;

		const rect = videoCanvas.getBoundingClientRect();
		const scaleX = videoCanvas.width / rect.width;
		const scaleY = videoCanvas.height / rect.height;

		return {
			x: (clientX - rect.left) * scaleX,
			y: (clientY - rect.top) * scaleY,
		};
	};

	/**
	 * モバイルスクロール禁止処理
	 */
	const scrollNo = React.useCallback((e: TouchEvent) => {
		if (e.cancelable) {
			e.preventDefault();
		}
	}, []);

	const onTouchStartVideoCanvas = (e: React.TouchEvent<HTMLCanvasElement>) => {
		const touch = e.touches[0];
		const position = adjustForCanvasScale(touch.clientX, touch.clientY);
		document.addEventListener("touchmove", scrollNo, { passive: false });
		document.body.style.overflow = "hidden";

		setSelectedVideoCanvasPosition({
			from: position,
			to: position,
		});

		setIsSelectingVideoCanvasPosition(true);
	};

	const onMouseDownVideoCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const position = adjustForCanvasScale(e.clientX, e.clientY);
		document.addEventListener("touchmove", scrollNo, { passive: false });
		document.body.style.overflow = "hidden";

		setSelectedVideoCanvasPosition({
			from: position,
			to: position,
		});

		setIsSelectingVideoCanvasPosition(true);
	};

	const onTouchMoveVideoCanvas = (e: React.TouchEvent<HTMLCanvasElement>) => {
		if (!isSelectingVideoCanvasPosition) return;

		const touch = e.touches[0];
		const position = adjustForCanvasScale(touch.clientX, touch.clientY);

		setSelectedVideoCanvasPosition((prevSelection) => ({
			...prevSelection,
			to: position,
		}));
	};

	const onMouseMoveVideoCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isSelectingVideoCanvasPosition) return;

		const position = adjustForCanvasScale(e.clientX, e.clientY);

		setSelectedVideoCanvasPosition((prevSelection) => ({
			...prevSelection,
			to: position,
		}));
	};

	const onTouchEndVideoCanvas = () => {
		document.body.style.overflow = "auto";
		document.removeEventListener("touchmove", scrollNo);
		setIsSelectingVideoCanvasPosition(false);
	};

	const onMouseUpVideoCanvas = () => {
		document.body.style.overflow = "auto";
		document.removeEventListener("touchmove", scrollNo);
		setIsSelectingVideoCanvasPosition(false);
	};

	const onClickSelectedCardButton = async () => {
		if (!generalCardImageDescriptorDB) return;

		if (!refSelectedCardCanvas.current) return;
		const selectedCardCanvas = refSelectedCardCanvas.current;
		const selectedCardCanvasContext = selectedCardCanvas.getContext("2d", {
			willReadFrequently: true,
		});
		if (!selectedCardCanvasContext) return;

		if (!refVideoCanvas.current) return;
		const videoCanvas = refVideoCanvas.current;
		const videoCanvasContext = videoCanvas.getContext("2d", {
			willReadFrequently: true,
		});
		if (!videoCanvasContext) return;

		// 矩形選択の箇所を取得
		const { from, to } = selectedVideoCanvasPosition;
		const width = from.x < to.x ? to.x - from.x : from.x - to.x;
		const height = from.y < to.y ? to.y - from.y : from.y - to.y;
		const x = from.x < to.x ? from.x : to.x;
		const y = from.y < to.y ? from.y : to.y;
		selectedCardCanvas.width = width;
		selectedCardCanvas.height = height;
		selectedCardCanvasContext.drawImage(
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

		const imageData = selectedCardCanvasContext.getImageData(
			0,
			0,
			selectedCardCanvas.width,
			selectedCardCanvas.height,
		);

		// ImageDataをOpenCVのMatに変換
		const selectedCardCanvasSRC = cv.matFromImageData(imageData);

		const dsize = new cv.Size(260, 413);
		const resized = new cv.Mat();
		cv.resize(selectedCardCanvasSRC, resized, dsize, 0, 0, cv.INTER_LINEAR);

		const orb = new cv.ORB();
		const keypoints = new cv.KeyPointVector();
		const descriptors = new cv.Mat();
		orb.detectAndCompute(resized, new cv.Mat(), keypoints, descriptors);

		// RGB情報も含めた特徴リストを作成
		const featuresWithColor = {
			r: [] as number[],
			g: [] as number[],
			b: [] as number[],
		};
		for (let i = 0; i < keypoints.size(); i++) {
			const kp = keypoints.get(i);

			// 特徴点の座標を整数に変換
			const x = Math.round(kp.pt.x);
			const y = Math.round(kp.pt.y);

			// RGB値の取得
			const color: number[] = selectedCardCanvasSRC.ucharPtr(y, x);
			const r = color[0];
			const g = color[1];
			const b = color[2];

			// 各特徴点に特徴ベクトルとRGB値を保存
			featuresWithColor.r.push(r);
			featuresWithColor.g.push(g);
			featuresWithColor.b.push(b);
		}

		const descriptor = new Float32Array([
			...createTargerSizeFloat32Array(
				400,
				new Float32Array(featuresWithColor.r),
			),
			...createTargerSizeFloat32Array(
				400,
				new Float32Array(featuresWithColor.g),
			),
			...createTargerSizeFloat32Array(
				400,
				new Float32Array(featuresWithColor.b),
			),
		]);

		selectedCardCanvasSRC.delete();
		resized.delete();
		keypoints.delete();
		descriptors.delete();
		orb.delete();

		const allSelect = await generalCardImageDescriptorDB
			.selectFrom("general_card_image_descriptors")
			.selectAll()
			.execute();

		const a = findMostSimilarDescriptor(allSelect, descriptor);

		alert(`${a.no}_${a.name}`);
	};

	return {
		generalCardImageDescriptorDB,
		onChangeDeviceSelect,
		devices,
		device,
		refVideo,
		refVideoCanvas,
		refMonoCanvas,
		refAutoCardCanvas,
		refSelectedCardCanvas,
		onTouchStartVideoCanvas,
		onTouchMoveVideoCanvas,
		onTouchEndVideoCanvas,
		onMouseDownVideoCanvas,
		onMouseMoveVideoCanvas,
		onMouseUpVideoCanvas,
		onClickSelectedCardButton,
	};
};
