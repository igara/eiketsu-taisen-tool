"use client";

import OpenCV from "@techstark/opencv-js";
import React from "react";

export const Camera: React.FC = () => {
	const refVideo = React.useRef<HTMLVideoElement>(null);
	const refRenderingCanvas = React.useRef<HTMLCanvasElement>(null);
	const refFoundCanvas = React.useRef<HTMLCanvasElement>(null);

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
				const enumerateDevices =
					await navigator.mediaDevices.enumerateDevices();
				setDevices(
					enumerateDevices.filter(
						(device) => device.kind === "videoinput" && device.label,
					),
				);
			} catch (_) {}
		};
		getDevices();
	}, []);

	React.useEffect(() => {
		if (!device) return;

		if (!refVideo) return;
		if (!refVideo.current) return;
		if (!refRenderingCanvas) return;
		if (!refRenderingCanvas.current) return;
		if (!refFoundCanvas) return;
		if (!refFoundCanvas.current) return;

		const video = refVideo.current;
		const renderingCanvas = refRenderingCanvas.current;
		const foundCanvas = refFoundCanvas.current;
		const offScreen = document.createElement("canvas");

		const renderingCtx = renderingCanvas.getContext("2d");
		if (!renderingCtx) return;
		const offscreenCtx = offScreen.getContext("2d");
		if (!offscreenCtx) return;

		const trimOriginalSize = document.createElement("canvas");
		const trimOriginalSizeCtx = trimOriginalSize.getContext("2d");
		if (!trimOriginalSizeCtx) return;
		const foundRectCtx = foundCanvas.getContext("2d");
		if (!foundRectCtx) return;

		const check = async () => {
			try {
				if (!window.navigator.mediaDevices.getUserMedia) return;

				const stream = await window.navigator.mediaDevices.getUserMedia({
					video: true,
				});
				video.srcObject = stream;

				video.onloadedmetadata = () => {
					video.play();
					renderingCanvas.width = offScreen.width = video.videoWidth;
					renderingCanvas.height = offScreen.height = video.videoHeight;

					foundCanvas.onclick = () => {
						const base64 = trimOriginalSize.toDataURL("image/jpeg");
						navigator.clipboard.writeText(base64);
						alert(base64);
					};

					const trimFromVideo = (
						x: number,
						y: number,
						width: number,
						height: number,
					) => {
						trimOriginalSize.width = width;
						trimOriginalSize.height = height;
						trimOriginalSizeCtx.drawImage(
							offScreen,
							x,
							y,
							width,
							height,
							0,
							0,
							width,
							height,
						);

						foundRectCtx.drawImage(
							offScreen,
							x,
							y,
							width,
							height,
							0,
							0,
							foundCanvas.width,
							foundCanvas.height,
						);
					};

					const tick = () => {
						try {
							offscreenCtx.drawImage(video, 0, 0);
							const src = OpenCV.imread(offScreen);
							let dst = new OpenCV.Mat();
							OpenCV.cvtColor(src, dst, OpenCV.COLOR_RGBA2GRAY, 0);
							OpenCV.threshold(dst, dst, 0, 255, OpenCV.THRESH_OTSU);
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
							dst = OpenCV.Mat.zeros(src.rows, src.cols, OpenCV.CV_8UC3);
							for (let i = 0; i < contours.size(); i++) {
								const area = OpenCV.contourArea(contours.get(i), false);
								if (area > 15000) {
									const approx = new OpenCV.Mat();
									OpenCV.approxPolyDP(
										contours.get(i),
										approx,
										0.01 * OpenCV.arcLength(contours.get(i), true),
										true,
									);
									if (approx.size().width === 1 && approx.size().height === 4) {
										OpenCV.drawContours(
											dst,
											contours,
											i,
											new OpenCV.Scalar(255, 0, 0, 255),
											4,
											OpenCV.LINE_8,
											hierarchy,
											100,
										);
										const { x, y, width, height } = OpenCV.boundingRect(
											contours.get(i),
										);
										trimFromVideo(x, y, width, height);
									} else {
										OpenCV.drawContours(
											dst,
											contours,
											i,
											new OpenCV.Scalar(0, 255, 0, 255),
											1,
											OpenCV.LINE_8,
											hierarchy,
											100,
										);
									}
									approx.delete();
								}
							}

							OpenCV.imshow(renderingCanvas, dst);
							src.delete();
							dst.delete();
							hierarchy.delete();
							contours.delete();
						} catch (e) {
							console.error(e);
						} finally {
							window.requestAnimationFrame(tick);
						}
					};
					tick();
				};
			} catch (e) {
				console.error(e);
			}
		};
		check();
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
				<canvas ref={refRenderingCanvas} />
				<video muted autoPlay playsInline ref={refVideo} />
				<canvas ref={refFoundCanvas} />
			</div>
		</main>
	);
};

export default Camera;
