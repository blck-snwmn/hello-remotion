import React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

/**
 * 02-TextAnimations
 *
 * 学べること:
 * - タイプライターエフェクト（文字列スライス）
 * - ワードごとのフェードイン
 * - ハイライトアニメーション
 * - カーソル点滅
 */
export const TextAnimations: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#0d1117",
				fontFamily: "Arial, sans-serif",
				padding: 80,
			}}
		>
			{/* タイトル */}
			<div
				style={{
					fontSize: 48,
					fontWeight: "bold",
					color: "#fff",
					marginBottom: 60,
				}}
			>
				02 - Text Animations
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 60,
				}}
			>
				{/* 1. タイプライター */}
				<Section label="Typewriter Effect">
					<Typewriter
						text="Hello, Remotion! 動画を作ろう"
						startFrame={0}
						fps={fps}
					/>
				</Section>

				{/* 2. ワードごとのフェードイン */}
				<Section label="Word by Word Fade In">
					<WordByWordFadeIn
						text="Each word fades in separately"
						startFrame={30}
						fps={fps}
					/>
				</Section>

				{/* 3. ハイライトアニメーション */}
				<Section label="Highlight Animation">
					<HighlightText
						text="This is "
						highlightedText="important"
						suffix=" information."
						startFrame={60}
						fps={fps}
					/>
				</Section>

				{/* 4. 文字ごとのスプリング */}
				<Section label="Character Spring">
					<CharacterSpring text="SPRING!" startFrame={90} fps={fps} />
				</Section>
			</div>
		</AbsoluteFill>
	);
};

// セクションコンポーネント
const Section: React.FC<{ label: string; children: React.ReactNode }> = ({
	label,
	children,
}) => {
	return (
		<div>
			<div
				style={{
					fontSize: 18,
					color: "#8b949e",
					marginBottom: 15,
				}}
			>
				{label}
			</div>
			{children}
		</div>
	);
};

// タイプライターエフェクト
const Typewriter: React.FC<{
	text: string;
	startFrame: number;
	fps: number;
}> = ({ text, startFrame, fps }) => {
	const frame = useCurrentFrame();
	const relativeFrame = Math.max(0, frame - startFrame);

	// 1文字あたり3フレーム
	const charsPerFrame = 3;
	const visibleChars = Math.floor(relativeFrame / charsPerFrame);
	const displayText = text.slice(0, visibleChars);

	// カーソル点滅（0.5秒ごと）
	const cursorVisible = Math.floor((frame / (fps * 0.5)) % 2) === 0;

	return (
		<div
			style={{
				fontSize: 40,
				color: "#58a6ff",
				fontFamily: "monospace",
			}}
		>
			{displayText}
			<span
				style={{
					opacity: cursorVisible ? 1 : 0,
					marginLeft: 2,
				}}
			>
				|
			</span>
		</div>
	);
};

// ワードごとのフェードイン
const WordByWordFadeIn: React.FC<{
	text: string;
	startFrame: number;
	fps: number;
}> = ({ text, startFrame, fps }) => {
	const frame = useCurrentFrame();
	const words = text.split(" ");
	const delayPerWord = 8;

	return (
		<div
			style={{
				fontSize: 36,
				color: "#fff",
				display: "flex",
				gap: 12,
				flexWrap: "wrap",
			}}
		>
			{words.map((word, index) => {
				const wordStart = startFrame + index * delayPerWord;
				const opacity = interpolate(frame, [wordStart, wordStart + 10], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				const translateY = interpolate(
					frame,
					[wordStart, wordStart + 10],
					[20, 0],
					{
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
					}
				);

				return (
					<span
						key={index}
						style={{
							opacity,
							transform: `translateY(${translateY}px)`,
							display: "inline-block",
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};

// ハイライトアニメーション
const HighlightText: React.FC<{
	text: string;
	highlightedText: string;
	suffix: string;
	startFrame: number;
	fps: number;
}> = ({ text, highlightedText, suffix, startFrame, fps }) => {
	const frame = useCurrentFrame();
	const relativeFrame = Math.max(0, frame - startFrame);

	// ハイライトの幅を0%→100%にアニメーション
	const highlightProgress = interpolate(relativeFrame, [0, 20], [0, 100], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				fontSize: 36,
				color: "#fff",
			}}
		>
			{text}
			<span
				style={{
					position: "relative",
					display: "inline-block",
				}}
			>
				{/* ハイライト背景 */}
				<span
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						height: "40%",
						width: `${highlightProgress}%`,
						backgroundColor: "#f7df1e",
						zIndex: -1,
					}}
				/>
				<span style={{ fontWeight: "bold" }}>{highlightedText}</span>
			</span>
			{suffix}
		</div>
	);
};

// 文字ごとのスプリングアニメーション
const CharacterSpring: React.FC<{
	text: string;
	startFrame: number;
	fps: number;
}> = ({ text, startFrame, fps }) => {
	const frame = useCurrentFrame();
	const characters = text.split("");
	const delayPerChar = 4;

	return (
		<div
			style={{
				fontSize: 60,
				fontWeight: "bold",
				display: "flex",
			}}
		>
			{characters.map((char, index) => {
				const charStart = startFrame + index * delayPerChar;
				const scale = spring({
					frame: frame - charStart,
					fps,
					config: { damping: 8, stiffness: 200 },
				});

				const colors = [
					"#ff6b6b",
					"#feca57",
					"#48dbfb",
					"#1dd1a1",
					"#5f27cd",
					"#ff9ff3",
					"#54a0ff",
				];
				const color = colors[index % colors.length];

				return (
					<span
						key={index}
						style={{
							display: "inline-block",
							transform: `scale(${scale})`,
							color,
						}}
					>
						{char}
					</span>
				);
			})}
		</div>
	);
};
