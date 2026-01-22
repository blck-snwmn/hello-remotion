import React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

/**
 * 06-Charts
 *
 * 学べること:
 * - 棒グラフのアニメーション
 * - 円グラフのアニメーション（SVG stroke-dashoffset）
 * - スタガー（遅延）アニメーション
 * - データビジュアライゼーション
 */

// サンプルデータ
const BAR_DATA = [
	{ label: "React", value: 85, color: "#61dafb" },
	{ label: "Vue", value: 70, color: "#42b883" },
	{ label: "Angular", value: 55, color: "#dd0031" },
	{ label: "Svelte", value: 45, color: "#ff3e00" },
	{ label: "Solid", value: 30, color: "#446b9e" },
];

const PIE_DATA = [
	{ label: "Desktop", value: 55, color: "#e94560" },
	{ label: "Mobile", value: 35, color: "#0f3460" },
	{ label: "Tablet", value: 10, color: "#16c79a" },
];

export const Charts: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#1a1a2e",
				fontFamily: "Arial, sans-serif",
				padding: 60,
			}}
		>
			{/* タイトル */}
			<div
				style={{
					fontSize: 48,
					fontWeight: "bold",
					color: "#fff",
					marginBottom: 40,
					opacity: titleOpacity,
				}}
			>
				06 - Charts
			</div>

			<div
				style={{
					display: "flex",
					gap: 80,
					justifyContent: "center",
					alignItems: "flex-start",
				}}
			>
				{/* 棒グラフ */}
				<div style={{ flex: 1 }}>
					<div
						style={{
							fontSize: 28,
							color: "#fff",
							marginBottom: 30,
							opacity: titleOpacity,
						}}
					>
						Bar Chart (Staggered)
					</div>
					<BarChart data={BAR_DATA} startFrame={15} />
				</div>

				{/* 円グラフ */}
				<div style={{ flex: 1 }}>
					<div
						style={{
							fontSize: 28,
							color: "#fff",
							marginBottom: 30,
							opacity: titleOpacity,
						}}
					>
						Pie Chart (SVG)
					</div>
					<PieChart data={PIE_DATA} startFrame={60} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

// 棒グラフコンポーネント
const BarChart: React.FC<{
	data: typeof BAR_DATA;
	startFrame: number;
}> = ({ data, startFrame }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const maxValue = Math.max(...data.map((d) => d.value));
	const STAGGER_DELAY = 8;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 20,
			}}
		>
			{data.map((item, index) => {
				const delay = startFrame + index * STAGGER_DELAY;
				const progress = spring({
					frame: frame - delay,
					fps,
					config: { damping: 200 },
				});

				const barWidth = (item.value / maxValue) * 100 * progress;

				return (
					<div
						key={item.label}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 15,
						}}
					>
						{/* ラベル */}
						<div
							style={{
								width: 80,
								fontSize: 18,
								color: "#ccc",
								textAlign: "right",
							}}
						>
							{item.label}
						</div>

						{/* バー */}
						<div
							style={{
								flex: 1,
								height: 40,
								backgroundColor: "rgba(255,255,255,0.1)",
								borderRadius: 8,
								overflow: "hidden",
							}}
						>
							<div
								style={{
									width: `${barWidth}%`,
									height: "100%",
									backgroundColor: item.color,
									borderRadius: 8,
									display: "flex",
									alignItems: "center",
									justifyContent: "flex-end",
									paddingRight: 10,
								}}
							>
								{progress > 0.5 && (
									<span
										style={{
											fontSize: 16,
											fontWeight: "bold",
											color: "#fff",
										}}
									>
										{item.value}%
									</span>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

// 円グラフコンポーネント
const PieChart: React.FC<{
	data: typeof PIE_DATA;
	startFrame: number;
}> = ({ data, startFrame }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const size = 300;
	const center = size / 2;
	const radius = 100;
	const strokeWidth = 40;

	const total = data.reduce((sum, d) => sum + d.value, 0);

	// 全体のアニメーション進捗
	const progress = interpolate(frame - startFrame, [0, 60], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const circumference = 2 * Math.PI * radius;
	let accumulatedOffset = 0;

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 40,
			}}
		>
			{/* SVG円グラフ */}
			<svg width={size} height={size}>
				{data.map((item, index) => {
					const segmentLength = (item.value / total) * circumference;
					const currentOffset = accumulatedOffset;
					accumulatedOffset += segmentLength;

					// アニメーション
					const animatedLength = segmentLength * progress;
					const dashOffset = segmentLength - animatedLength;

					return (
						<circle
							key={item.label}
							r={radius}
							cx={center}
							cy={center}
							fill="none"
							stroke={item.color}
							strokeWidth={strokeWidth}
							strokeDasharray={`${segmentLength} ${circumference}`}
							strokeDashoffset={-currentOffset + dashOffset}
							transform={`rotate(-90 ${center} ${center})`}
							style={{
								opacity: progress > 0 ? 1 : 0,
							}}
						/>
					);
				})}

				{/* 中央のテキスト */}
				<text
					x={center}
					y={center}
					textAnchor="middle"
					dominantBaseline="middle"
					fill="#fff"
					fontSize={24}
					fontWeight="bold"
				>
					{Math.round(progress * 100)}%
				</text>
			</svg>

			{/* 凡例 */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 15,
				}}
			>
				{data.map((item, index) => {
					const legendOpacity = interpolate(
						frame - startFrame - 30 - index * 10,
						[0, 10],
						[0, 1],
						{
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						}
					);

					return (
						<div
							key={item.label}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
								opacity: legendOpacity,
							}}
						>
							<div
								style={{
									width: 20,
									height: 20,
									backgroundColor: item.color,
									borderRadius: 4,
								}}
							/>
							<div style={{ color: "#fff", fontSize: 18 }}>
								{item.label}: {item.value}%
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
