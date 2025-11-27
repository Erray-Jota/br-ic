const STORAGE_KEY = 'raap_session_logs';

const LocalLogger = {
    init: () => {
        // Optional: Clear logs on new session or keep them
        // sessionStorage.removeItem(STORAGE_KEY);
    },

    trackEvent: (eventName, properties) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: eventName,
            ...properties,
        };

        try {
            const existingLogs = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
            existingLogs.push(logEntry);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existingLogs));
        } catch (e) {
            console.warn('LocalLogger: Failed to save log', e);
        }
    },

    exportLogs: () => {
        try {
            const logs = sessionStorage.getItem(STORAGE_KEY);
            if (!logs) return null;

            const blob = new Blob([logs], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `raap_session_logs_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return true;
        } catch (e) {
            console.error('LocalLogger: Failed to export logs', e);
            return false;
        }
    },

    getLogs: () => {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    }
};

export default LocalLogger;
