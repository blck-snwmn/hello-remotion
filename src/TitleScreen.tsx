import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamily } from './fonts';

interface TitleScreenProps {
    date: string;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ date }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(frame, [0, 15], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#1a1a2e',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity,
                fontFamily,
            }}
        >
            <h1
                style={{
                    fontSize: 80,
                    color: '#ffffff',
                    marginBottom: 20,
                    fontWeight: 'bold',
                }}
            >
                Timeline
            </h1>
            <p
                style={{
                    fontSize: 40,
                    color: '#e0e0e0',
                }}
            >
                {date}
            </p>
        </AbsoluteFill>
    );
};
