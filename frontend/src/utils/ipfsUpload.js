/*import { create } from 'ipfs-http-client'  //function to connect to node
import axios from 'axios'  //to make http requests (here to Pinata API)

// connect to local IPFS node 
const ipfs = create({
  url: 'http://127.0.0.1:5001/api/v0'  // not 127.0.0.1 becase this is localhost of wsl and we need to connect to the host machine's IP address from wsl.
}) */ //failed because of CORS issue, we will use Pinata instead, which is a pinning service that provides an API to upload files to IPFS without running our own node


import axios from "axios";

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT; //for authentication with pinata

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "pinataOptions",
    JSON.stringify({ cidVersion: 1, wrapWithDirectory: false })
  );// specifying how to sore in pinata, we want CIDv1 and no wrapping directory (otherwise it will create a folder and put the file inside, which is not what we want for metadata)


  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );

  //const cid = res.data.IpfsHash;

  console.log("Pinata CID:", res.data.IpfsHash);
  return `ipfs://${res.data.IpfsHash}`;
}
