# CoFarm - Intelligent Agriculture Companion

CoFarm is a production-ready, full-stack web application designed to assist farmers with crop disease detection, real-time soil monitoring, and smart recommendations.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Recharts, i18next (Multilingual)
- **Backend:** Firebase (Authentication, Firestore, Cloud Functions, Storage)
- **Architecture:** Modular, Mobile-First, Scalable

## Features

1.  **Authentication:** Secure Login/Register for farmers.
2.  **Dashboard:** Overview of farm health, latest sensor readings, and alerts.
3.  **Crop Disease Detection:** Upload crop images to detect diseases (simulated AI model).
4.  **Soil Monitoring:** Real-time charts for moisture and humidity trends.
5.  **Smart Recommendations:** Actionable advice based on sensor data.
6.  **Multilingual Support:** English and Hindi support (extensible).

## Setup & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd CoFarm
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd client
    npm install
    ```

3.  **Configure Firebase:**
    - Create a project on [Firebase Console](https://console.firebase.google.com/).
    - Enable Authentication (Email/Password).
    - Enable Firestore Database.
    - Enable Storage.
    - Copy your Firebase config object.
    - Update `client/src/firebase.js` with your config keys.

4.  **Run the Client:**
    ```bash
    npm run dev
    ```

5.  **Backend (Optional for local dev without emulators):**
    - The `functions` directory contains the Cloud Functions logic.
    - To deploy functions: `firebase deploy --only functions`

## IoT Data Simulation

To simulate sending sensor data (like from an ESP32):

1.  Send a POST request to your deployed `submitSensorData` function URL.
2.  Payload format:
    ```json
    {
      "deviceId": "esp32_001",
      "soilMoisture": 65,
      "humidity": 70
    }
    ```

## Deployment

To deploy the frontend to Firebase Hosting:

1.  Build the project:
    ```bash
    cd client
    npm run build
    ```

2.  Deploy:
    ```bash
    firebase deploy
    ```

## Future Roadmap

- Integration with real AI model API.
- Hardware integration with physical ESP32 sensors.
- Community forum and Marketplace for farmers.
