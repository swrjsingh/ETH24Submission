import { StepProps } from "../types";

export const BasicInfo = ({ formData, setFormData, onNext }: StepProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Event Name */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <label htmlFor="name" className="text-sm font-medium text-neutral opacity-85">
          Event Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          placeholder="Enter event name"
        />
      </div>

      {/* Event Description */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <label htmlFor="description" className="text-sm font-medium text-neutral opacity-85">
          Event Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="textarea textarea-bordered w-full h-32 bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
          placeholder="Describe your event..."
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end pt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <button
          onClick={onNext}
          className="btn btn-primary shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          disabled={!formData.name || !formData.description}
        >
          Next: Date & Time
        </button>
      </div>
    </div>
  );
};
