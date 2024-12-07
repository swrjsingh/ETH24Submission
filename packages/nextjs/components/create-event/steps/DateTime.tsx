import { StepProps } from "../types";

export const DateTime = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const handleDateTimeChange = (type: "start" | "end", value: string) => {
    const timestamp = Math.floor(new Date(value).getTime() / 1000); // Convert to Unix timestamp (seconds)
    setFormData({
      ...formData,
      [type === "start" ? "startTime" : "endTime"]: timestamp,
    });
  };

  const formatDateTimeForInput = (timestamp: number) => {
    if (!timestamp) return "";
    // Convert Unix timestamp to local datetime string
    const date = new Date(timestamp * 1000);
    return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };

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
          value={formatDateTimeForInput(formData.startTime)}
          onChange={e => handleDateTimeChange("start", e.target.value)}
          className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          min={new Date().toISOString().slice(0, 16)}
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
          value={formatDateTimeForInput(formData.endTime)}
          onChange={e => handleDateTimeChange("end", e.target.value)}
          className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          min={formatDateTimeForInput(formData.startTime || Math.floor(Date.now() / 1000))}
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
          disabled={!formData.startTime || !formData.endTime || formData.endTime <= formData.startTime}
        >
          Next: Location
        </button>
      </div>
    </div>
  );
};
