# How to Get API Keys for CoFarm

Here are the step-by-step instructions to get the free API keys needed for Weather and Location features.

## 1. Weather API (OpenWeatherMap)
This will provide real-time temperature, humidity, and rain forecasts.

1.  **Go to**: [https://openweathermap.org/api](https://openweathermap.org/api)
2.  Click **"Sign Up"** and create a free account.
3.  Once logged in, go to your **API Keys** tab (usually under your profile name -> My API Keys).
4.  You will see a default key, or you can generate a new one.
5.  **Copy the API Key** (it looks like a long string of random characters, e.g., `a3b8d...`).
    *   *Note: It might take 10-15 minutes for a new key to become active.*

## 2. Location API (OpenCage Geocoding)
This converts GPS coordinates (Latitude/Longitude) into readable address names like "Ludhiana, Punjab".

1.  **Go to**: [https://opencagedata.com/](https://opencagedata.com/)
2.  Click **"Sign Up for Free"** (Free Trial / Free Tier).
3.  Create an account.
4.  On your dashboard, look for **"API Keys"**.
5.  **Copy your API Key**.

---

## 3. Where to put them?
Once you have the keys, please paste them in the chat like this:

```
Weather Key: [YOUR_KEY_HERE]
Location Key: [YOUR_KEY_HERE]
```

I will then securely save them in a `.env` file for the application to use.
