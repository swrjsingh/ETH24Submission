"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "~/components/create-event/Layout";
import { Attendees } from "~/components/create-event/steps/Attendees";
import { BasicInfo } from "~/components/create-event/steps/BasicInfo";
import { DateTime } from "~/components/create-event/steps/DateTime";
import { Location } from "~/components/create-event/steps/Location";
import { Tickets } from "~/components/create-event/steps/Tickets";
import { EventFormData } from "~/components/create-event/types";

const CreateEvent = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("basic");
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    image: null,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    venueName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isOnline: false,
    ticketTypes: [
      {
        id: crypto.randomUUID(),
        name: "",
        price: "",
        quantity: "",
        description: "",
      },
    ],
    maxAttendees: "",
    requiredInfo: [
      { id: "name", label: "Full Name", type: "text", isRequired: true },
      { id: "email", label: "Email", type: "email", isRequired: true },
    ],
    privacyLevel: "public",
    secretIdRequired: false,
    secretIdStakeAmount: "0",
  });

  const handleNext = () => {
    const sections = ["basic", "datetime", "location", "tickets", "attendees"];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    } else {
      // Handle form submission
      console.log("Form submitted:", formData);
      // TODO: Implement blockchain interaction
    }
  };

  const handleBack = () => {
    const sections = ["basic", "datetime", "location", "tickets", "attendees"];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    const commonProps = {
      formData,
      setFormData,
      onNext: handleNext,
      onBack: handleBack,
    };

    const StepComponent = (() => {
      switch (activeSection) {
        case "basic":
          return <BasicInfo {...commonProps} />;
        case "datetime":
          return <DateTime {...commonProps} />;
        case "location":
          return <Location {...commonProps} />;
        case "tickets":
          return <Tickets {...commonProps} />;
        case "attendees":
          return <Attendees {...commonProps} />;
        default:
          return (
            <div className="text-center space-y-4 animate-fade-in">
              <p className="text-neutral opacity-85">
                Select a section from the left menu to continue creating your event.
              </p>
              <button
                onClick={() => setActiveSection("basic")}
                className="btn btn-primary btn-sm shadow-sm hover:shadow-md transition-all duration-200"
              >
                Start with Basic Info
              </button>
            </div>
          );
      }
    })();

    return (
      <div className="animate-fade-in" key={activeSection}>
        {StepComponent}
      </div>
    );
  };

  return (
    <Layout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderStep()}
    </Layout>
  );
};

export default CreateEvent;
