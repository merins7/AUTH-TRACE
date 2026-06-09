import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { keccak256, toBytes } from "viem";

import { contractAddress, contractABI } from "../contracts/FashionAuth";
import { uploadFile} from "../utils/ipfsUpload";
import { createMetadata } from "../utils/createMetadata";

import QRCodeGenerator from "./QRCodeGenerator";
import { publicClient } from "../config";

function MintProduct() {

  const { address } = useAccount();

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {        //runs whnever "hash" changes, which happens after writeContract() is called and transaction is sent to blockchain. We need the transaction receipt to get the tokenId, which is only available after transaction is confirmed, which is when hash becomes available. 

  async function getTokenId() {

    if (!hash) return;

    const receipt =
      await publicClient.waitForTransactionReceipt({
        hash,
      });

    console.log(publicClient.chain);  
    console.log("Receipt:", receipt);
   console.log("Log 0", receipt.logs[0]);
console.log("Log 1", receipt.logs[1]);
console.log("Log 2", receipt.logs[2]);

    const event = receipt.logs[2];
    console.log("Event:", event);

    const mintedTokenId =
      Number(event.topics[1]); // topics store values in hex, convert to number
       // works because parameters in events are indexed
    console.log(
      "Minted Token ID:",
      mintedTokenId
    );

    setTokenId(mintedTokenId);
  }

  getTokenId();

 }, [hash]); //dependency array, useEffect runs whenever "hash" changes


  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [serial, setSerial] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  

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
      {tokenId && (
          <QRCodeGenerator tokenID={tokenId} />
      )}
    </div>
  );
}

export default MintProduct;