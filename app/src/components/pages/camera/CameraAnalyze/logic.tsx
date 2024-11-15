import { GeneralCardImageTFModelContext } from "@/context/tensorflow/GeneralCardImageTFModel";
import { pathInfo } from "@/lib/pathInfo";
import { type SearchFormData, SearchFormResolver } from "@/schema/SearchForm";
import { cardSize } from "@eiketsu-taisen-tool/data/card_tf_model";
import GeneralsJSON from "@eiketsu-taisen-tool/data/data/json/generals.json";
import type { General } from "@eiketsu-taisen-tool/data/types";
import * as tf from "@tensorflow/tfjs";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export const useLogic = () => {
	const { generalCardImageTFModel } = React.useContext(
		GeneralCardImageTFModelContext,
	);
	const refVideo = React.useRef<HTMLVideoElement>(null);
	const refVideoCanvas = React.useRef<HTMLCanvasElement>(null);
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

	type Card = {
		loading: boolean;
		general?: General;
	};
	const [selectedCard, setSelectedCard] = React.useState<Card>({
		loading: false,
	});

	const router = useRouter();
	const searchParams = useSearchParams();
	const defaultSearchFavoriteNos = searchParams.getAll(
		pathInfo["/camera"].searchParams["favoriteNo[]"],
	);

	const [selectedFavoriteGenerals, setSelectedFavoriteGenerals] =
		React.useState<General[]>(
			GeneralsJSON.filter((general) =>
				defaultSearchFavoriteNos.includes(general.no.toString()),
			),
		);

	const formMethod = useForm<SearchFormData>({
		resolver: SearchFormResolver,
		defaultValues: {
			color: [],
			period: [],
			appear: [],
			cost: [],
			unitType: [],
			skill: [],
			power: [],
			intelligentzia: [],
			stratCost: [],
			stratRange: [],
			searchWord: "",
			favoriteNo: defaultSearchFavoriteNos,
			isDisplayFavorite: undefined,
			isDisableSearchForm: undefined,
			isDisableOption: undefined,
		},
	});

	formMethod.register("favoriteNo", {
		onChange: (e) => {
			const favoriteNo = e.target.value;

			if (favoriteNo === "" || favoriteNo === "on") return;

			const checked: boolean = e.target.checked;
			const newURLSearchParams = new URLSearchParams(window.location.search);
			newURLSearchParams.delete(
				pathInfo["/camera"].searchParams["favoriteNo[]"],
			);
			if (checked) {
				if (!defaultSearchFavoriteNos.includes(favoriteNo)) {
					newURLSearchParams.append(
						pathInfo["/camera"].searchParams["favoriteNo[]"],
						favoriteNo,
					);
				}
			}
			for (const fn of defaultSearchFavoriteNos) {
				if (fn === favoriteNo && !checked) {
					continue;
				}
				newURLSearchParams.append(
					pathInfo["/camera"].searchParams["favoriteNo[]"],
					fn,
				);
			}

			setSelectedFavoriteGenerals(
				GeneralsJSON.filter((general) =>
					newURLSearchParams
						.getAll(pathInfo["/camera"].searchParams["favoriteNo[]"])
						.includes(general.no.toString()),
				),
			);

			router.push(`/camera?${newURLSearchParams.toString()}`, {
				scroll: false,
			});
		},
	});

	const onChangeDeviceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const deviceId = e.target.value;
		const selectedDevice = devices.find(
			(device) => device.deviceId === deviceId,
		);
		if (!selectedDevice) return;

		setDivice(selectedDevice);
	};

	React.useEffect(() => {
		if (!generalCardImageTFModel) return;

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
	}, [generalCardImageTFModel]);

	const detectAndResizeCard = () => {
		if (!generalCardImageTFModel) return;
		if (!isVideo) return;

		if (!refVideo.current) return;
		const video = refVideo.current;

		if (!refVideoCanvas.current) return;
		const videoCanvas = refVideoCanvas.current;
		const videoCanvasContext = videoCanvas.getContext("2d", {
			willReadFrequently: true,
		});
		if (!videoCanvasContext) return;

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

	const onTouchStartVideoCanvas: React.TouchEventHandler<HTMLCanvasElement> = (
		e,
	) => {
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

	const onMouseDownVideoCanvas: React.MouseEventHandler<HTMLCanvasElement> = (
		e,
	) => {
		const position = adjustForCanvasScale(e.clientX, e.clientY);
		document.addEventListener("touchmove", scrollNo, { passive: false });
		document.body.style.overflow = "hidden";

		setSelectedVideoCanvasPosition({
			from: position,
			to: position,
		});

		setIsSelectingVideoCanvasPosition(true);
	};

	const onTouchMoveVideoCanvas: React.TouchEventHandler<HTMLCanvasElement> = (
		e,
	) => {
		if (!isSelectingVideoCanvasPosition) return;

		const touch = e.touches[0];
		const position = adjustForCanvasScale(touch.clientX, touch.clientY);

		setSelectedVideoCanvasPosition((prevSelection) => ({
			...prevSelection,
			to: position,
		}));
	};

	const onMouseMoveVideoCanvas: React.MouseEventHandler<HTMLCanvasElement> = (
		e,
	) => {
		if (!isSelectingVideoCanvasPosition) return;

		const position = adjustForCanvasScale(e.clientX, e.clientY);

		setSelectedVideoCanvasPosition((prevSelection) => ({
			...prevSelection,
			to: position,
		}));
	};

	const onTouchEndVideoCanvas: React.TouchEventHandler<
		HTMLCanvasElement
	> = () => {
		document.body.style.overflow = "auto";
		document.removeEventListener("touchmove", scrollNo);
		setIsSelectingVideoCanvasPosition(false);
	};

	const onMouseUpVideoCanvas: React.MouseEventHandler<
		HTMLCanvasElement
	> = () => {
		document.body.style.overflow = "auto";
		document.removeEventListener("touchmove", scrollNo);
		setIsSelectingVideoCanvasPosition(false);
	};

	const onClickListButton: React.MouseEventHandler<
		HTMLButtonElement
	> = async () => {
		const favoritNos = formMethod.getValues("favoriteNo");
		if (!favoritNos || favoritNos.length === 0) return;

		const newURLSearchParams = new URLSearchParams(window.location.search);
		newURLSearchParams.append(
			pathInfo["/"].searchParams.isDisplayFavorite,
			"true",
		);

		const newWindow = window.open(
			`/eiketsu-taisen-tool/?${newURLSearchParams.toString()}`,
			"_blank",
		);
		if (newWindow) {
			newWindow.opener = null; // セキュリティを強化
		}
	};

	const onClickSelectedCardButton: React.MouseEventHandler<
		HTMLButtonElement
	> = async () => {
		if (!generalCardImageTFModel) return;

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

		if (width === 0 || height === 0) return;

		const imageData = selectedCardCanvasContext.getImageData(
			0,
			0,
			selectedCardCanvas.width,
			selectedCardCanvas.height,
		);

		setSelectedCard({
			loading: true,
			general: undefined,
		});

		await tf.setBackend("webgl");
		await tf.ready();

		tf.tidy(() => {
			const tensor = tf.browser
				.fromPixels(imageData)
				.resizeNearestNeighbor([cardSize.width, cardSize.height]) // モデルに合わせてリサイズ
				.toFloat()
				.div(tf.scalar(255.0))
				.expandDims(0);

			const prediction = generalCardImageTFModel.predict(tensor);
			// @ts-ignore
			const maxIndex = (prediction.argMax(-1) as tf.Tensor).dataSync()[0];

			const general = GeneralsJSON[maxIndex];

			setSelectedCard({
				loading: false,
				general,
			});
		});
	};

	const selectedFavoriteGeneralInfo = selectedFavoriteGenerals.reduce(
		(acc, general) => {
			return {
				cost: acc.cost + +general.cost,
				power: acc.power + +general.power,
				intelligentzia: acc.intelligentzia + +general.intelligentzia,
			};
		},
		{
			cost: 0,
			power: 0,
			intelligentzia: 0,
		},
	);

	return {
		generalCardImageTFModel,
		onChangeDeviceSelect,
		devices,
		device,
		refVideo,
		refVideoCanvas,
		refSelectedCardCanvas,
		selectedCard,
		onTouchStartVideoCanvas,
		onTouchMoveVideoCanvas,
		onTouchEndVideoCanvas,
		onMouseDownVideoCanvas,
		onMouseMoveVideoCanvas,
		onMouseUpVideoCanvas,
		onClickListButton,
		onClickSelectedCardButton,
		formMethod,
		defaultSearchFavoriteNos,
		selectedFavoriteGenerals,
		selectedFavoriteGeneralInfo,
	};
};
