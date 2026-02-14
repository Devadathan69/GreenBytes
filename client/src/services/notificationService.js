/**
 * Notification service — sends alerts to the CoFarm backend server.
 * The server handles email delivery via Resend.
 */

const NOTIFICATION_SERVER = import.meta.env.VITE_NOTIFICATION_SERVER || 'http://localhost:3001';

// Track which modules already sent a notification (prevent spam)
const notifiedModules = new Set();

/**
 * Send a water clogging alert email via the notification server.
 * Only sends once per module until the clogging is resolved.
 * 
 * @param {Object} params
 * @param {string} params.zoneName - Zone name
 * @param {string} params.cropName - Crop name
 * @param {string} params.moduleId - Module ID
 * @param {number} params.moisturePercent - Moisture percentage
 * @param {number} params.moistureValue - Raw moisture value
 * @param {string} [params.toEmail] - Override recipient email
 */
export const sendWaterCloggingAlert = async ({ zoneName, cropName, moduleId, moisturePercent, moistureValue, toEmail }) => {
    // Prevent duplicate notifications for the same module
    if (notifiedModules.has(moduleId)) {
        console.log(`[Notify] Already notified for ${moduleId}, skipping.`);
        return { skipped: true };
    }

    try {
        const response = await fetch(`${NOTIFICATION_SERVER}/api/notify/water-clogging`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zoneName, cropName, moduleId, moisturePercent, moistureValue, toEmail })
        });

        const data = await response.json();

        if (data.success) {
            notifiedModules.add(moduleId);
            console.log(`[Notify] ✅ Water clogging email sent for ${zoneName} (${moduleId})`);
        } else {
            console.error(`[Notify] ❌ Failed:`, data.error);
        }

        return data;
    } catch (err) {
        console.error(`[Notify] ❌ Server error:`, err.message);
        return { success: false, error: err.message };
    }
};

/**
 * Clear notification tracking for a module (call when clogging resolves).
 */
export const clearCloggingAlert = (moduleId) => {
    notifiedModules.delete(moduleId);
    console.log(`[Notify] Cleared alert for ${moduleId}`);
};
