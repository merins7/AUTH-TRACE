import { ConnectButton } from "@rainbow-me/rainbowkit";
import MintProduct from "../components/MintProduct";
import TransferProduct from "../components/TransferProduct";

function App() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Fashion Authentication</h1>

      <ConnectButton />
      <MintProduct />
      <TransferProduct />
     
    </div>
  );
}

export default App;