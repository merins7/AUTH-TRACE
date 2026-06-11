import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "AuthTrace",
  projectId: "c77b962c77e2bbfdca6ef6dea6d8322b",
  chains: [sepolia],
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RainbowKitProvider chains={[sepolia]}>
          <App />
        </RainbowKitProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </WagmiProvider>
);