import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { keccak256, toBytes } from "viem";

import { contractAddress, contractABI } from "../contracts/FashionAuth";

function MintProduct() {

  const { address } = useAccount();

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [brand, setBrand] = useState("");
  const [serial, setSerial] = useState("");
  const [metadataURI, setMetadataURI] = useState("");

  const mintProduct = () => {

    if (!address) {
      alert("Please connect wallet");
      return;
    }

    if (!brand || !serial || !metadataURI) {
      alert("Please fill all fields");
      return;
    }

    const productString = `${brand}-${serial}`.toLowerCase();
    const productHash = keccak256(toBytes(productString));

    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "mint",
      args: [address, metadataURI, productHash],
    });

  };

  return (
    <div>

      <h2>Mint Product</h2>

      <input
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <input
        placeholder="Serial Number"
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
      />

      <input
        placeholder="Metadata URI"
        value={metadataURI}
        onChange={(e) => setMetadataURI(e.target.value)}
      />

      <button
        onClick={mintProduct}
        disabled={isPending || isConfirming}
      >
        {isPending
          ? "Confirm in wallet..."
          : isConfirming
          ? "Minting..."
          : "Mint Product"}
      </button>

      {isSuccess && (
        <p>
          NFT Minted Successfully
        </p>
      )}

    </div>
  );
}

export default MintProduct;