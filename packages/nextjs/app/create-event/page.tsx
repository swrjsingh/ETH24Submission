"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseEther } from "viem";
import { BasicInfo } from "~/components/create-event/steps/BasicInfo";
import { DateTime } from "~/components/create-event/steps/DateTime";
import { Location } from "~/components/create-event/steps/Location";
import { Tickets } from "~/components/create-event/steps/Tickets";
import { EventFormData } from "~/components/create-event/types";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const CreateEvent = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    startTime: 0,
    endTime: 0,
    venueName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    ticketPrice: "",
    maxAttendees: 0,
  });

  const { writeContractAsync, isMining } = useScaffoldWriteContract("CreateEvent" as any);

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // @ts-ignore - Contract call is valid but TypeScript is having trouble with the types
        const tx = await writeContractAsync({
          functionName: "createEvent",
          args: [
            formData.name,
            formData.description,
            BigInt(formData.startTime),
            BigInt(formData.endTime),
            formData.venueName,
            formData.streetAddress,
            formData.city,
            formData.state,
            formData.postalCode,
            formData.country,
            parseEther(formData.ticketPrice || "0"),
            BigInt(formData.maxAttendees),
          ],
        });

        console.log("Transaction hash:", tx);
        notification.success("Event creation transaction sent! Hash: " + tx);
        router.push("/create-event/viewAll");
      } catch (error) {
        console.error("Failed to create event:", error);
        notification.error("Failed to create event: " + (error as Error).message);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfo formData={formData} setFormData={setFormData} onNext={handleNext} />;
      case 2:
        return <DateTime formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Location formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Tickets formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Create Event</h1>
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`w-1/4 text-center ${currentStep === step ? "text-primary font-bold" : "text-neutral-500"}`}
              >
                {step === 1 && "Basic Info"}
                {step === 2 && "Date & Time"}
                {step === 3 && "Location"}
                {step === 4 && "Tickets"}
              </div>
            ))}
          </div>
        </div>
        {renderStep()}
      </div>
      {isMining && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-base-200 p-4 rounded-lg shadow-lg">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-2">Creating event...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
