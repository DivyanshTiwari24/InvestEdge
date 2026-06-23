import React, { useEffect, useState } from 'react';

function HomePage() {
    const [loopError, setLoopError] = useState(false);
    const [targetUrl, setTargetUrl] = useState('');

    useEffect(() => {
        const rawUrl = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3003";
        // Convert dashboardUrl/signup to dashboardUrl/
        const dashboardUrl = rawUrl.replace(/\/signup\/?$/, "") || rawUrl;
        setTargetUrl(dashboardUrl);

        try {
            const currentOrigin = window.location.origin;
            const targetOrigin = new URL(dashboardUrl).origin;

            if (currentOrigin === targetOrigin) {
                setLoopError(true);
            } else {
                // Redirect to dashboard URL
                window.location.href = dashboardUrl;
            }
        } catch (e) {
            console.error("Invalid target URL for redirection:", dashboardUrl);
            window.location.href = dashboardUrl;
        }
    }, []);

    if (loopError) {
        return (
            <div style={styles.container}>
                <div style={styles.errorCard}>
                    <div style={styles.errorIcon}>⚠️</div>
                    <h2 style={styles.errorTitle}>Port Conflict Detected</h2>
                    <p style={styles.errorSubtitle}>
                        Both the Frontend and Dashboard are trying to run on the same origin (<code>{window.location.origin}</code>).
                    </p>
                    <div style={styles.stepsContainer}>
                        <h4 style={styles.stepsHeading}>How to Fix:</h4>
                        <ol style={styles.stepsList}>
                            <li>Stop this frontend application in your terminal.</li>
                            <li>
                                Start it on a different port (e.g., port 3001) by running:
                                <pre style={styles.codeBlock}>
                                    {window.navigator.platform.indexOf('Win') > -1 
                                        ? "$env:PORT=3001; npm start" 
                                        : "PORT=3001 npm start"}
                                </pre>
                            </li>
                            <li>Make sure your Dashboard app is running separately (usually on port 3000).</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.spinner}></div>
                <h2 style={styles.title}>Redirecting to InvestEdge</h2>
                <p style={styles.subtitle}>Connecting you to your secure trading dashboard...</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '20px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: '#ffffff',
    },
    card: {
        textAlign: 'center',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeIn 0.5s ease-out',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '3px solid #e0e0e0',
        borderTop: '3px solid #f56834', // Premium accent color matching Zerodha theme
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '24px',
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '24px',
        fontWeight: '600',
        color: '#333333',
    },
    subtitle: {
        margin: 0,
        fontSize: '14px',
        color: '#999999',
    },
    errorCard: {
        maxWidth: '500px',
        width: '100%',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#ffffff',
        border: '1px solid #ffe3e3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeIn 0.5s ease-out',
    },
    errorIcon: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    errorTitle: {
        margin: '0 0 12px 0',
        fontSize: '24px',
        fontWeight: '600',
        color: '#d32f2f',
        textAlign: 'center',
    },
    errorSubtitle: {
        margin: '0 0 24px 0',
        fontSize: '15px',
        color: '#555555',
        textAlign: 'center',
        lineHeight: '1.5',
    },
    stepsContainer: {
        width: '100%',
        backgroundColor: '#fafafa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #eaeaea',
    },
    stepsHeading: {
        margin: '0 0 10px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#333333',
    },
    stepsList: {
        margin: 0,
        paddingLeft: '20px',
        fontSize: '14px',
        color: '#555555',
        lineHeight: '1.6',
    },
    codeBlock: {
        margin: '8px 0',
        padding: '8px 12px',
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        borderRadius: '4px',
        fontFamily: "Consolas, Monaco, monospace",
        fontSize: '13px',
        overflowX: 'auto',
    }
};

// Add raw keyframes for animation in a style tag dynamically
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default HomePage;
