import { usePrices } from "../hooks/usePrices";

const PriceBoard = () => {
  const prices = usePrices();

  return (
    <div>
      <h2>Live Prices</h2>
      <ul>
        {Object.entries(prices).map(([coin, { price, ts }]) => (
          <li key={coin}>
            {coin.toUpperCase()}: ${price.toFixed(2)}{" "}
            <small>({new Date(ts).toLocaleTimeString()})</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceBoard;
