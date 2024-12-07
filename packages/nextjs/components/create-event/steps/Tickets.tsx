import { StepProps } from "../types";

export const Tickets = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const handlePriceChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, "");
    setFormData({
      ...formData,
      ticketPrice: cleanValue,
    });
  };

  const handleMaxAttendeesChange = (value: string) => {
    // Remove any non-numeric characters
    const cleanValue = value.replace(/[^0-9]/g, "");
    setFormData({
      ...formData,
      maxAttendees: parseInt(cleanValue) || 0,
    });
  };

  const isValid = () => {
    const price = parseFloat(formData.ticketPrice);
    return !isNaN(price) && price >= 0 && formData.maxAttendees > 0;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Ticket Price */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <label htmlFor="ticketPrice" className="text-sm font-medium text-neutral opacity-85">
          Ticket Price (ETH)
        </label>
        <input
          type="text"
          id="ticketPrice"
          value={formData.ticketPrice}
          onChange={e => handlePriceChange(e.target.value)}
          className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          placeholder="0.0"
        />
      </div>

      {/* Maximum Attendees */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <label htmlFor="maxAttendees" className="text-sm font-medium text-neutral opacity-85">
          Maximum Attendees
        </label>
        <input
          type="text"
          id="maxAttendees"
          value={formData.maxAttendees || ""}
          onChange={e => handleMaxAttendeesChange(e.target.value)}
          className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          placeholder="Enter maximum number of attendees"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <button
          onClick={onBack}
          className="btn btn-outline btn-neutral shadow-sm hover:shadow-md transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="btn btn-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          disabled={!isValid()}
        >
          Create Event
        </button>
      </div>
    </div>
  );
};
