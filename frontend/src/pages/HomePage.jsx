import { ConnectButton } from "@rainbow-me/rainbowkit";
import MintProduct from "../components/MintProduct";

function App() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Fashion Authentication</h1>

      <ConnectButton />
      <MintProduct />
     
    </div>
  );
}

export default App;