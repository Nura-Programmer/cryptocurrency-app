import React, { useState } from "react";
import axios from "axios";

const AlertForm = () => {
  const [coinId, setCoinId] = useState("");
  const [target, setTarget] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [operator, setOperator] = useState<"GREATER_THAN" | "LESS_THAN">(
    "GREATER_THAN"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/alerts", {
        coinId,
        operator,
        target,
      });
      setMessage(`Alert created: ${res.data.data.id}`);
    } catch (err) {
      console.log(`Error: ${err}`);
      setMessage(`Error: unable to create alert`);
    }
  };

  return (
    <div>
      <h3>Create Alert</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Coin:</label>
          <input value={coinId} onChange={(e) => setCoinId(e.target.value)} />
        </div>
        <div>
          <label>Operator:</label>
          <select
            value={operator}
            onChange={(e) =>
              setOperator(e.target.value as "GREATER_THAN" | "LESS_THAN")
            }
          >
            <option value="GREATER_THAN">Greater Than</option>
            <option value="LESS_THAN">Less Than</option>
          </select>
        </div>
        <div>
          <label>Target Price (USD):</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseFloat(e.target.value))}
          />
        </div>
        <button type="submit">Set Alert</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AlertForm;
