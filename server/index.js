require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// CONFIG — Set your Resend API key here (or via .env)
// ============================================
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_YOUR_API_KEY_HERE';
const resend = new Resend(RESEND_API_KEY);

// Default notification email (override via request body)
const DEFAULT_TO_EMAIL = process.env.NOTIFY_EMAIL || 'farmer@example.com';
const FROM_EMAIL = 'CoFarm Alerts <onboarding@resend.dev>'; // Use your verified domain in production

// ============================================
// POST /api/notify/water-clogging
// ============================================
app.post('/api/notify/water-clogging', async (req, res) => {
    const {
        zoneName = 'Unknown Zone',
        cropName = 'Unknown Crop',
        moduleId = 'Unknown',
        moisturePercent = 0,
        moistureValue = 0,
        toEmail
    } = req.body;

    const recipientEmail = toEmail || DEFAULT_TO_EMAIL;

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [recipientEmail],
            subject: `⚠️ Water Clogging Alert — ${zoneName} (${cropName})`,
            html: `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
                    <div style="background: linear-gradient(135deg, #DC2626, #B91C1C); color: white; padding: 24px; border-radius: 16px; text-align: center; margin-bottom: 20px;">
                        <p style="font-size: 40px; margin: 0;">⚠️</p>
                        <h1 style="font-size: 22px; margin: 8px 0 4px;">Water Clogging Detected!</h1>
                        <p style="font-size: 13px; opacity: 0.9; margin: 0;">Immediate attention required</p>
                    </div>

                    <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                        <table style="width: 100%; font-size: 14px; color: #374151;">
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600;">🌾 Crop</td>
                                <td style="padding: 6px 0; text-align: right;">${cropName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600;">📍 Zone</td>
                                <td style="padding: 6px 0; text-align: right;">${zoneName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600;">📡 Module</td>
                                <td style="padding: 6px 0; text-align: right;">${moduleId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600;">💧 Moisture</td>
                                <td style="padding: 6px 0; text-align: right; color: #DC2626; font-weight: 700;">${moisturePercent}%</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600;">📊 Raw Value</td>
                                <td style="padding: 6px 0; text-align: right;">${moistureValue}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                        <h3 style="font-size: 13px; font-weight: 700; color: #92400E; margin: 0 0 8px;">🔧 Recommended Actions</h3>
                        <ul style="font-size: 13px; color: #78350F; padding-left: 16px; margin: 0; line-height: 1.8;">
                            <li>Check drainage channels in the affected zone</li>
                            <li>Inspect for blocked or clogged outlets</li>
                            <li>Consider temporary pumping if water is stagnant</li>
                            <li>Monitor nearby zones for similar issues</li>
                        </ul>
                    </div>

                    <p style="font-size: 11px; color: #9CA3AF; text-align: center; margin: 16px 0 0;">
                        Sent by CoFarm Alert System • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('[Resend] Error:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        console.log(`[Alert] Water clogging email sent to ${recipientEmail} for ${zoneName} (ID: ${data.id})`);
        res.json({ success: true, emailId: data.id });
    } catch (err) {
        console.error('[Resend] Failed:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ============================================
// Health check
// ============================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'CoFarm Notification Server with Dotenv' });
});

// ============================================
// Start
// ============================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 CoFarm Notification Server running on http://localhost:${PORT}`);
    console.log(`📧 Notifications will be sent to: ${DEFAULT_TO_EMAIL}`);
    console.log(`🔑 Resend API key: ${process.env.RESEND_API_KEY ? '✅ Configured via .env' : '❌ Missing!'}`);
});
