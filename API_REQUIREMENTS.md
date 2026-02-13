# Required APIs & Credentials

To make CoFarm fully functional with live data, we need the following APIs and Keys:

## 1. Weather API (For Dashboard & Recommendations)
We need real-time weather data (Temperature, Humidity, Rain Forecast) to generate "Smart Advice".
- **Recommended Provider**: OpenWeatherMap (Free Tier available)
- **What I need from you**: 
    - **API Key** (e.g., `a3b8d1b6...`)
    - OR Endpoint URL if using a custom service.

## 2. Location & Geocoding API
To automatically detect the user's city/village ("Ludhiana, Punjab") from GPS coordinates.
- **Recommended Provider**: 
    - Google Maps Geocoding API (Best accuracy, paid)
    - OpenCage / LocationIQ (Good free tiers)
- **What I need from you**:
    - **API Key**

## 3. Crop Disease Detection Model API (CRITICAL)
This is the core feature. Since the app is React (Client-side), we need an endpoint to send the image to.
- **What I need from you**:
    - **Endpoint URL**: (e.g., `https://api.cofarm.in/predict`)
    - **Request Format**: (e.g., `POST` with `multipart/form-data`)
    - **Response Format**: Your model MUST return a JSON structure like this for the UI to work correctly:
    ```json
    {
      "disease_name": "Late Blight",
      "confidence": 0.95,
      "organic_solution": "Neem Oil spray...",
      "chemical_solution": "Mancozeb...",
      "severity": "High"
    }
    ```
    *(If your model returns a different format, let me know so I can adapt the frontend code)*.

## 4. News API (Optional)
Currently, news is static/mocked. If you want live news:
- **Recommended Provider**: NewsAPI.org (Free for dev)
- **What I need from you**: **API Key**

---
**Note:** Until provided, the app will continue using the realistic mock data currently in place.
