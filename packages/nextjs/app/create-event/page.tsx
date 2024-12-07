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

  const { writeContractAsync, isMining } = useScaffoldWriteContract("EventTicketing");

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const tx = await writeContractAsync({
          functionName: "createEvent",
          args: [
            {
              name: formData.name,
              description: formData.description,
              startTime: BigInt(formData.startTime),
              endTime: BigInt(formData.endTime),
              venueName: formData.venueName,
              streetAddress: formData.streetAddress,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: formData.country,
              ticketPrice: parseEther(formData.ticketPrice || "0"),
              maxAttendees: BigInt(formData.maxAttendees),
            },
          ],
        });
        console.log("Transaction hash:", tx);
        notification.success("Event creation transaction sent! Hash: " + tx);
        //router.push("/events");
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

  const stepProps = {
    formData,
    setFormData,
    onNext: handleNext,
    onBack: handleBack,
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Create New Event</h1>
        <div className="flex justify-center items-center space-x-4">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === currentStep
                    ? "bg-primary text-primary-content"
                    : step < currentStep
                      ? "bg-success text-success-content"
                      : "bg-base-300 text-base-content"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              {step < 4 && <div className={`w-16 h-1 ${step < currentStep ? "bg-success" : "bg-base-300"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-base-200 rounded-xl p-6 shadow-lg">
        {currentStep === 1 && <BasicInfo {...stepProps} />}
        {currentStep === 2 && <DateTime {...stepProps} />}
        {currentStep === 3 && <Location {...stepProps} />}
        {currentStep === 4 && <Tickets {...stepProps} />}
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