import { StepProps } from "../types";

export const DateTime = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const isDateTimeValid = () => {
    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);
    return start < end;
  };

  return (
    <div className="space-y-6">
      {/* Start Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium text-base-content/80">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            className="input input-bordered w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="startTime" className="text-sm font-medium text-base-content/80">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={formData.startTime}
            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* End Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium text-base-content/80">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            min={formData.startDate || new Date().toISOString().split("T")[0]}
            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
            className="input input-bordered w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endTime" className="text-sm font-medium text-base-content/80">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={formData.endTime}
            onChange={e => setFormData({ ...formData, endTime: e.target.value })}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Timezone */}
      <div className="space-y-2">
        <label htmlFor="timezone" className="text-sm font-medium text-base-content/80">
          Timezone
        </label>
        <select
          id="timezone"
          value={formData.timezone}
          onChange={e => setFormData({ ...formData, timezone: e.target.value })}
          className="select select-bordered w-full"
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
        <div className="alert alert-error">
          <span>End date and time must be after start date and time</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn btn-outline">
          Back
        </button>
        <button
          onClick={onNext}
          className="btn btn-primary"
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
