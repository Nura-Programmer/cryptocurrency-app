import "./App.css";
import AlertForm from "./components/AlertForm";
import PriceBoard from "./components/PriceBoard";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Crypto Monitor & Alerts</h1>
      <PriceBoard />
      <hr />
      <AlertForm />
    </div>
  );
}

export default App;
