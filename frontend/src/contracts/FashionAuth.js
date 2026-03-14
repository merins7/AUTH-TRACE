export const contractAddress = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

export const contractABI = [
  {
            "type": "function",
            "name": "mint",
            "inputs": [
                {
                    "name": "to",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "metadataURI",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "productHash",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "nonpayable"
        }
];