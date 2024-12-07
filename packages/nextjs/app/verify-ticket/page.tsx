"use client";

import React, { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import jsQR from "jsqr";
import { groth16 } from "snarkjs";
import {QRCodeCanvas} from "qrcode.react"
import { Html5QrcodeScanner } from "html5-qrcode"

// Define types for props
interface PaymentFormProps {
  setLoginDetails: React.Dispatch<React.SetStateAction<loginDetails | null>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ setLoginDetails, setStep }) => {
  const [formData, setFormData] = useState({
    aadhar: '',
    credit_card: '',
    cvv: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginDetails({ ...formData, [name]: value });
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Enter Your Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Aadhar Input */}
          <div>
            <label htmlFor="aadhar" className="block text-gray-700 text-sm font-medium mb-2">Aadhar Number</label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your Aadhar Number"
            />
          </div>

          {/* Credit Card Number Input */}
          <div>
            <label htmlFor="credit_card" className="block text-gray-700 text-sm font-medium mb-2">Credit Card Number</label>
            <input
              type="text"
              id="credit_card"
              name="credit_card"
              value={formData.credit_card}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your Credit Card Number"
            />
          </div>

          {/* CVV Input */}
          <div>
            <label htmlFor="cvv" className="block text-gray-700 text-sm font-medium mb-2">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your CVV"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface QRScannerProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setRandomNumber: React.Dispatch<React.SetStateAction<string | null>>;
}

const QRScanner: React.FC<QRScannerProps> = ({ setStep, setRandomNumber }) => {
  const [file, setFile] = useState<File | null>(null);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onScanSuccess = (decodedText, decodedResult) => {
    setRandomNumber(decodedText);
    setStep(1);
  }

  const onScanError = () => {}

  useEffect(() => {
    // Check if window is defined to ensure this runs only on the client side
    let scanner : string | Html5QrcodeScanner = "";
    if (typeof window !== "undefined") {
      // Create a new instance of Html5QrcodeScanner
      scanner = new Html5QrcodeScanner('qrcode-scanner', {
        fps: 10, // Frames per second for scanning
        qrbox: 250, // Size of the scanning box
      }, false);

      // Start the scanner with a callback function
      scanner.render(onScanSuccess, onScanError);
    }

    // Cleanup the scanner when the component unmounts
    return () => {
      if (typeof window !== "undefined") {
        scanner.clear();
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-sm mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-neutral">Scan a QR Code</h1>
        <p className="text-neutral text-center opacity-75">
            Scan a QR Code using a scanner
        </p>
        <div id="qrcode-scanner"></div>
      </div>
    </div>
  );
};

const stringToAsciiArray = (inputString: string) => {
  return Array.from(inputString).map(char => char.charCodeAt(0));
};

interface QrData {
  aadhar: string;
  credit_card: string;
  cvv: string;
  nonce: string;
}

interface QrPresenterProps {
  qrData: QrData;
}

const QrPresenter: React.FC<QrPresenterProps> = ({ qrData }) => {
  const [loading1, setLoading] = useState<boolean>(true);
  const [loading2, setLoading2] = useState<boolean>(true);
  const [proof, setProof] = useState<any>(null);
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const generateDigitalFingerprint = async (aadhar_number: string, credit_card_number: string, cvv: string) => {
      const data = aadhar_number + credit_card_number + cvv;
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
  
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
      setHash(hashHex);
      setLoading(false);
    };

    const generateProof = async (aadhar_number: string, credit_card_number: string, cvv: string, nonce: string) => {
      try {
        const aadhar_number_ascii_values = stringToAsciiArray(aadhar_number);
        const credit_card_number_ascii_values = stringToAsciiArray(credit_card_number);
        const cvv_ascii_values = stringToAsciiArray(cvv);
        const nonce_ascii_values = stringToAsciiArray(nonce);

        const input = { aadhar_number: aadhar_number_ascii_values, credit_card_number: credit_card_number_ascii_values, cvv: cvv_ascii_values, nonce: nonce_ascii_values };

        const wasmFilePath = "/wasm/sha256_final.wasm";
        const zkeyFilePath = "/zkey/sha256.zkey";

        const { proof, publicSignals } = await groth16.fullProve(input, wasmFilePath, zkeyFilePath);
        setLoading2(false);
        setProof({ proof, publicSignals });
      } catch (error) {
        console.error("Error generating zk Proofs:", error);
      }
    };

    generateDigitalFingerprint(qrData.aadhar, qrData.credit_card, qrData.cvv);
    generateProof(qrData.aadhar, qrData.credit_card, qrData.cvv, qrData.nonce);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-xl mx-auto space-y-6">
        {!loading1 && !loading2 ? <QRCodeCanvas value={JSON.stringify({ hash, proof })} size={350}></QRCodeCanvas> : "Generating QR Code!"}
      </div>
    </div>
  );
};

type loginDetails = {
  aadhar: string;
  credit_card: string;
  cvv: string;
};

const VerificationPage: NextPage = () => {
  const [step, setStep] = useState<number>(0);
  const [randomNumber, setRandomNumber] = useState<string | null>(null);
  const [loginDetails, setLoginDetails] = useState<loginDetails | null>(null);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <QRScanner setStep={setStep} setRandomNumber={setRandomNumber} />;
      case 1:
        return <PaymentForm setLoginDetails={setLoginDetails} setStep={setStep} />;
      case 2:
        return <QrPresenter qrData={{ ...loginDetails, nonce: randomNumber as string }} />;
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
};

export default VerificationPage;
