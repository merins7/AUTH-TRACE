import { createPublicClient, http } from "viem"; // blockchain reader, uses RPC connection to read data from blockchain
import { sepolia } from "viem/chains";

export const publicClient = createPublicClient({
    chains: [sepolia],
    transport: http(import.meta.env.VITE_SEPOLIA_RPC_URL),

});