import { createPublicClient, http } from "viem"; // blockchain reader, uses RPC connection to read data from blockchain
import { sepolia, anvil } from "viem/chains";

export const publicClient = createPublicClient({
    chains: [sepolia, anvil],
    transport: http("http://127.0.0.1:8545"),

});