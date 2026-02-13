# How to Set Up Your Firebase Project

To make user login, database, and image uploads work, you need to create a free Firebase project.

## Step 1: Create Project
1.  Go to [console.firebase.google.com](https://console.firebase.google.com/)
2.  Click **"Add project"** -> Name it "CoFarm".
3.  Disable Google Analytics (optional, simpler without it).
4.  Click **Create Project**.

## Step 2: Enable Services
Once project is created, enable these features from the left menu:

### 1. Authentication (Login)
- Go to **Build -> Authentication**.
- Click **"Get Started"**.
- Enable **"Email/Password"**.
- Click **Save**.

### 2. Firestore Database (Data)
- Go to **Build -> Firestore Database**.
- Click **"Create Database"**.
- Choose location (e.g., `asia-south1`).
- Start in **Test Mode** (or Production, we already have rules).

### 3. Storage (Images) - *Optional if using Cloudinary*
- Since we are using Cloudinary for images, you can skip this!

## Step 3: Get Config Code
1.  Click the **Project Overview** (Gear icon) -> **Project Settings**.
2.  Scroll down to "Your apps".
3.  Click the **Web icon** (`</>`).
4.  Register app (Name: "CoFarm Web").
5.  **Copy the `firebaseConfig` object**. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "cofarm-123.firebaseapp.com",
  projectId: "cofarm-123",
  storageBucket: "cofarm-123.appspot.com",
  messagingSenderId: "12345...",
  appId: "1:12345..."
};
```

**Please paste that config here (or just the values), and I will connect your app!**
