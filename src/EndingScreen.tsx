import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface EndingScreenProps {
    date: string;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ date }) => {
    const frame = useCurrentFrame();

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
                End
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
