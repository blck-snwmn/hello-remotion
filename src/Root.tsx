import React from "react";
import { Composition, Folder } from "remotion";

// Compositions
import { BasicAnimation } from "./compositions/01-BasicAnimation";
import { TextAnimations } from "./compositions/02-TextAnimations";
import { Transitions } from "./compositions/03-Transitions";
import { MediaEmbed } from "./compositions/04-MediaEmbed";
import { AudioDemo } from "./compositions/05-Audio";
import { Charts } from "./compositions/06-Charts";
import { Showcase } from "./compositions/07-Showcase";

/**
 * Remotion サンプル集
 *
 * 各Compositionで1つのテクニックを学べる構成
 */
export const RemotionRoot: React.FC = () => {
	const fps = 30;

	return (
		<>
			<Folder name="Samples">
				{/* 01: 基本アニメーション */}
				<Composition
					id="01-BasicAnimation"
					component={BasicAnimation}
					durationInFrames={6 * fps} // 6秒
					fps={fps}
					width={1920}
					height={1080}
				/>

				{/* 02: テキストアニメーション */}
				<Composition
					id="02-TextAnimations"
					component={TextAnimations}
					durationInFrames={6 * fps} // 6秒
					fps={fps}
					width={1920}
					height={1080}
				/>

				{/* 03: トランジション */}
				<Composition
					id="03-Transitions"
					component={Transitions}
					durationInFrames={calculateTransitionsDuration(fps)}
					fps={fps}
					width={1920}
					height={1080}
				/>

				{/* 04: メディア埋め込み */}
				<Composition
					id="04-MediaEmbed"
					component={MediaEmbed}
					durationInFrames={10 * fps} // 10秒
					fps={fps}
					width={1920}
					height={1080}
				/>

				{/* 05: オーディオ */}
				<Composition
					id="05-Audio"
					component={AudioDemo}
					durationInFrames={8 * fps} // 8秒
					fps={fps}
					width={1920}
					height={1080}
				/>

				{/* 06: チャート */}
				<Composition
					id="06-Charts"
					component={Charts}
					durationInFrames={5 * fps} // 5秒
					fps={fps}
					width={1920}
					height={1080}
				/>
			</Folder>

			{/* 07: ショーケース（全テクニック組み合わせ） */}
			<Composition
				id="07-Showcase"
				component={Showcase}
				durationInFrames={calculateShowcaseDuration(fps)}
				fps={fps}
				width={1920}
				height={1080}
			/>
		</>
	);
};

/**
 * 03-Transitions の総時間を計算
 * 7シーン × 60フレーム - 6トランジション × 15フレーム
 */
function calculateTransitionsDuration(fps: number): number {
	const sceneDuration = 60;
	const transitionDuration = 15;
	const sceneCount = 7;
	const transitionCount = 6;

	return sceneDuration * sceneCount - transitionDuration * transitionCount;
}

/**
 * 07-Showcase の総時間を計算
 * イントロ(90) + 6つのFeature(120x6) + Stats(150) + エンディング(90) - トランジション(20x8)
 */
function calculateShowcaseDuration(fps: number): number {
	const transitionDuration = 20;
	const scenes = [90, 120, 120, 120, 120, 120, 120, 150, 90]; // 各シーンのフレーム数
	const transitionCount = scenes.length - 1;

	const totalSceneFrames = scenes.reduce((sum, d) => sum + d, 0);
	return totalSceneFrames - transitionDuration * transitionCount;
}
