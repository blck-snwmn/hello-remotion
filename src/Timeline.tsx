import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { fontFamily } from './fonts';

interface Task {
	time: string;
	label: string;
}

interface VideoSettings {
	startHour: string;
	secPerHour: number;
}

export interface TimelineProps {
	date: string;
	videoSettings: VideoSettings;
	tasks: Task[];
	[key: string]: unknown;
}

const parseTime = (timeStr: string): number => {
	const parts = timeStr.split(':').map(Number);
	const hours = parts[0] ?? 0;
	const minutes = parts[1] ?? 0;
	return hours * 60 + minutes;
};

export const Timeline: React.FC<TimelineProps> = ({
	date,
	videoSettings,
	tasks,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const startTime = parseTime(videoSettings.startHour);
	const framesPerMinute = (videoSettings.secPerHour * fps) / 60;

	// Maximum tasks in one column
	const MAX_TASKS_PER_COLUMN = 9;
	const useMultiColumn = tasks.length > MAX_TASKS_PER_COLUMN;

	const renderTask = (task: Task, index: number) => {
		const taskTime = parseTime(task.time);
		const minuteDiff = taskTime - startTime;
		const appearFrame = minuteDiff * framesPerMinute;

		// Calculate next task's appear frame for progress animation
		const nextTask = tasks[index + 1];
		const nextAppearFrame = nextTask
			? parseTime(nextTask.time) * framesPerMinute - startTime * framesPerMinute
			: appearFrame + 120; // If last task, show progress for 4 seconds (120 frames at 30fps)

		const opacity = interpolate(
			frame - appearFrame,
			[0, 10],
			[0, 1],
			{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
		);

		const translateX = interpolate(
			frame - appearFrame,
			[0, 10],
			[-20, 0],
			{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
		);

		// Progress from 0% to 100% between current and next task appearance
		const progress = interpolate(
			frame,
			[appearFrame, nextAppearFrame],
			[0, 100],
			{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
		);

		return (
			<div
				key={index}
				style={{
					opacity,
					transform: `translateX(${translateX}px)`,
					display: 'flex',
					alignItems: 'center',
					gap: 15,
					fontSize: useMultiColumn ? 32 : 40,
					marginBottom: 0,
				}}
			>
				<div
					style={{
						fontWeight: 'bold',
						minWidth: useMultiColumn ? 120 : 150,
						color: '#555',
					}}
				>
					{task.time}
				</div>
				<div
					style={{
						padding: useMultiColumn ? '8px 16px' : '10px 20px',
						background: `linear-gradient(to right, #80deea 0%, #80deea ${progress}%, #e0f7fa ${progress}%, #e0f7fa 100%)`,
						borderRadius: 10,
						boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
					}}
				>
					{task.label}
				</div>
			</div>
		);
	};

	// Calculate "終わり" element appearance frame
	const lastTask = tasks[tasks.length - 1];
	const lastTaskTime = lastTask ? parseTime(lastTask.time) : 0;
	const lastMinuteDiff = lastTaskTime - startTime;
	const lastAppearFrame = lastMinuteDiff * framesPerMinute;
	const endingAppearFrame = lastAppearFrame + 120; // After last task's progress completes
	const endingProgressDuration = 90; // 3 seconds at 30fps
	const endingProgressEndFrame = endingAppearFrame + endingProgressDuration;

	const renderEndingElement = () => {
		const opacity = interpolate(
			frame - endingAppearFrame,
			[0, 10],
			[0, 1],
			{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
		);

		const translateX = interpolate(
			frame - endingAppearFrame,
			[0, 10],
			[-20, 0],
			{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
		);

		// Progress from 0% to 100% over endingProgressDuration frames
		const progress = interpolate(
			frame,
			[endingAppearFrame, endingProgressEndFrame],
			[0, 100],
			{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
		);

		return (
			<div
				style={{
					opacity,
					transform: `translateX(${translateX}px)`,
					display: 'flex',
					alignItems: 'center',
					gap: 15,
					fontSize: useMultiColumn ? 32 : 40,
					marginBottom: 0,
				}}
			>
				<div
					style={{
						fontWeight: 'bold',
						minWidth: useMultiColumn ? 120 : 150,
						color: '#555',
					}}
				>

				</div>
				<div
					style={{
						padding: useMultiColumn ? '8px 16px' : '10px 20px',
						background: `linear-gradient(to right, #9c27b0 0%, #9c27b0 ${progress}%, #f3e5f5 ${progress}%, #f3e5f5 100%)`,
						borderRadius: 10,
						boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
					}}
				>
					終わり
				</div>
			</div>
		);
	};

	return (
		<AbsoluteFill style={{
			backgroundColor: 'white',
			padding: 40,
			fontFamily
		}}>
			{/* Overall progress bar */}
			{(() => {
				const firstTask = tasks[0];
				const lastTask = tasks[tasks.length - 1];
				if (!firstTask || !lastTask) return null;

				const firstTaskTime = parseTime(firstTask.time);
				const firstMinuteDiff = firstTaskTime - startTime;
				const firstAppearFrame = firstMinuteDiff * framesPerMinute;

				const lastTaskTime = parseTime(lastTask.time);
				const lastMinuteDiff = lastTaskTime - startTime;
				const lastAppearFrame = lastMinuteDiff * framesPerMinute;
				const progressEndFrame = endingProgressEndFrame;

				// Calculate progress percentages for two-color progress bar
				const totalDuration = progressEndFrame - firstAppearFrame;
				const orangeDuration = endingAppearFrame - firstAppearFrame;
				const orangePercentage = (orangeDuration / totalDuration) * 100;

				// Overall progress: from first task appearance to ending element progress completion
				const overallProgress = interpolate(
					frame,
					[firstAppearFrame, progressEndFrame],
					[0, 100],
					{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
				);

				// Calculate orange and purple sections
				const orangeWidth = Math.min(overallProgress, orangePercentage);
				const purpleWidth = Math.max(0, overallProgress - orangePercentage);

				return (
					<>
						{/* Progress bar at bottom with two colors */}
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								height: 12,
								backgroundColor: '#e0e0e0',
								display: 'flex',
							}}
						>
							{/* Orange section (tasks) */}
							<div
								style={{
									height: '100%',
									width: `${orangeWidth}%`,
									backgroundColor: '#ff9800',
								}}
							/>
							{/* Purple section (ending) */}
							<div
								style={{
									height: '100%',
									width: `${purpleWidth}%`,
									backgroundColor: '#9c27b0',
								}}
							/>
						</div>
					</>
				);
			})()}

			<h1 style={{ fontSize: 60, marginBottom: 40 }}>{date}</h1>
			{useMultiColumn ? (
				<div
					style={{
						display: 'grid',
						gridTemplateRows: `repeat(${MAX_TASKS_PER_COLUMN}, auto)`,
						gridAutoFlow: 'column',
						gap: '20px 40px',
						borderLeft: '4px solid #ccc',
						paddingLeft: 30,
					}}
				>
					{tasks.map((task, index) => renderTask(task, index))}
					{frame >= endingAppearFrame && renderEndingElement()}
				</div>
			) : (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 20,
						borderLeft: '4px solid #ccc',
						paddingLeft: 40,
						position: 'relative',
					}}
				>
					{tasks.map((task, index) => renderTask(task, index))}
					{frame >= endingAppearFrame && renderEndingElement()}
				</div>
			)}
		</AbsoluteFill>
	);
};
