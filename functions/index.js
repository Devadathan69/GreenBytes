const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 1. Submit Sensor Data (Simulating IoT Device)
exports.submitSensorData = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    const { deviceId, soilMoisture, humidity, temperature } = req.body;

    try {
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        await admin.firestore().collection("sensorReadings").add({
            deviceId,
            soilMoisture,
            humidity,
            temperature,
            timestamp,
        });

        // Simple analysis
        let status = "Normal";
        if (soilMoisture < 30) status = "Dry - Needs Irrigation";
        if (soilMoisture > 80) status = "Wet - Risk of Rot";

        res.status(200).json({ status: "Success", analysis: status });
    } catch (error) {
        console.error("Error storing sensor data:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 2. Scheduled Recommendation Engine (Runs daily or triggered)
// For demo, we'll make it an HTTP function to test easily
exports.generateDailyAdvice = functions.https.onRequest(async (req, res) => {
    const { userId, crop, growthStage } = req.body; // In real app, fetch from Firestore

    let advice = "Monitor your crop regularly.";

    // Logic based on Crop & Stage
    if (crop === "Wheat") {
        if (growthStage === "Sowing") {
            advice = "Ensure soil moisture is adequate for germination. Apply basal fertilizer dose.";
        } else if (growthStage === "Vegetative") {
            advice = "Apply first irrigation (CRI stage) 21 days after sowing. Check for weed growth.";
        } else if (growthStage === "Flowering") {
            advice = "Critical stage for irrigation. Water stress now can reduce yield by 30%.";
        }
    } else if (crop === "Rice") {
        if (growthStage === "Vegetative") {
            advice = "Maintain 2-3 cm standing water. Apply Urea top dressing.";
        }
    }

    res.status(200).json({
        crop,
        stage: growthStage,
        advice,
        action: "Check Field"
    });
});
