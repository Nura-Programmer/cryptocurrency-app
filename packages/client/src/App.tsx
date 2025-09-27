import AlertForm from "./components/AlertForm";
import PriceBoard from "./components/PriceBoard";

function App() {
  return (
    <div className="p-8">
      <h1 className="mb-5">Crypto Monitor & Alerts</h1>
      <PriceBoard />
      <hr className="my-4" />
      <AlertForm />
    </div>
  );
}

export default App;
