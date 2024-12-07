"use client";

import React, { useState } from "react";
import { NextPage } from "next";
import jsQR from "jsqr";
import { groth16 } from "snarkjs";
import {createHash} from "crypto";

const PaymentForm = ({setLoginDetails, setStep}) => {
    const [formData, setFormData] = useState({
      aadhar: '',
      creditCardNumber: '',
      cvv: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      const replacement = {...formData, [name]: value}
      setLoginDetails(replacement);
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = (e) => {
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
              <label htmlFor="aadhar" className="block text-gray-700 text-sm font-medium mb-2">
                Aadhar Number
              </label>
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
              <label htmlFor="creditCardNumber" className="block text-gray-700 text-sm font-medium mb-2">
                Credit Card Number
              </label>
              <input
                type="text"
                id="creditCardNumber"
                name="creditCardNumber"
                value={formData.creditCardNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your Credit Card Number"
              />
            </div>
  
            {/* CVV Input */}
            <div>
              <label htmlFor="cvv" className="block text-gray-700 text-sm font-medium mb-2">
                CVV
              </label>
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

const QRScanner = ({setStep}) => {
  const [file, setFile] = useState<File | null>(null);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setQrResult(null);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        // Create a canvas to draw the image
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context?.drawImage(img, 0, 0);

        // Get the image data from the canvas
        const imageData = context!.getImageData(0, 0, canvas.width, canvas.height);

        // Decode the QR code using jsQR
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

        if (qrCode) {
          // If QR code is detected, set the result
          setQrResult(qrCode.data);
          setStep(1);
          console.log(qrCode.data);
        } else {
          setErrorMessage("No QR code found.");
        }
      };
      img.src = event!.target!.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
    <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-sm mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-center text-neutral">Scan a QR Code</h1>
      <p className="text-neutral text-center opacity-75">
        Upload a file to scan a QR code or use a scanner.
      </p>
      <div className="space-y-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
        <button
          onClick={handleUpload}
          className="w-full py-2 px-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition duration-200"
        >
          {file ? "Upload and Scan" : "Choose File"}
        </button>
      </div>
      {file && (
        <div className="text-sm text-gray-600 text-center mt-2">
          Selected file: {file.name}
        </div>
      )}
    </div>
    </div>
  );
};

function stringToAsciiArray(inputString: string) {
    return Array.from(inputString).map(char => char.charCodeAt(0));
}

const generateDigitalFingerprint = async (aadhar_number: string, credit_card_number: string, cvv: string) => {
    const data = aadhar_number + credit_card_number + cvv;
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

const generateProof = async (aadhar_number: string, credit_card_number: string, cvv: string, nonce: string) => {
    try {
        const aadhar_number_ascii_values = stringToAsciiArray(aadhar_number);
        const credit_card_number_ascii_values = stringToAsciiArray(credit_card_number);
        const cvv_ascii_values = stringToAsciiArray(cvv);
        const nonce_ascii_values = stringToAsciiArray(nonce);

        const input = { aadhar_number: aadhar_number_ascii_values, credit_card_number: credit_card_number_ascii_values, cvv: cvv_ascii_values, nonce: nonce_ascii_values };

        console.log(input);

        // Replace with your actual file paths
        const wasmFilePath = "./sha256_final_js/sha256_final.wasm";
        const zkeyFilePath = "./sha256.zkey";

        const { proof, publicSignals } = await groth16.fullProve(input, wasmFilePath, zkeyFilePath);
        return { proof, publicSignals };
    } catch (error) {
        console.error("There was an error in generating the zk Proofs:", error);
        return null;
    }
};



type QrData = {
    aadhar: string,
    credit_card: string,
    cvv: string,
    nonce: string
}
const QrPresenter = ({dataUrl: string}) => {
    return <>
        
    </>
}

type loginDetails = {
    aadhar: string,
    credit_card: string,
    cvv: string
}
const VerificationPage : NextPage = () => {
    const [step, setStep] = useState<number>(0);
    const [randomNumber, setRandomNumber] = useState<number>(-1);
    const [loginDetails, setLoginDetails] = useState<loginDetails | null>(null)

    console.log(loginDetails);

    const renderStep = () => {
        switch (step) {
            case 0: 
                return <QRScanner setStep = {setStep}></QRScanner>
            case 1:
                return <PaymentForm setLoginDetails = {setLoginDetails} setStep = {setStep}></PaymentForm>
            case 2: 
                return <></>
        }
    }

    return (
        <>
            {renderStep()}
        </>
    )
}

export default VerificationPage;
