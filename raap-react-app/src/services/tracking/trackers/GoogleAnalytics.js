import ReactGA from 'react-ga4';

const GoogleAnalytics = {
    init: (measurementId) => {
        if (measurementId) {
            ReactGA.initialize(measurementId);
        }
    },

    trackPageView: (path) => {
        ReactGA.send({ hitType: 'pageview', page: path });
    },

    trackEvent: (eventName, properties) => {
        ReactGA.event({
            category: 'User Interaction',
            action: eventName,
            ...properties,
        });
    },
};

export default GoogleAnalytics;
