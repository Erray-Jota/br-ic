import { createContext, useContext, useEffect, useCallback } from 'react';
import GoogleAnalytics from './trackers/GoogleAnalytics';
import Clarity from './trackers/Clarity';
import SixSense from './trackers/SixSense';
import LocalLogger from './trackers/LocalLogger';
import { TRACKING_EVENTS } from './constants';

const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children, config = {} }) => {
    const {
        gaMeasurementId,
        clarityId,
        sixSenseId,
        enabled = true,
    } = config;

    // Initialize trackers
    useEffect(() => {
        if (!enabled) return;

        if (gaMeasurementId) GoogleAnalytics.init(gaMeasurementId);
        if (clarityId) Clarity.init(clarityId);
        if (sixSenseId) SixSense.init(sixSenseId);
        LocalLogger.init();

        // Track session start
        trackEvent(TRACKING_EVENTS.SESSION_START);
    }, [enabled, gaMeasurementId, clarityId, sixSenseId]);

    // Track page views
    useEffect(() => {
        if (!enabled) return;

        const handleLocationChange = () => {
            const path = window.location.pathname + window.location.search;
            GoogleAnalytics.trackPageView(path);
            LocalLogger.trackEvent(TRACKING_EVENTS.PAGE_VIEW, { path });
        };

        // Initial page view
        handleLocationChange();

        // Listen for popstate (browser back/forward)
        window.addEventListener('popstate', handleLocationChange);

        // Monkey patch pushState and replaceState to detect SPA navigation
        const originalPushState = window.history.pushState;
        window.history.pushState = function (...args) {
            originalPushState.apply(this, args);
            handleLocationChange();
        };

        const originalReplaceState = window.history.replaceState;
        window.history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            handleLocationChange();
        };

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, [enabled]);

    const trackEvent = useCallback((eventName, properties = {}) => {
        if (!enabled) {
            console.log('[Analytics (Disabled)]', eventName, properties);
            return;
        }

        // Log to console in dev
        if (import.meta.env.DEV) {
            console.log('[Analytics]', eventName, properties);
        }

        // Send to all active trackers
        if (gaMeasurementId) GoogleAnalytics.trackEvent(eventName, properties);
        LocalLogger.trackEvent(eventName, properties);

        // Clarity and 6Sense typically auto-track clicks/sessions, 
        // but custom events can be added if their APIs support it.
    }, [enabled, gaMeasurementId]);

    const identify = useCallback((userId, traits = {}) => {
        if (!enabled) return;
        // Implement identification logic for specific trackers if needed
        LocalLogger.trackEvent('identify', { userId, ...traits });
    }, [enabled]);

    const exportLogs = useCallback(() => {
        return LocalLogger.exportLogs();
    }, []);

    const value = {
        trackEvent,
        identify,
        exportLogs,
    };

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};
