import React from "react";
import {
	AbsoluteFill,
	Img,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";

/**
 * 04-MediaEmbed
 *
 * 学べること:
 * - <Img> で画像埋め込み
 * - <Video> で動画埋め込み
 * - staticFile() でローカルファイル参照
 * - リモートURLの使用
 * - サイズ・位置の制御
 *
 * NOTE: ローカルファイルを使う場合は public/ フォルダに配置して
 * staticFile("filename.png") で参照する
 */

// サンプル画像URL（実際のプロジェクトではstaticFileを使う）
const SAMPLE_IMAGES: string[] = [
	"https://picsum.photos/seed/remotion1/400/300",
	"https://picsum.photos/seed/remotion2/400/300",
	"https://picsum.photos/seed/remotion3/400/300",
];

// サンプル動画URL（パブリックドメインの動画）
const SAMPLE_VIDEO =
	"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const MediaEmbed: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#1a1a2e",
				fontFamily: "Arial, sans-serif",
			}}
		>
			{/* タイトル */}
			<div
				style={{
					position: "absolute",
					top: 40,
					left: 60,
					fontSize: 48,
					fontWeight: "bold",
					color: "#fff",
				}}
			>
				04 - Media Embed
			</div>

			{/* セクション1: 画像の基本 */}
			<Sequence from={0} durationInFrames={90}>
				<ImageBasicDemo />
			</Sequence>

			{/* セクション2: 画像アニメーション */}
			<Sequence from={90} durationInFrames={90}>
				<ImageAnimationDemo />
			</Sequence>

			{/* セクション3: 動画埋め込み */}
			<Sequence from={180}>
				<VideoDemo />
			</Sequence>
		</AbsoluteFill>
	);
};

// 画像基本デモ
const ImageBasicDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const opacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: "center",
				alignItems: "center",
				opacity,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 30,
				}}
			>
				<div style={{ fontSize: 32, color: "#fff", marginBottom: 20 }}>
					Basic Image Embed
				</div>

				<div style={{ display: "flex", gap: 30 }}>
					{SAMPLE_IMAGES.map((url, index) => {
						const delay = index * 10;
						const scale = spring({
							frame: frame - delay,
							fps,
							config: { damping: 12 },
						});

						return (
							<div
								key={index}
								style={{
									transform: `scale(${scale})`,
									borderRadius: 15,
									overflow: "hidden",
									boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
								}}
							>
								<Img
									src={url}
									style={{
										width: 320,
										height: 240,
										objectFit: "cover",
									}}
								/>
							</div>
						);
					})}
				</div>

				<div style={{ fontSize: 18, color: "#888", marginTop: 20 }}>
					Use &lt;Img&gt; component, NOT native &lt;img&gt;
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 画像アニメーションデモ
const ImageAnimationDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const rotation = interpolate(frame, [0, 90], [0, 360], {
		extrapolateRight: "clamp",
	});

	const scale = interpolate(frame, [0, 45, 90], [0.5, 1.2, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
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
					gap: 30,
				}}
			>
				<div style={{ fontSize: 32, color: "#fff" }}>
					Animated Image
				</div>

				<div
					style={{
						transform: `rotate(${rotation}deg) scale(${scale})`,
						borderRadius: 20,
						overflow: "hidden",
						boxShadow: "0 10px 40px rgba(233, 69, 96, 0.4)",
					}}
				>
					<Img
						src={SAMPLE_IMAGES[0] as string}
						style={{
							width: 400,
							height: 300,
							objectFit: "cover",
						}}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 動画デモ
const VideoDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const opacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: "clamp",
	});

	const scale = spring({
		frame,
		fps,
		config: { damping: 200 },
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: "center",
				alignItems: "center",
				opacity,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 30,
				}}
			>
				<div style={{ fontSize: 32, color: "#fff" }}>
					Video Embed
				</div>

				<div
					style={{
						transform: `scale(${scale})`,
						borderRadius: 15,
						overflow: "hidden",
						boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
					}}
				>
					<Video
						src={SAMPLE_VIDEO}
						style={{
							width: 640,
							height: 360,
							objectFit: "cover",
						}}
						volume={0}
					/>
				</div>

				<div style={{ fontSize: 18, color: "#888" }}>
					Video starts automatically, synced with timeline
				</div>
			</div>
		</AbsoluteFill>
	);
};
