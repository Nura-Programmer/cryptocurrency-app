import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { usePrices } from "../hooks/usePrices";

const PriceBoard = () => {
  const prices = usePrices();

  // Transform into chart data
  const data = Object.entries(prices).map(([coin, { price, ts }]) => ({
    coin,
    price,
    time: new Date(ts).toLocaleTimeString(),
  }));

  return (
    <div className="p-6 bg-white rounded-xl shadow-md dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-4">📈 Live Prices</h2>

      {data.length === 0 ? (
        <p className="text-gray-500">Waiting for price updates...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PriceBoard;
