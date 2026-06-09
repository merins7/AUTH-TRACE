import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import VerifyProduct from "./pages/VerifyProduct";

function App() {

  return (
    <Routes>

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/verify/:tokenId"
        element={<VerifyProduct />}
      />

    </Routes>
  );
}

export default App;