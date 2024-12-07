import { StepProps } from "../types";

export const DateTime = ({ formData, setFormData, onNext, onBack }: StepProps) => {

  const handleDateTimeChange = (type: "start" | "end", value: string) => {
    const localDate = new Date(value);  
    const utcTimestamp = Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes()
    ); 
    setFormData({
      ...formData,
      [type === "start" ? "startTime" : "endTime"]: utcTimestamp / 1000, 
    });
  };

  const formatDateTimeForInput = (timestamp: number) => {
    if (!timestamp) return "";

    const date = new Date(timestamp * 1000); // Convert from Unix timestamp (seconds) to milliseconds
    return date.toISOString().slice(0, 16); // Format as "YYYY-MM-DDThh:mm"
  };

  const startTimeInputValue = formatDateTimeForInput(formData.startTime);
  const endTimeInputValue = formatDateTimeForInput(formData.endTime);

  const isEndTimeInvalid =
    formData.startTime && formData.endTime && formData.endTime <= formData.startTime;

  const isFormValid = formData.startTime && formData.endTime && !isEndTimeInvalid;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Start Time */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <label htmlFor="startTime" className="text-sm font-medium text-neutral opacity-85">
          Start Time
        </label>
        <input
          type="datetime-local"
          id="startTime"
          value={startTimeInputValue}  // Display the value correctly formatted
          onChange={(e) => handleDateTimeChange("start", e.target.value)}
          className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          min={new Date().toISOString().slice(0, 16)}  // Ensures it can't be set to a past time
        />
      </div>

      {/* End Time */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <label htmlFor="endTime" className="text-sm font-medium text-neutral opacity-85">
          End Time
        </label>
        <input
          type="datetime-local"
          id="endTime"
          value={endTimeInputValue}  // Display the value correctly formatted
          onChange={(e) => handleDateTimeChange("end", e.target.value)}
          className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          min={startTimeInputValue || new Date().toISOString().slice(0, 16)}  // Ensure end time can't be before start time
        />
        {isEndTimeInvalid && (
          <p className="text-red-500 text-sm mt-2">End time must be after start time.</p>
        )}
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
          disabled={!isFormValid}
        >
          Next: Location
        </button>
      </div>
    </div>
  );
};
