import React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

/**
 * 07-Showcase
 *
 * 全テクニックを組み合わせた実践的なサンプル
 * - プレゼンテーション風の動画
 * - イントロ → コンテンツ → エンディング
 */

const TRANSITION_DURATION = 20;

export const Showcase: React.FC = () => {
	return (
		<AbsoluteFill>
			<TransitionSeries>
				{/* イントロ */}
				<TransitionSeries.Sequence durationInFrames={90}>
					<IntroScene />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
				/>

				{/* メインコンテンツ1: 機能紹介 */}
				<TransitionSeries.Sequence durationInFrames={120}>
					<FeatureScene
						number="01"
						title="🎬 Animation"
						description="interpolate, spring でスムーズなアニメーション"
						seeAlso="01-BasicAnimation"
						bgColor="#e94560"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={slide({ direction: "from-right" })}
					timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
				/>

				{/* メインコンテンツ2 */}
				<TransitionSeries.Sequence durationInFrames={120}>
					<FeatureScene
						number="02"
						title="✨ Text Effects"
						description="タイプライター、ワードハイライト"
						seeAlso="02-TextAnimations"
						bgColor="#0f3460"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={slide({ direction: "from-bottom" })}
					timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
				/>

				{/* メインコンテンツ3 */}
				<TransitionSeries.Sequence durationInFrames={120}>
					<FeatureScene
						number="03"
						title="🔀 Transitions"
						description="fade, slide, wipe, flip でシーン切り替え"
						seeAlso="03-Transitions"
						bgColor="#f39c12"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
				/>

				{/* メインコンテンツ4 */}
				<TransitionSeries.Sequence durationInFrames={120}>
					<FeatureScene
						number="04"
						title="🖼️ Media Embed"
						description="画像・動画の埋め込みとアニメーション"
						seeAlso="04-MediaEmbed"
						bgColor="#9b59b6"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={slide({ direction: "from-left" })}
					timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
				/>

				{/* メインコンテンツ5 */}
				<TransitionSeries.Sequence durationInFrames={120}>
					<FeatureScene
						number="05"
						title="🔊 Audio"
						description="BGM、効果音、ボリューム制御"
						seeAlso="05-Audio"
						bgColor="#3498db"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={slide({ direction: "from-right" })}
					timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
				/>

				{/* メインコンテンツ6 */}
				<TransitionSeries.Sequence durationInFrames={120}>
					<FeatureScene
						number="06"
						title="📊 Data Viz"
						description="棒グラフ、円グラフのアニメーション"
						seeAlso="06-Charts"
						bgColor="#16c79a"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
				/>

				{/* 統計シーン */}
				<TransitionSeries.Sequence durationInFrames={150}>
					<StatsScene />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
				/>

				{/* エンディング */}
				<TransitionSeries.Sequence durationInFrames={90}>
					<EndingScene />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};

// イントロシーン
const IntroScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titleScale = spring({
		frame,
		fps,
		config: { damping: 12 },
	});

	const subtitleOpacity = interpolate(frame, [30, 45], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#1a1a2e",
				justifyContent: "center",
				alignItems: "center",
				fontFamily: "Arial, sans-serif",
			}}
		>
			{/* 背景デコレーション */}
			<div
				style={{
					position: "absolute",
					width: 600,
					height: 600,
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(233,69,96,0.2) 0%, transparent 70%)",
				}}
			/>

			<div style={{ textAlign: "center", zIndex: 1 }}>
				<div
					style={{
						fontSize: 100,
						fontWeight: "bold",
						color: "#fff",
						transform: `scale(${titleScale})`,
						marginBottom: 20,
					}}
				>
					Remotion
				</div>
				<div
					style={{
						fontSize: 36,
						color: "#e94560",
						opacity: subtitleOpacity,
					}}
				>
					React で動画を作ろう
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 機能紹介シーン
const FeatureScene: React.FC<{
	number: string;
	title: string;
	description: string;
	seeAlso: string;
	bgColor: string;
}> = ({ number, title, description, seeAlso, bgColor }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titleY = interpolate(frame, [0, 20], [50, 0], {
		extrapolateRight: "clamp",
	});

	const descOpacity = interpolate(frame, [20, 35], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const seeAlsoOpacity = interpolate(frame, [40, 55], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// 装飾的なアニメーション
	const decorScale = spring({
		frame: frame - 10,
		fps,
		config: { damping: 8 },
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: bgColor,
				justifyContent: "center",
				alignItems: "center",
				fontFamily: "Arial, sans-serif",
			}}
		>
			{/* 番号表示 */}
			<div
				style={{
					position: "absolute",
					top: 40,
					left: 60,
					fontSize: 32,
					fontWeight: "bold",
					color: "rgba(255,255,255,0.4)",
				}}
			>
				#{number}
			</div>

			{/* 装飾 */}
			<div
				style={{
					position: "absolute",
					right: 100,
					top: "50%",
					transform: `translateY(-50%) scale(${decorScale})`,
					width: 200,
					height: 200,
					borderRadius: 30,
					backgroundColor: "rgba(255,255,255,0.1)",
				}}
			/>

			<div style={{ textAlign: "center", zIndex: 1 }}>
				<div
					style={{
						fontSize: 80,
						fontWeight: "bold",
						color: "#fff",
						transform: `translateY(${titleY}px)`,
						marginBottom: 30,
					}}
				>
					{title}
				</div>
				<div
					style={{
						fontSize: 32,
						color: "rgba(255,255,255,0.9)",
						opacity: descOpacity,
						marginBottom: 20,
					}}
				>
					{description}
				</div>
				<div
					style={{
						fontSize: 24,
						color: "rgba(255,255,255,0.6)",
						opacity: seeAlsoOpacity,
						padding: "10px 20px",
						backgroundColor: "rgba(0,0,0,0.2)",
						borderRadius: 10,
						display: "inline-block",
					}}
				>
					▶ See: {seeAlso}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 統計シーン
const StatsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const stats = [
		{ label: "Components", value: 7, suffix: "+" },
		{ label: "Animations", value: 15, suffix: "+" },
		{ label: "Transitions", value: 5, suffix: "" },
	];

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#0d1117",
				justifyContent: "center",
				alignItems: "center",
				fontFamily: "Arial, sans-serif",
			}}
		>
			<div
				style={{
					display: "flex",
					gap: 100,
				}}
			>
				{stats.map((stat, index) => {
					const delay = index * 15;
					const progress = spring({
						frame: frame - delay,
						fps,
						config: { damping: 200 },
					});

					const countValue = Math.round(stat.value * progress);

					return (
						<div
							key={stat.label}
							style={{
								textAlign: "center",
								opacity: progress,
								transform: `translateY(${(1 - progress) * 30}px)`,
							}}
						>
							<div
								style={{
									fontSize: 100,
									fontWeight: "bold",
									color: "#fff",
								}}
							>
								{countValue}
								{stat.suffix}
							</div>
							<div
								style={{
									fontSize: 28,
									color: "#888",
									marginTop: 10,
								}}
							>
								{stat.label}
							</div>
						</div>
					);
				})}
			</div>

			{/* タイトル */}
			<div
				style={{
					position: "absolute",
					top: 80,
					fontSize: 48,
					color: "#fff",
					fontWeight: "bold",
				}}
			>
				What You've Learned
			</div>
		</AbsoluteFill>
	);
};

// エンディングシーン
const EndingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();

	const scale = spring({
		frame,
		fps,
		config: { damping: 12 },
	});

	const exitScale = spring({
		frame: frame - (durationInFrames - 30),
		fps,
		config: { damping: 200 },
	});

	const finalScale = scale - exitScale;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#1a1a2e",
				justifyContent: "center",
				alignItems: "center",
				fontFamily: "Arial, sans-serif",
			}}
		>
			{/* グラデーション背景 */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(circle at center, rgba(233,69,96,0.3) 0%, transparent 60%)",
				}}
			/>

			<div
				style={{
					textAlign: "center",
					transform: `scale(${Math.max(0, finalScale)})`,
				}}
			>
				<div
					style={{
						fontSize: 80,
						fontWeight: "bold",
						color: "#fff",
						marginBottom: 20,
					}}
				>
					Thank You!
				</div>
				<div
					style={{
						fontSize: 32,
						color: "#e94560",
					}}
				>
					Start creating with Remotion 🎬
				</div>
			</div>
		</AbsoluteFill>
	);
};
