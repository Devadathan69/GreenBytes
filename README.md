# CoFarm - Intelligent Agriculture Companion 🌾

CoFarm is a production-ready, full-stack web application designed to assist farmers with real-time crop monitoring, disease detection, soil analysis, and smart alerts.

## 🚀 Key Features

- **Real-time Monitoring**: Live soil moisture, temperature, and humidity tracking via Firebase Realtime Database (RTDB).
- **Smart Alerts**: 
  - **Visual**: Red warning cards for water clogging (moisture > 15% for 10s).
  - **Email**: Automatic email notifications via **Resend** integration.
- **Crop Doctor (AI Powered)**: 
  - Instant plant disease diagnosis using **Google Gemini Flash** (via OpenRouter).
  - Upload leaf photos for analysis, treatment advice, and organic alternatives.
  - Context-aware AI Assistant for follow-up questions.
- **Soil Analysis**: Upload soil test reports for OCR-based nutrient extraction and health assessment.
- **Multilingual Support**: Fully localized in **English**, **Hindi**, **Malayalam**, Tamil, Telugu, and Kannada.
- **Dynamic Theming**: UI colors adapt automatically to the selected crop (Cardamom, Tomato, Chilli).

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Recharts, i18next
- **Backend**: Firebase (Auth, Firestore, RTDB), Node.js/Express (for Email Notifications)
- **AI Integration**: Google Gemini 1.5 Flash (via OpenRouter)
- **Email Service**: Resend (Transactional Emails)

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Firebase Project** (Auth, Firestore, Realtime Database enabled)
- **OpenRouter API Key** (for Gemini AI)
- **Resend API Key** (for Email Notifications)

## ⚙️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd CoFarm
    ```

### Client Setup

2.  **Install Dependencies**:
    ```bash
    cd client
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the `client` directory:
    ```env
    VITE_OPENROUTER_API_KEY=sk-or-v1-...  # Your OpenRouter Key
    VITE_OPENWEATHER_API_KEY=...          # Optional
    VITE_NOTIFICATION_SERVER=http://localhost:3001
    ```

4.  **Firebase Config**:
    Update `client/src/firebase.js` with your Firebase project configuration.

### Server Setup (for Email Notifications)

5.  **Install Dependencies**:
    ```bash
    cd ../server
    npm install
    ```

6.  **Environment Variables**:
    Create a `.env` file in the `server` directory:
    ```env
    RESEND_API_KEY=re_123...              # Your Resend API Key
    NOTIFY_EMAIL=farmer@example.com       # Default recipient for alerts
    PORT=3001
    ```

## 🚀 Running the Application

**Option 1: Run Client Only (No Email Alerts)**
```bash
cd client
npm run dev
```

**Option 2: Run Full Stack (Client + Notification Server)**

**Terminal 1 (Server):**
```bash
cd server
npm start
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🧪 Testing Features

- **Water Clogging Alert**: 
  - Select a zone with **Module 1**.
  - Simulate high moisture (`>15`) in your Firebase RTDB for `farm1`.
  - Wait 10 seconds. You should see a **Red Alert** on the dashboard and receive an **Email Notification**.
- **Crop Doctor**:
  - Go to the Crop Doctor tab.
  - Upload a photo of a plant leaf.
  - Wait for Gemini AI analysis and chat with the assistant.

## 📁 Project Structure

```
CoFarm/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── context/        # CropContext (Data Logic)
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Dashboard, Doctor, etc.
│   │   ├── services/       # API Services (Gemini, Notifications)
│   └── ...
├── server/                 # Express Backend
│   ├── index.js            # Server Entry Point
│   └── ...
└── firebase.json           # Firebase Config
```

## 📄 License
MIT License
