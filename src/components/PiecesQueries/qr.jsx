import React from "react";
import QRCode from 'qrcode';
import {useState, useEffect} from 'react';

const QrCodeGenerator = ({ Number }) => {

    const [qrCodeData, setQrCodeData] = useState('');

    useEffect(() => {
      QRCode.toDataURL(Number, { errorCorrectionLevel: 'M' })
        .then(url => {
          setQrCodeData(url);
        })
        .catch(err => {
          console.error(err);
        });
    }, [Number]);


    return (
        <div className="text-center my-3 p-0">
          {qrCodeData ? <img src={qrCodeData} alt="QR Code" /> : <p>Loading...</p>}
        </div>
      );
};

export default QrCodeGenerator;