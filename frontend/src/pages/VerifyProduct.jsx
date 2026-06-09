import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { contractAddress, contractABI } from "../contracts/FashionAuth";
import { publicClient } from "../config";

function VerifyProduct() {
  const { tokenId } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, []); // empty dependency array means run on page load

  async function loadProduct() {

    try {
    console.log("Verify token:", tokenId);

    const owner = await publicClient.readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "ownerOf",
      args: [BigInt(tokenId)],
    });

    console.log("Owner:", owner);

    const metadataURI = await publicClient.readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    });

    console.log("Metadata URI:", metadataURI);

    const history = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getOwnershipHistory",
   args: [BigInt(tokenId)],
   });

   console.log("History:", history);

    const metadataURL = metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    console.log("Metadata URL:", metadataURL); //browsers cant directly fetch from ipfs://, need to replace with https://ipfs.io/ipfs/ to fetch from IPFS gateway

    const response = await fetch(metadataURL);
    const metadata = await response.json();

    console.log("Metadata:", metadata);

    const imageURL = metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/");
    console.log("Image URL:", imageURL);

    setProduct({
      ...metadata,
      image: imageURL,
      owner,
      history,
    });
  } catch (err) {
    console.error("Error loading product:", err);
    setError("Product not found");
  }
}

  return (
    <div style={{ padding: "40px" }}>
      <h1>Product Verification</h1>

      {/*<p>Token ID: {tokenId}</p>*/}

        {error && <p style={{ color: "red" }}>{error}</p>}

      {product && ( //if product exists
        <div>
          <img src={product.image} alt={product.name} width="250" />

          <h2>{product.name}</h2>

          <p>Brand: {product.brand}</p>

          <p>Serial: {product.serial}</p>

          <p>Current Owner: {product.owner}</p>

          <h3>Ownership Traceability</h3>

<div>
  {product.history.map((address, index) => (
    <div key={index}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "5px",
        }}
      >
        {address}
      </div>

      {index < product.history.length - 1 && (
        <div
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "5px",
          }}
        >
          ↓
        </div>
      )}
    </div>
  ))}
</div>

          <p>Description: {product.description}</p>

          <h3>Status: Authentic ✅</h3>
        </div>
      )}
    </div>
  );
}

export default VerifyProduct;
