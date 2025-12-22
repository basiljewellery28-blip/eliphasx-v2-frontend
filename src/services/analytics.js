/**
 * Analytics Service
 * Google Analytics 4 event tracking for ELIPHASx
 */

// GA4 Measurement ID from environment or production default
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_ID || 'G-82VYHSMXMH';

/**
 * Track a custom event in Google Analytics
 * @param {string} eventName - The event name (e.g., 'quote_started')
 * @param {object} params - Additional parameters to track
 */
export const trackEvent = (eventName, params = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
            ...params,
            timestamp: new Date().toISOString()
        });
        console.log(`📊 Analytics: ${eventName}`, params);
    }
};

/**
 * Track page views (called on route changes)
 */
export const trackPageView = (path, title) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: path,
            page_title: title
        });
    }
};

// ============================================
// QUOTE TRACKING EVENTS
// ============================================

/**
 * Track when a user starts creating a quote
 */
export const trackQuoteStarted = (metadata = {}) => {
    trackEvent('quote_started', {
        category: 'quote',
        ...metadata
    });
};

/**
 * Track when a quote is completed/saved
 */
export const trackQuoteCompleted = (quoteId, totalValue, metadata = {}) => {
    trackEvent('quote_completed', {
        category: 'quote',
        quote_id: quoteId,
        value: totalValue,
        currency: 'ZAR',
        ...metadata
    });
};

/**
 * Track time from quote start to PDF generation
 */
export const trackTimeToPDF = (quoteId, durationMs) => {
    trackEvent('time_to_pdf', {
        category: 'quote',
        quote_id: quoteId,
        duration_ms: durationMs,
        duration_seconds: Math.round(durationMs / 1000)
    });
};

/**
 * Track PDF download
 */
export const trackPDFDownload = (quoteId, pdfType) => {
    trackEvent('pdf_download', {
        category: 'quote',
        quote_id: quoteId,
        pdf_type: pdfType // 'client' or 'admin'
    });
};

// ============================================
// USER ENGAGEMENT EVENTS
// ============================================

/**
 * Track user registration
 */
export const trackUserRegistered = (plan) => {
    trackEvent('user_registered', {
        category: 'user',
        plan: plan
    });
};

/**
 * Track successful login
 */
export const trackLogin = (method = 'email') => {
    trackEvent('login', {
        category: 'user',
        method: method
    });
};

/**
 * Track subscription upgrade
 */
export const trackSubscriptionUpgrade = (fromPlan, toPlan, value) => {
    trackEvent('subscription_upgrade', {
        category: 'billing',
        from_plan: fromPlan,
        to_plan: toPlan,
        value: value,
        currency: 'ZAR'
    });
};

/**
 * Track client added
 */
export const trackClientAdded = () => {
    trackEvent('client_added', {
        category: 'client'
    });
};

// ============================================
// QUOTE APPROVAL EVENTS
// ============================================

export const trackQuoteSubmittedForApproval = (quoteId) => {
    trackEvent('quote_submitted_for_approval', {
        category: 'approval',
        quote_id: quoteId
    });
};

export const trackQuoteApproved = (quoteId) => {
    trackEvent('quote_approved', {
        category: 'approval',
        quote_id: quoteId
    });
};

export const trackQuoteRejected = (quoteId) => {
    trackEvent('quote_rejected', {
        category: 'approval',
        quote_id: quoteId
    });
};

export default {
    trackEvent,
    trackPageView,
    trackQuoteStarted,
    trackQuoteCompleted,
    trackTimeToPDF,
    trackPDFDownload,
    trackUserRegistered,
    trackLogin,
    trackSubscriptionUpgrade,
    trackClientAdded,
    trackQuoteSubmittedForApproval,
    trackQuoteApproved,
    trackQuoteRejected
};
