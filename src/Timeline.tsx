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
						backgroundColor: '#e0f7fa',
						borderRadius: 10,
						boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
					}}
				>
					{task.label}
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
				</div>
			)}
		</AbsoluteFill>
	);
};
