import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

const detectDisease = httpsCallable(functions, 'detectDisease');

export const analyzeCropImage = async (imageFile) => {
    // In a real app, you would upload the image to Firebase Storage first,
    // get the URL, and then pass it to the function.
    // For this demo/mock, we'll simulate the call or pass a placeholder URL.

    try {
        // const result = await detectDisease({ imageUrl: 'mock-url', cropType: 'Wheat' });
        // return result.data;

        // Simulating Local Response for Demo (faster than deploying functions)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    diseaseName: "Rust",
                    confidence: 92.5,
                    severity: "High",
                    solution: "Apply Sulfur-based fungicides immediately."
                });
            }, 1500);
        });

    } catch (error) {
        console.error("Error analyzing crop:", error);
        throw error;
    }
};

export const submitSensorReadings = async (data) => {
    // Post to the HTTP endpoint
    // fetch('https://us-central1-YOUR_PROJECT.cloudfunctions.net/submitSensorData', { ... })
    console.log("Submitting sensor data:", data);
};
