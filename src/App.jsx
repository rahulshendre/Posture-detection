import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import bentFull from 'D:/Stuff/College/SY/Common module/IOT/faster/src/assets/bent_full.png';
import bentHalf from 'D:/Stuff/College/SY/Common module/IOT/faster/src/assets/bent_half.png';
import straight from 'D:/Stuff/College/SY/Common module/IOT/faster/src/assets/straight.png';

function App() {
  const [data, setData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("data"); // State for active tab

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the latest data point
        const response = await fetch(
          "https://api.thingspeak.com/channels/2922188/feeds.json?api_key=OZJOJDV5F39O0GKP&results=1"
        );
        const result = await response.json();
        setData(result);

        // Fetch historical data for graphs (last 20 data points)
        const histResponse = await fetch(
          "https://api.thingspeak.com/channels/2922188/feeds.json?api_key=OZJOJDV5F39O0GKP&results=20"
        );
        const histResult = await histResponse.json();

        // Transform the data for charts
        const formattedData = histResult.feeds.map((feed) => ({
          time: new Date(feed.created_at).toLocaleTimeString(),
          tilt: parseFloat(feed.field1),
          xAxis: parseFloat(feed.field2),
          yAxis: parseFloat(feed.field3),
        }));

        setHistoricalData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getBendImage = (tilt) => {
    if (tilt >= 28) return bentFull;
    if (tilt > 25) return bentHalf;
    return straight;
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">Loading IoT data...</div>
          <div className="mt-2 text-gray-600">Fetching the latest sensor readings</div>
        </div>
      </div>
    );
  }

  const latestTilt = parseFloat(data?.feeds[0]?.field1 || 0);
  const bendImage = getBendImage(latestTilt);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IoT Control Panel</h1>
          <p className="text-gray-600">
            Channel: {data?.channel?.name} | Last Updated:{" "}
            {new Date(data?.feeds[0]?.created_at).toLocaleString()}
          </p>
        </header>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "data"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("data")}
          >
            Sensor Data
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "bend"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("bend")}
          >
            Posture
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "data" && (
          <div>
            {/* Current Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Tilt</h2>
                <p className="text-3xl font-bold text-blue-600">{latestTilt}°</p>
                <p className="text-gray-500 mt-2">Current tilt measurement</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">X-Axis</h2>
                <p className="text-3xl font-bold text-green-600">{data?.feeds[0]?.field2}</p>
                <p className="text-gray-500 mt-2">X-axis reading</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Y-Axis</h2>
                <p className="text-3xl font-bold text-red-600">{data?.feeds[0]?.field3}</p>
                <p className="text-gray-500 mt-2">Y-axis reading</p>
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tilt History</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="tilt"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Tilt (°)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bend" && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Posture</h2>
            <p className="text-lg text-gray-600 mb-4">
              Current Posture:{" "}
              {latestTilt >= 28
                ? "Full Bent"
                : latestTilt > 25
                ? "Half Bent"
                : "Straight"}
            </p>
            <img
              src={bendImage}
              alt="Bend State"
              className="mx-auto w-64 h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
