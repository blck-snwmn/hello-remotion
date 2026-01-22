import React from "react";
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";

/**
 * 05-Audio
 *
 * 学べること:
 * - <Audio> で音声追加
 * - volume でボリューム制御
 * - Sequence で遅延再生
 * - フェードイン/アウト
 *
 * NOTE: 実際のプロジェクトでは public/ フォルダに音声ファイルを配置し
 * staticFile("audio.mp3") で参照する
 */

// サンプル音声URL（パブリックドメイン）
const SAMPLE_AUDIO =
	"https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg";

export const AudioDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();

	// ボリュームのフェードイン/アウト計算
	const fadeInEnd = 1 * fps;
	const fadeOutStart = durationInFrames - 1 * fps;

	const volume = (f: number) => {
		// フェードイン
		if (f < fadeInEnd) {
			return interpolate(f, [0, fadeInEnd], [0, 0.5], {
				extrapolateRight: "clamp",
			});
		}
		// フェードアウト
		if (f > fadeOutStart) {
			return interpolate(f, [fadeOutStart, durationInFrames], [0.5, 0], {
				extrapolateLeft: "clamp",
			});
		}
		return 0.5;
	};

	// 現在のボリューム（視覚化用）
	const currentVolume = volume(frame);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#0d1117",
				fontFamily: "Arial, sans-serif",
			}}
		>
			{/* BGM */}
			<Audio src={SAMPLE_AUDIO} volume={volume} loop />

			{/* タイトル */}
			<div
				style={{
					position: "absolute",
					top: 60,
					left: 60,
					fontSize: 48,
					fontWeight: "bold",
					color: "#fff",
				}}
			>
				05 - Audio
			</div>

			{/* メインコンテンツ */}
			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 60,
					}}
				>
					{/* オーディオビジュアライザー風 */}
					<AudioVisualizer volume={currentVolume} />

					{/* ボリューム情報 */}
					<VolumeDisplay
						volume={currentVolume}
						frame={frame}
						fps={fps}
						durationInFrames={durationInFrames}
					/>

					{/* 説明 */}
					<InfoPanel frame={frame} fps={fps} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// オーディオビジュアライザー風コンポーネント
const AudioVisualizer: React.FC<{ volume: number }> = ({ volume }) => {
	const frame = useCurrentFrame();
	const bars = 12;

	return (
		<div
			style={{
				display: "flex",
				alignItems: "flex-end",
				gap: 8,
				height: 200,
			}}
		>
			{Array.from({ length: bars }).map((_, index) => {
				// 疑似ランダムな高さ（フレームベース）
				const seed = (frame * 7 + index * 13) % 100;
				const randomHeight = 0.3 + (seed / 100) * 0.7;
				const height = volume * randomHeight * 200;

				const colors = [
					"#ff6b6b",
					"#feca57",
					"#48dbfb",
					"#1dd1a1",
					"#5f27cd",
					"#ff9ff3",
				];
				const color = colors[index % colors.length];

				return (
					<div
						key={index}
						style={{
							width: 24,
							height: Math.max(10, height),
							backgroundColor: color,
							borderRadius: 4,
							transition: "none", // CSSトランジションは禁止
						}}
					/>
				);
			})}
		</div>
	);
};

// ボリューム表示コンポーネント
const VolumeDisplay: React.FC<{
	volume: number;
	frame: number;
	fps: number;
	durationInFrames: number;
}> = ({ volume, frame, fps, durationInFrames }) => {
	const percentage = Math.round(volume * 100);
	const currentTime = (frame / fps).toFixed(1);
	const totalTime = (durationInFrames / fps).toFixed(1);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 20,
			}}
		>
			{/* ボリュームバー */}
			<div
				style={{
					width: 400,
					height: 20,
					backgroundColor: "#333",
					borderRadius: 10,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width: `${percentage * 2}%`, // 50%が最大なので2倍
						height: "100%",
						backgroundColor: "#1dd1a1",
						borderRadius: 10,
					}}
				/>
			</div>

			{/* ボリューム数値 */}
			<div style={{ fontSize: 24, color: "#fff" }}>
				Volume: {percentage}%
			</div>

			{/* タイムライン */}
			<div style={{ fontSize: 18, color: "#888" }}>
				{currentTime}s / {totalTime}s
			</div>
		</div>
	);
};

// 情報パネル
const InfoPanel: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const fadeInOpacity = interpolate(frame, [30, 45], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const features = [
		"🎵 Fade In: 0-1s",
		"🔊 Sustain: 1s - (end-1s)",
		"🔉 Fade Out: last 1s",
		"🔁 Loop: enabled",
	];

	return (
		<div
			style={{
				opacity: fadeInOpacity,
				display: "flex",
				gap: 30,
				padding: "20px 40px",
				backgroundColor: "rgba(255,255,255,0.05)",
				borderRadius: 15,
			}}
		>
			{features.map((feature, index) => (
				<div
					key={index}
					style={{
						fontSize: 18,
						color: "#ccc",
					}}
				>
					{feature}
				</div>
			))}
		</div>
	);
};
