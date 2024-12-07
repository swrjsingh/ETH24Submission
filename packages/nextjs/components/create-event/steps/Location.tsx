import { StepProps } from "../types";

export const Location = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Online/Offline Toggle */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <label className="text-sm font-medium text-neutral opacity-85">Event Type</label>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={formData.isOnline}
              onChange={e => setFormData({ ...formData, isOnline: e.target.checked })}
            />
            <span className="label-text">This is an online event</span>
          </label>
        </div>
      </div>

      {!formData.isOnline && (
        <>
          {/* Venue Name */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <label htmlFor="venueName" className="text-sm font-medium text-neutral opacity-85">
              Venue Name
            </label>
            <input
              type="text"
              id="venueName"
              value={formData.venueName}
              onChange={e => setFormData({ ...formData, venueName: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
              placeholder="Enter venue name"
            />
          </div>

          {/* Street Address */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <label htmlFor="streetAddress" className="text-sm font-medium text-neutral opacity-85">
              Street Address
            </label>
            <input
              type="text"
              id="streetAddress"
              value={formData.streetAddress}
              onChange={e => setFormData({ ...formData, streetAddress: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
              placeholder="Enter street address"
            />
          </div>

          {/* City */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <label htmlFor="city" className="text-sm font-medium text-neutral opacity-85">
              City
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
              placeholder="Enter city"
            />
          </div>

          {/* State */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <label htmlFor="state" className="text-sm font-medium text-neutral opacity-85">
              State/Province
            </label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
              placeholder="Enter state/province"
            />
          </div>

          {/* Postal Code */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <label htmlFor="postalCode" className="text-sm font-medium text-neutral opacity-85">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode}
              onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
              placeholder="Enter postal code"
            />
          </div>

          {/* Country */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.7s" }}>
            <label htmlFor="country" className="text-sm font-medium text-neutral opacity-85">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={e => setFormData({ ...formData, country: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 focus:border-primary"
              placeholder="Enter country"
            />
          </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 animate-slide-up" style={{ animationDelay: "0.8s" }}>
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
            !formData.isOnline &&
            (!formData.venueName ||
              !formData.streetAddress ||
              !formData.city ||
              !formData.state ||
              !formData.postalCode ||
              !formData.country)
          }
        >
          Next: Tickets
        </button>
      </div>
    </div>
  );
};
