import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";

/**
 * 03-Transitions
 *
 * 学べること:
 * - TransitionSeries でシーン遷移
 * - fade, slide, wipe, flip
 * - linearTiming でタイミング制御
 */
export const Transitions: React.FC = () => {
	const sceneDuration = 60; // 2秒
	const transitionDuration = 15; // 0.5秒

	return (
		<AbsoluteFill>
			<TransitionSeries>
				{/* シーン1: Fade */}
				<TransitionSeries.Sequence durationInFrames={sceneDuration}>
					<Scene
						title="Scene 1"
						subtitle="Next: Fade Transition"
						bgColor="#e94560"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({ durationInFrames: transitionDuration })}
				/>

				{/* シーン2: Slide from Right */}
				<TransitionSeries.Sequence durationInFrames={sceneDuration}>
					<Scene
						title="Scene 2"
						subtitle="Next: Slide from Right"
						bgColor="#0f3460"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={slide({ direction: "from-right" })}
					timing={linearTiming({ durationInFrames: transitionDuration })}
				/>

				{/* シーン3: Slide from Bottom */}
				<TransitionSeries.Sequence durationInFrames={sceneDuration}>
					<Scene
						title="Scene 3"
						subtitle="Next: Slide from Bottom"
						bgColor="#16c79a"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={slide({ direction: "from-bottom" })}
					timing={linearTiming({ durationInFrames: transitionDuration })}
				/>

				{/* シーン4: Wipe */}
				<TransitionSeries.Sequence durationInFrames={sceneDuration}>
					<Scene
						title="Scene 4"
						subtitle="Next: Wipe Transition"
						bgColor="#f9ed69"
						textColor="#333"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={wipe({ direction: "from-left" })}
					timing={linearTiming({ durationInFrames: transitionDuration })}
				/>

				{/* シーン5: Flip */}
				<TransitionSeries.Sequence durationInFrames={sceneDuration}>
					<Scene
						title="Scene 5"
						subtitle="Next: Flip Transition"
						bgColor="#b83b5e"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={flip({ direction: "from-left" })}
					timing={linearTiming({ durationInFrames: transitionDuration })}
				/>

				{/* シーン6: Wipe from Top */}
				<TransitionSeries.Sequence durationInFrames={sceneDuration}>
					<Scene
						title="Scene 6"
						subtitle="Next: Wipe from Top"
						bgColor="#6a2c70"
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={wipe({ direction: "from-top" })}
					timing={linearTiming({ durationInFrames: transitionDuration })}
				/>

				{/* 最終シーン */}
				<TransitionSeries.Sequence durationInFrames={sceneDuration}>
					<Scene
						title="The End"
						subtitle="All Transitions Complete!"
						bgColor="#1a1a2e"
					/>
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};

// シーンコンポーネント
const Scene: React.FC<{
	title: string;
	subtitle: string;
	bgColor: string;
	textColor?: string;
}> = ({ title, subtitle, bgColor, textColor = "#fff" }) => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: bgColor,
				justifyContent: "center",
				alignItems: "center",
				fontFamily: "Arial, sans-serif",
			}}
		>
			<div
				style={{
					textAlign: "center",
				}}
			>
				<div
					style={{
						fontSize: 80,
						fontWeight: "bold",
						color: textColor,
						marginBottom: 20,
					}}
				>
					{title}
				</div>
				<div
					style={{
						fontSize: 32,
						color: textColor,
						opacity: 0.8,
					}}
				>
					{subtitle}
				</div>
			</div>

			{/* 03-Transitions ラベル */}
			<div
				style={{
					position: "absolute",
					top: 40,
					left: 40,
					fontSize: 24,
					color: textColor,
					opacity: 0.6,
				}}
			>
				03 - Transitions
			</div>
		</AbsoluteFill>
	);
};
