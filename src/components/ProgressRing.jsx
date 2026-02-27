import React, { useEffect, useState } from 'react';

export const ProgressRing = ({ percentage, size = 160, strokeWidth = 12 }) => {
    const [offset, setOffset] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        const progressOffset = circumference - (percentage / 100) * circumference;
        setOffset(progressOffset);
    }, [percentage, circumference]);

    let color = 'var(--success)'; // > 90%
    let trailColor = 'var(--success-bg)';
    if (percentage < 75) {
        color = 'var(--danger)';
        trailColor = 'var(--danger-bg)';
    } else if (percentage < 80) {
        color = 'var(--warning)';
        trailColor = 'var(--warning-bg)';
    } else if (percentage < 90) {
        color = '#84cc16'; // yellowish green
        trailColor = '#ecfccb';
    }

    return (
        <div className="circular-progress-wrap" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Background Ring */}
                <circle
                    stroke={trailColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Ring */}
                <circle
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
            </svg>
            <div className="circular-progress-text" style={{ color: color }}>
                {percentage}%
            </div>
        </div>
    );
};
