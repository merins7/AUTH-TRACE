import {QRCodeCanvas} from "qrcode.react";

function QRCodeGenerator({tokenID}){
    const verifyURL = 'https://auth-trace.vercel.app/verify/${tokenID}';
    return(
        <div>
            <h3>Scan to Verify Product</h3>
            <QRCodeCanvas value={verifyURL} size={200}/>
            {/* <p>{verifyURL}</p> */}
        </div>
    )
}

export default QRCodeGenerator;