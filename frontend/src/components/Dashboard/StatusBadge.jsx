import React from 'react';

const StatusBadge = ({ progress }) => {
    let text = 'WAITING';
    let styles = {
        background: 'transparent',
        border: 'none',
        color: '#666',
        fontWeight: '600',
        padding: '4px 0'
    };

    const numProgress = Number(progress) || 0;

    if (numProgress === 0) {
        text = 'WAITING';
        styles = {
            background: 'transparent',
            border: 'none',
            color: '#8e94a3',
            fontWeight: '600',
            padding: '4px 0',
            fontSize: '10px',
            textTransform: 'uppercase'
        };
    } else if (numProgress > 0 && numProgress <= 50) {
        text = 'AT RISK';
        styles = {
            background: '#FFF4E5', // Light yellow/orange
            color: '#B76E00',      // Darker orange for text contrast
            border: 'none',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '10px',
            textTransform: 'uppercase',
            display: 'inline-block'
        };
    } else if (numProgress > 50 && numProgress < 100) {
        text = 'IN PROGRESS';
        styles = {
            background: '#FFF9E5', // Light yellow
            color: '#B79900',      // Darker yellow for text contrast
            border: 'none',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '10px',
            textTransform: 'uppercase',
            display: 'inline-block'
        };
    } else if (numProgress === 100) {
        text = 'COMPLETED';
        styles = {
            background: '#E5F9F1', // Light green
            color: '#008556',      // Darker green for text contrast
            border: 'none',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '10px',
            textTransform: 'uppercase',
            display: 'inline-block'
        };
    }

    return (
        <div
            className="status-badge"
            style={{
                ...styles,
                transition: 'all 0.3s ease',
                cursor: 'default',
                whiteSpace: 'nowrap'
            }}
        >
            {text}
        </div>
    );
};

export default StatusBadge;
