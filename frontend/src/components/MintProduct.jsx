import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { keccak256, toBytes } from "viem";

import { contractAddress, contractABI } from "../contracts/FashionAuth";
import { uploadFile} from "../utils/ipfsUpload";
import { createMetadata } from "../utils/createMetadata";

function MintProduct() {

  const { address } = useAccount();

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [serial, setSerial] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const mintProduct = async () => {

    if (!address) {
      alert("Please connect wallet");
      return;
    }

    if (!name || !brand || !serial || !imageFile) {
      alert("Please fill all fields");
      return;
    }

    try {
    setIsUploading(true); 
    // 1️. Upload image
    const imageURI = await uploadFile(imageFile);
    console.log("Image URI:", imageURI);

    // 2. Create metadata object
    const metadata = createMetadata(name, brand, serial, description, imageURI);
    console.log("Metadata object:", metadata);

    // 3. Convert metadata object → File manually here
    const metadataFile = new File([JSON.stringify(metadata)],  // JS object → JSON text → File
    "metadata.json", //Filename given that will be shown in painata (optional)
    { type: "application/json" } //MIME type, telling pinata "this file is JSON" (optional)
    );

    /* Option 2: String → Blob → File
const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" })  //telling browser "this data is JSON"
const file = new File([blob], "metadata.json")*/ //telling Pinata "this file is JSON"

    // 4. Upload metadata using the same uploadFile function
    const metadataURI = await uploadFile(metadataFile);
    console.log("Metadata URI:", metadataURI);


    const productString = `${brand}-${serial}`.toLowerCase();
    const productHash = keccak256(toBytes(productString));

    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "mint",
      args: [address, metadataURI, productHash],
    });

    } catch (error) {
    console.error(error);
    alert("Upload or mint failed");
  } finally {
    setIsUploading(false); 
  }

  };

  return (
    <div>
      <h2>Mint Product</h2>

      <input
        placeholder="Product Name "
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />

      <button onClick={mintProduct} disabled={isPending || isConfirming || isUploading}>
        {isUploading
          ? "Uploading to IPFS..."
          : isPending
            ? "Confirm in wallet..."
            : isConfirming
              ? "Minting..."
              : "Mint Product"}
      </button>

      {isSuccess && <p>NFT Minted Successfully</p>}
    </div>
  );
}

export default MintProduct;