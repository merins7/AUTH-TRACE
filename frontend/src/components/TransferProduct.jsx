import { useState } from "react";
import { useWriteContract } from "wagmi";

import {
  contractAddress,
  contractABI,
} from "../contracts/AuthTrace";

function TransferProduct() {
  const [tokenId, setTokenId] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const { writeContract } = useWriteContract();

  function transferNFT() {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "safeTransferFrom",
      args: [
        window.ethereum.selectedAddress,
        newOwner,
        BigInt(tokenId),
      ],
    });
  }

  return (
    <div>
      <h2>Transfer Product</h2>

      <input
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) =>
          setTokenId(e.target.value)
        }
      />

      <input
        placeholder="New Owner Address"
        value={newOwner}
        onChange={(e) =>
          setNewOwner(e.target.value)
        }
      />

      <button onClick={transferNFT}>
        Transfer NFT
      </button>
    </div>
  );
}

export default TransferProduct;