import { StepProps } from "../types";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

export const DateTime = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const isDateTimeValid = () => {
    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);
    return start < end;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Start Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium text-neutral opacity-85 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="startTime" className="text-sm font-medium text-neutral opacity-85 flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={formData.startTime}
            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
            className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          />
        </div>
      </div>

      {/* End Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium text-neutral opacity-85 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            min={formData.startDate || new Date().toISOString().split("T")[0]}
            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
            className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endTime" className="text-sm font-medium text-neutral opacity-85 flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={formData.endTime}
            onChange={e => setFormData({ ...formData, endTime: e.target.value })}
            className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          />
        </div>
      </div>

      {/* Timezone */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <label htmlFor="timezone" className="text-sm font-medium text-neutral opacity-85">
          Timezone
        </label>
        <select
          id="timezone"
          value={formData.timezone}
          onChange={e => setFormData({ ...formData, timezone: e.target.value })}
          className="select select-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
        >
          {Intl.supportedValuesOf("timeZone").map(tz => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {formData.startDate && formData.endDate && formData.startTime && formData.endTime && !isDateTimeValid() && (
        <div className="alert alert-error shadow-md animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <span>End date and time must be after start date and time</span>
        </div>
      )}

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
          disabled={
            !formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime || !isDateTimeValid()
          }
        >
          Next: Location
        </button>
      </div>
    </div>
  );
};
