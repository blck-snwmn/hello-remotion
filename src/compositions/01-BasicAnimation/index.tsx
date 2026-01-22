import React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from "remotion";

/**
 * 01-BasicAnimation
 *
 * 学べること:
 * - useCurrentFrame() でフレーム取得
 * - interpolate() で線形補間
 * - spring() で自然なアニメーション
 * - Easing でイージング
 */
export const BasicAnimation: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();

	// 1. 基本のフェードイン (interpolate)
	const fadeInOpacity = interpolate(frame, [0, 1 * fps], [0, 1], {
		extrapolateRight: "clamp",
	});

	// 2. イージング付きスライドイン
	const slideInX = interpolate(frame, [0.5 * fps, 1.5 * fps], [-200, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.quad),
	});

	// 3. Spring アニメーション（バウンス）
	const springScale = spring({
		frame: frame - 1 * fps,
		fps,
		config: { damping: 8 }, // バウンシー
	});

	// 4. スムーズなSpring（バウンスなし）
	const smoothSpring = spring({
		frame: frame - 2 * fps,
		fps,
		config: { damping: 200 }, // スムーズ
	});
	const smoothY = interpolate(smoothSpring, [0, 1], [50, 0]);

	// 5. 回転アニメーション
	const rotation = interpolate(frame, [2.5 * fps, 4 * fps], [0, 360], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.inOut(Easing.quad),
	});

	// 6. 組み合わせ: 入場 + 退場
	const exitSpring = spring({
		frame: frame - (durationInFrames - 1 * fps),
		fps,
		config: { damping: 200 },
	});
	const combinedScale = springScale - exitSpring;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#1a1a2e",
				justifyContent: "center",
				alignItems: "center",
				fontFamily: "Arial, sans-serif",
			}}
		>
			{/* タイトル */}
			<div
				style={{
					position: "absolute",
					top: 60,
					fontSize: 48,
					fontWeight: "bold",
					color: "#fff",
					opacity: fadeInOpacity,
				}}
			>
				01 - Basic Animation
			</div>

			{/* デモコンテナ */}
			<div
				style={{
					display: "flex",
					gap: 60,
					flexWrap: "wrap",
					justifyContent: "center",
					maxWidth: 1600,
				}}
			>
				{/* 1. フェードイン */}
				<DemoBox label="Fade In (interpolate)" opacity={fadeInOpacity}>
					<div
						style={{
							width: 80,
							height: 80,
							backgroundColor: "#e94560",
							borderRadius: 10,
							opacity: fadeInOpacity,
						}}
					/>
				</DemoBox>

				{/* 2. スライドイン */}
				<DemoBox label="Slide In (easing)" opacity={fadeInOpacity}>
					<div
						style={{
							width: 80,
							height: 80,
							backgroundColor: "#0f3460",
							borderRadius: 10,
							transform: `translateX(${slideInX}px)`,
						}}
					/>
				</DemoBox>

				{/* 3. Spring バウンス */}
				<DemoBox label="Spring (bouncy)" opacity={fadeInOpacity}>
					<div
						style={{
							width: 80,
							height: 80,
							backgroundColor: "#16c79a",
							borderRadius: 10,
							transform: `scale(${springScale})`,
						}}
					/>
				</DemoBox>

				{/* 4. スムーズSpring */}
				<DemoBox label="Spring (smooth)" opacity={fadeInOpacity}>
					<div
						style={{
							width: 80,
							height: 80,
							backgroundColor: "#f9ed69",
							borderRadius: 10,
							transform: `translateY(${smoothY}px)`,
							opacity: smoothSpring,
						}}
					/>
				</DemoBox>

				{/* 5. 回転 */}
				<DemoBox label="Rotation (easing)" opacity={fadeInOpacity}>
					<div
						style={{
							width: 80,
							height: 80,
							backgroundColor: "#b83b5e",
							borderRadius: 10,
							transform: `rotate(${rotation}deg)`,
						}}
					/>
				</DemoBox>

				{/* 6. 入場 + 退場 */}
				<DemoBox label="Enter + Exit" opacity={fadeInOpacity}>
					<div
						style={{
							width: 80,
							height: 80,
							backgroundColor: "#6a2c70",
							borderRadius: 10,
							transform: `scale(${Math.max(0, combinedScale)})`,
						}}
					/>
				</DemoBox>
			</div>

			{/* フレームカウンター */}
			<div
				style={{
					position: "absolute",
					bottom: 40,
					fontSize: 24,
					color: "#888",
				}}
			>
				Frame: {frame} / {durationInFrames} ({(frame / fps).toFixed(1)}s)
			</div>
		</AbsoluteFill>
	);
};

// デモボックスコンポーネント
const DemoBox: React.FC<{
	label: string;
	opacity: number;
	children: React.ReactNode;
}> = ({ label, opacity, children }) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 15,
				opacity,
			}}
		>
			<div
				style={{
					width: 180,
					height: 180,
					backgroundColor: "rgba(255,255,255,0.1)",
					borderRadius: 15,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					overflow: "hidden",
				}}
			>
				{children}
			</div>
			<div
				style={{
					fontSize: 16,
					color: "#ccc",
					textAlign: "center",
				}}
			>
				{label}
			</div>
		</div>
	);
};
