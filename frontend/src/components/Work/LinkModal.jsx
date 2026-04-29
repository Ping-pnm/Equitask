import React, { useState, useEffect } from 'react';

export default function LinkModal({ isOpen, onClose, onAdd }) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (isOpen) {
            setUrl('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onAdd(url.trim());
            onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(26, 31, 54, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '440px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#1a1f36', letterSpacing: '-0.02em' }}>Add Link</h2>
                    <button 
                        onClick={onClose}
                        style={{ 
                            background: '#f7fafc', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '18px', 
                            color: '#4f566b', 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#edf2f7'; e.currentTarget.style.color = '#1a1f36'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#f7fafc'; e.currentTarget.style.color = '#4f566b'; }}
                    >✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#697386', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Paste Link URL
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', opacity: 0.5 }}>🔗</span>
                            <input
                                autoFocus
                                type="text"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 48px',
                                    borderRadius: '14px',
                                    border: '2px solid #e3e8ee',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    color: '#1a1f36',
                                    background: '#fcfdfe'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#0a7e8c';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(10, 126, 140, 0.1)';
                                    e.target.style.background = 'white';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e3e8ee';
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.background = '#fcfdfe';
                                }}
                            />
                        </div>
                        <p style={{ marginTop: '10px', fontSize: '13px', color: '#697386', lineHeight: '1.5' }}>
                            Paste a URL to a video, website, or document to include it with your work.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '14px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '14px',
                                border: '1px solid #e3e8ee',
                                background: 'white',
                                color: '#4f566b',
                                fontWeight: '700',
                                fontSize: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.target.style.background = '#f7fafc'; e.target.style.borderColor = '#cbd5e0'; }}
                            onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#e3e8ee'; }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!url.trim()}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '14px',
                                border: 'none',
                                background: url.trim() ? '#0a7e8c' : '#e3e8ee',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '15px',
                                cursor: url.trim() ? 'pointer' : 'default',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: url.trim() ? '0 8px 16px rgba(10, 126, 140, 0.25)' : 'none',
                                transform: url.trim() ? 'none' : 'scale(0.98)',
                                opacity: url.trim() ? 1 : 0.7
                            }}
                            onMouseEnter={(e) => { if (url.trim()) e.target.style.background = '#086b77'; }}
                            onMouseLeave={(e) => { if (url.trim()) e.target.style.background = '#0a7e8c'; }}
                        >
                            Add Link
                        </button>
                    </div>
                </form>
            </div>
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { 
                    from { transform: translateY(30px) scale(0.95); opacity: 0; } 
                    to { transform: translateY(0) scale(1); opacity: 1; } 
                }
                `}
            </style>
        </div>
    );
}
