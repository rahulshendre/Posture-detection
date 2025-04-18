# Posture Detection Application

## Overview
This project is a React-based IoT application for monitoring and visualizing posture data based on tilt, X-axis, and Y-axis sensor readings. The application fetches live and historical data from a ThingSpeak channel and displays:

- Current sensor data (tilt, X-axis, Y-axis)
- Historical tilt data in a line chart
- Posture status with visual feedback using images

## Features
- **Live Sensor Data**: Fetches the latest sensor readings from a ThingSpeak API.
- **Historical Visualization**: Displays a history of tilt readings in an interactive line chart.
- **Posture Assessment**: Determines posture status (`Straight`, `Half Bent`, or `Full Bent`) based on tilt values and displays corresponding images.

## Requirements
### Frontend:
- **React**: Core framework.
- **Recharts**: For interactive data visualizations.
- **TailwindCSS**: For styling the UI components.

### Backend (API Data Source):
- ThingSpeak channel with fields for tilt, X-axis, and Y-axis data.

### Images:
- Images representing `Straight`, `Half Bent`, and `Full Bent` posture states must be available locally.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rahulshendre/Posture-detection.git
   cd Posture-detection
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Code Explanation
### **Data Fetching**
- The application fetches data from a ThingSpeak API using the `fetch` function.
- Live data (latest reading) and historical data (last 20 readings) are fetched and processed.

### **Posture Determination**
- Posture status is determined using the tilt angle:
  - **Straight**: Tilt ≤ 25°
  - **Half Bent**: 25° < Tilt < 28°
  - **Full Bent**: Tilt ≥ 28°

### **UI Components**
- **Tabs**: Toggle between `Sensor Data` and `Posture` views.
- **Cards**: Display current tilt, X-axis, and Y-axis values.
- **Charts**: Interactive line chart for tilt history.
- **Images**: Dynamically display posture images based on tilt angle.

## Folder Structure
```
src/
├── assets/
│   ├── bent_full.png
│   ├── bent_half.png
│   └── straight.png
├── components/
│   └── (if applicable for modularized components)
└── App.js
```

## API Configuration
- Update the API key and channel ID in the `fetch` URLs to connect to your own ThingSpeak channel.

## Usage
1. Run the application in development mode.
2. View live data and tilt history in the `Sensor Data` tab.
3. Check current posture status in the `Posture` tab.

## Future Enhancements
- Add user authentication to secure data access.
- Support multiple devices with unique channels.
- Enhance visualization with additional metrics (e.g., z-axis).






Below is the circuit which was used to build this project, the sensor responsible is the Flex sensor, which detects the tilt angle.
![WhatsApp Image 2025-04-18 at 13 59 51_7da3eb7c](https://github.com/user-attachments/assets/d4e3e0d9-9053-4bbf-b53d-f2884600bd12)
