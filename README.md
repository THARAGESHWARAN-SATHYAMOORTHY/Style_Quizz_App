# Overview
The goal of this assignment is to design and implement a React Native mobile application that
delivers a style quiz to users in order to understand their fashion preferences. Based on the
user’s likes and dislikes, the app should algorithmically recommend goods.


## 🛠️ Tech Stack

  * **Frontend:** React Native, Expo
  * **Backend:** Python, FastAPI, Uvicorn
  * **Database:** ChromaDB (for vector storage and search)
  * **Package Managers:** npm, pip



## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

  * **OS:** macOS, Linux, or Windows.
  * **Python:** Version 3.10–3.12 is recommended.
  * **Node.js & npm:** [Download Node.js](https://nodejs.org/en) (npm is included).
  * **Expo CLI:** Install it globally after setting up Node.js.
    ```bash
    npm install -g expo-cli
    ```
  * **Git:** (Optional, for cloning the repository).

> **Note:** The first time you run the backend, it will download the necessary ML models and create a ChromaDB vector store. This requires a stable internet connection and sufficient disk space.

### Installation & Setup

Follow these steps to set up both the backend server and the mobile application.

#### 1\. Clone the Repository

First, clone the project repository to your local machine.

```bash
git clone <your-repository-url>
cd <your-project-directory>
```



#### 2\. Backend Setup (Python)

The backend server is responsible for the recommendation logic.

1.  **Navigate to the Backend Directory**

    ```bash
    cd Backend
    ```

2.  **Create a Python Virtual Environment**
    This isolates the project's dependencies from your system's Python installation.

    ```bash
    python -m venv venv
    ```

3.  **Activate the Virtual Environment**

      * On **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```
      * On **Windows**:
        ```bash
        venv\Scripts\activate
        ```

4.  **Install Dependencies**
    Install all the required Python packages from the `requirements.txt` file.

    ```bash
    pip install -r requirements.txt
    ```

5.  **Start the Backend Server**
    This command starts the FastAPI server using Uvicorn. The `--reload` flag automatically restarts the server when you make changes to the code.

    ```bash
    uvicorn endpoint:app --reload --port 8000
    ```

    ✅ The backend should now be running at **http://localhost:8000**.



#### 3\. Mobile App Setup (React Native)

The mobile app is the user-facing client. **Open a new terminal window** for these steps, keeping the backend server running in the other.

1.  **Navigate to the Mobile App Directory**
    From the project's root folder:

    ```bash
    cd mobile
    ```

2.  **Install Dependencies**
    Install all the required Node.js packages.

    ```bash
    npm install
    ```

3.  **Start the Expo Development Server**
    This will bundle the app and provide a QR code to run it.

    ```bash
    npx expo start
    ```


## 📱 Running the App

Once the Expo development server is running, you can launch the app in one of two ways:

1.  **On Your Physical Device:**

      * Install the **Expo Go** app from the App Store (iOS) or Play Store (Android).
      * Scan the QR code displayed in your terminal with the Expo Go app.

2.  **On a Simulator/Emulator:**

      * Ensure you have Android Studio (for Android Emulator) or Xcode (for iOS Simulator) installed.
      * In the terminal where Expo is running, press `a` to open on an Android emulator or `i` to open on an iOS simulator.
