import {QRCodeCanvas} from "qrcode.react";

function QRCodeGenerator({tokenID}){
    const verifyURL = 'https://localhost:5123/verify/${tokenID}';
    return(
        <div>
            <h3>Scan to Verify Product</h3>
            <QRCodeCanvas value={verifyURL} size={200}/>
            {/* <p>{verifyURL}</p> */}
        </div>
    )
}

export default QRCodeGenerator;