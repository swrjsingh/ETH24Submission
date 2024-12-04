import { StepProps } from "../types";

export const Location = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const isLocationValid = () => {
    if (formData.isOnline) {
      return !!formData.onlineLink && formData.onlineLink.trim() !== "";
    }
    return (
      formData.venueName.trim() !== "" &&
      formData.streetAddress.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.state.trim() !== "" &&
      formData.postalCode.trim() !== "" &&
      formData.country.trim() !== ""
    );
  };

  return (
    <div className="space-y-6">
      {/* Event Type Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-base-content/80">Event Type</label>
        <div className="flex gap-4">
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="eventType"
              className="radio radio-primary mr-2"
              checked={!formData.isOnline}
              onChange={() => setFormData({ ...formData, isOnline: false })}
            />
            <span className="label-text">In-Person</span>
          </label>
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="eventType"
              className="radio radio-primary mr-2"
              checked={formData.isOnline}
              onChange={() => setFormData({ ...formData, isOnline: true })}
            />
            <span className="label-text">Online</span>
          </label>
        </div>
      </div>

      {formData.isOnline ? (
        // Online Event Form
        <div className="space-y-2">
          <label htmlFor="onlineLink" className="text-sm font-medium text-base-content/80">
            Event Link
          </label>
          <input
            type="url"
            id="onlineLink"
            value={formData.onlineLink || ""}
            onChange={e => setFormData({ ...formData, onlineLink: e.target.value })}
            placeholder="https://zoom.us/j/..."
            className="input input-bordered w-full"
          />
          <p className="text-xs text-base-content/60">Add the link where attendees can join your online event</p>
        </div>
      ) : (
        // In-Person Event Form
        <>
          <div className="space-y-2">
            <label htmlFor="venueName" className="text-sm font-medium text-base-content/80">
              Venue Name
            </label>
            <input
              type="text"
              id="venueName"
              value={formData.venueName}
              onChange={e => setFormData({ ...formData, venueName: e.target.value })}
              placeholder="Enter venue name"
              className="input input-bordered w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="streetAddress" className="text-sm font-medium text-base-content/80">
              Street Address
            </label>
            <input
              type="text"
              id="streetAddress"
              value={formData.streetAddress}
              onChange={e => setFormData({ ...formData, streetAddress: e.target.value })}
              placeholder="Enter street address"
              className="input input-bordered w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-base-content/80">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter city"
                className="input input-bordered w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium text-base-content/80">
                State/Province
              </label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter state/province"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="postalCode" className="text-sm font-medium text-base-content/80">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                value={formData.postalCode}
                onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="Enter postal code"
                className="input input-bordered w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-base-content/80">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                placeholder="Enter country"
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn btn-outline">
          Back
        </button>
        <button onClick={onNext} className="btn btn-primary" disabled={!isLocationValid()}>
          Next: Tickets
        </button>
      </div>
    </div>
  );
};
