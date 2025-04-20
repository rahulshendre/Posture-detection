# Posture Detection Application

This project is a React-based IoT application designed to monitor and visualize posture data using tilt, X-axis, and Y-axis sensor readings. It integrates with ThingSpeak for real-time data logging and visualization, providing both live and historical insights.

---

## Getting Started

### Step 1: Hardware Setup  
Before diving into the software setup, ensure the hardware is ready:  
1. Connect the MPU6050 sensor to the ESP8266 microcontroller based on the pin configuration in the `.ino` file.  
2. Attach the flex sensor, LED, and buzzer as described in the hardware schematic.  

Below is the circuit diagram used for this project, with the flex sensor responsible for detecting the tilt angle.  
![Circuit Diagram](https://github.com/user-attachments/assets/d4e3e0d9-9053-4bbf-b53d-f2884600bd12)

---

### Step 2: ThingSpeak Configuration  
1. Create a [ThingSpeak account](https://thingspeak.com/).  
2. Set up a new channel to receive tilt, X-axis, and Y-axis data.  
3. Note down the **API Key** and **Channel ID** from the channel settings.  
4. Replace the placeholders in your `.ino` code:  
   ```cpp
   const char* apiKey = "YOUR_API_KEY";
   const long channelID = YOUR_CHANNEL_ID;
   ```  

---

### Step 3: Uploading the Code  
1. Open the provided `.ino` file in the Arduino IDE.  
2. Install required libraries:
   - `Adafruit_MPU6050`
   - `AdafruitIO_WiFi`  
3. Connect your ESP8266 to the computer and upload the code.  
4. Open the Serial Monitor to verify the data is being sent to ThingSpeak.

---

### Step 4: Verify ThingSpeak Data  
1. Check your ThingSpeak channel for real-time updates.  
2. Confirm graphs appear for tilt, X-axis, and Y-axis data.  

---

### Step 5: Set Up the React Application  
1. Clone the repository:
   ```bash
   git clone https://github.com/rahulshendre/Posture-detection.git
   cd Posture-detection
   ```  
2. Install dependencies:
   ```bash
   npm install
   ```  
3. Update the API key and channel ID in the fetch URLs to connect to your ThingSpeak channel.  
4. Start the development server:
   ```bash
   npm start
   ```  

---

## Overview  

The application provides an interactive user interface for monitoring posture data based on tilt angles and axis readings. Key features include:  

- **Live Sensor Data**: Displays the latest tilt, X-axis, and Y-axis values.  
- **Historical Visualization**: Displays tilt history in an interactive line chart.  
- **Posture Assessment**: Visual feedback on posture status (`Straight`, `Half Bent`, `Full Bent`) using images.  

### Posture Determination Logic  
- **Straight**: Tilt ≤ 25°  
- **Half Bent**: 25° < Tilt < 28°  
- **Full Bent**: Tilt ≥ 28°  

---

## Features  
### Frontend:  
- **React**: Framework for UI development.  
- **Recharts**: For dynamic data visualizations.  
- **TailwindCSS**: Simplified and responsive styling.  

### Backend (Data Source):  
- ThingSpeak channel for live and historical data.  

### Visual Elements:  
- Images representing posture states (`Straight`, `Half Bent`, `Full Bent`).  

---

## Folder Structure  
```
src/
├── assets/
│   ├── bent_full.png
│   ├── bent_half.png
│   └── straight.png
├── components/
└── App.js
```

---

## Usage  
1. Launch the React app in development mode.  
2. View live sensor data and tilt history in the `Sensor Data` tab.  
3. Monitor posture status with visual feedback in the `Posture` tab.  

---

## Future Enhancements  
- Add user authentication to secure data access.  
- Support multiple devices with unique channels.  
- Incorporate additional metrics like z-axis data for enhanced analysis.  

---

## Visual Documentation  

### ER Diagram  
This diagram explains how the application works in a simplified manner:  
![ER Diagram](https://github.com/user-attachments/assets/f564faaa-6d83-45df-a6ac-a3973beeb2d8)

---

### Screenshots  

**React App's Tab**  
A tab in the React app showing data imported from the ThingSpeak channel:  
![React Tab Data](https://github.com/user-attachments/assets/cbe66edf-5558-41db-8973-cb6b8516eba4)

**Posture Status: Correct Posture**  
An image showing the correct posture detected by the application:  
![Correct Posture](https://github.com/user-attachments/assets/8f823cd0-b043-4c4e-9a4a-09c0e65ffa7a)

**Posture Status: Full Bent Posture**  
An image showing a full-bent posture detected by the application:  
![WhatsApp Image 2025-04-17 at 10 16 01_2751aa47](https://github.com/user-attachments/assets/e17b0336-f1fa-4856-816d-3366c203107b)


