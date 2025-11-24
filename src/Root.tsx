import React from 'react';
import { Composition, Sequence } from 'remotion';
import { Timeline } from './Timeline';
import { TitleScreen } from './TitleScreen';
import { EndingScreen } from './EndingScreen';

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

// Wrapper component to combine title, timeline, and ending
const TimelineComposition: React.FC<typeof defaultProps> = (props) => {
    const fps = 30;
    const titleDuration = 60; // 2 seconds
    const endingDuration = 60; // 2 seconds

    const startTime = parseTime(props.videoSettings.startHour);
    const lastTask = props.tasks[props.tasks.length - 1];
    if (!lastTask) {
        return null;
    }

    const lastTime = parseTime(lastTask.time);
    const minuteDiff = lastTime - startTime;
    const framesPerMinute = (props.videoSettings.secPerHour * fps) / 60;
    const lastTaskAppearFrame = minuteDiff * framesPerMinute;

    // 120 frames for last task progress + 90 frames for "終わり" progress
    const timelineDuration = Math.ceil(lastTaskAppearFrame + 210);

    return (
        <>
            <Sequence from={0} durationInFrames={titleDuration}>
                <TitleScreen date={props.date} />
            </Sequence>
            <Sequence
                from={titleDuration}
                durationInFrames={timelineDuration}
            >
                <Timeline {...props} />
            </Sequence>
            <Sequence
                from={titleDuration + timelineDuration}
                durationInFrames={endingDuration}
            >
                <EndingScreen date={props.date} />
            </Sequence>
        </>
    );
};

export const RemotionRoot: React.FC = () => {
    const fps = 30;
    const titleDuration = 60;
    const endingDuration = 60;

    const calculateDuration = (props: typeof defaultProps) => {
        const startTime = parseTime(props.videoSettings.startHour);
        const lastTask = props.tasks[props.tasks.length - 1];
        if (!lastTask) return titleDuration + 30 * fps + endingDuration;

        const lastTime = parseTime(lastTask.time);
        const minuteDiff = lastTime - startTime;
        const framesPerMinute = (props.videoSettings.secPerHour * fps) / 60;
        const lastTaskAppearFrame = minuteDiff * framesPerMinute;

        // 120 frames for last task progress + 90 frames for "終わり" progress
        const timelineDuration = Math.ceil(lastTaskAppearFrame + 210);

        return titleDuration + timelineDuration + endingDuration;
    };
    return (
        <>
            <Composition
                id="Timeline"
                component={TimelineComposition}
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
