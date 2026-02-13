const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// 1. AI Disease Detection (Simulated or Placeholder)
// Triggered via HTTP request or callable function
exports.detectDisease = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { imageUrl, cropType } = data;

    // TODO: Call actual AI model API here
    // For now, return a mock result based on random logic or image analysis mock

    console.log(`Analyzing image for ${cropType}: ${imageUrl}`);

    // Mock Result
    return {
        diseaseName: "Leaf Spot",
        confidence: 0.92,
        severity: "Low",
        solution: "Apply Organic Neem Oil spray every 5 days."
    };
});

// 2. Submit Sensor Data (IoT Integration)
// Triggered via HTTP request (e.g., from ESP32)
exports.submitSensorData = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { deviceId, soilMoisture, humidity, timestamp } = req.body;

    try {
        const reading = {
            deviceId,
            soilMoisture,
            humidity,
            timestamp: timestamp || new Date().toISOString(),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('sensorReadings').add(reading);

        // Check thresholds and trigger alerts if necessary
        // Example: If moisture < 30%, create a notification
        if (soilMoisture < 30) {
            // Logic to find user associated with deviceId and send alert
            console.log(`Alert: Low moisture on device ${deviceId}`);
        }

        res.status(200).send({ success: true, id: reading.deviceId });
    } catch (error) {
        console.error("Error storing sensor data:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// 3. Generate Daily Recommendations (Scheduled)
// Runs every day at 6:00 AM
exports.generateDailyRecommendations = functions.pubsub.schedule('every day 06:00').onRun(async (context) => {
    const usersSnapshot = await db.collection('users').get();

    usersSnapshot.forEach(async (userDoc) => {
        const userId = userDoc.id;
        // logic to generate recommendation based on recent sensor data and weather
        const recommendation = {
            userId,
            type: "Irrigation",
            message: "Soil moisture is optimal. No watering needed today.",
            createdAt: new Date()
        };

        await db.collection('recommendations').add(recommendation);
    });

    return null;
});
