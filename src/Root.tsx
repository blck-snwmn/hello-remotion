import React from 'react';
import { Composition } from 'remotion';
import { Timeline } from './Timeline';

const defaultProps = {
    date: '2024-11-25',
    videoSettings: {
        startHour: '09:00',
        secPerHour: 2,
    },
    tasks: [
        { time: '09:30', label: '朝会 (Morning MTG)' },
        { time: '11:00', label: 'コードレビュー' },
        { time: '12:00', label: 'ランチ' },
        { time: '14:00', label: '集中開発タイム' },
        { time: '17:30', label: '日報作成' },
    ],
};

const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    const hours = parts[0] ?? 0;
    const minutes = parts[1] ?? 0;
    return hours * 60 + minutes;
};

export const RemotionRoot: React.FC = () => {
    const fps = 30;

    // Calculate duration based on defaultProps for preview
    // In CLI, we might override this, but Composition duration is static in the definition usually?
    // Actually, calculateMetadata can be used to set duration dynamically based on props.

    const calculateDuration = (props: typeof defaultProps) => {
        const startTime = parseTime(props.videoSettings.startHour);
        const lastTask = props.tasks[props.tasks.length - 1];
        if (!lastTask) return 30 * fps; // Default duration if no tasks

        const lastTime = parseTime(lastTask.time);

        // Add 1 hour buffer after last task
        const endTime = lastTime + 60;
        const totalMinutes = endTime - startTime;

        const framesPerMinute = (props.videoSettings.secPerHour * fps) / 60;
        return Math.ceil(totalMinutes * framesPerMinute);
    };

    return (
        <>
            <Composition
                id="Timeline"
                component={Timeline}
                durationInFrames={calculateDuration(defaultProps)}
                fps={fps}
                width={1920}
                height={1080}
                defaultProps={defaultProps}
                calculateMetadata={async ({ props }) => {
                    const durationInFrames = calculateDuration(props);
                    return {
                        durationInFrames,
                    };
                }}
            />
        </>
    );
};
