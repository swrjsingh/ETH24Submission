import { StepProps } from "../types";
import { LockClosedIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export const Attendees = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const addCustomField = () => {
    setFormData({
      ...formData,
      requiredInfo: [
        ...formData.requiredInfo,
        {
          id: crypto.randomUUID(),
          label: "",
          type: "text",
          isRequired: false,
        },
      ],
    });
  };

  const removeCustomField = (id: string) => {
    if (["name", "email"].includes(id)) return; // Can't remove default fields
    setFormData({
      ...formData,
      requiredInfo: formData.requiredInfo.filter(field => field.id !== id),
    });
  };

  const updateRequiredInfo = (id: string, updates: Partial<(typeof formData.requiredInfo)[0]>) => {
    setFormData({
      ...formData,
      requiredInfo: formData.requiredInfo.map(field => (field.id === id ? { ...field, ...updates } : field)),
    });
  };

  const isAttendeesValid = () => {
    const maxAttendeesNum = Number(formData.maxAttendees);
    const totalTickets = formData.ticketTypes.reduce((sum, ticket) => sum + Number(ticket.quantity), 0);

    if (isNaN(maxAttendeesNum) || maxAttendeesNum <= 0) return false;
    if (maxAttendeesNum > totalTickets) return false;

    if (formData.secretIdRequired) {
      const stakeAmount = Number(formData.secretIdStakeAmount);
      if (isNaN(stakeAmount) || stakeAmount <= 0) return false;
    }

    return formData.requiredInfo.every(
      field => field.label.trim() !== "" && (field.type === "custom" ? field.isRequired !== undefined : true),
    );
  };

  return (
    <div className="space-y-6">
      {/* Maximum Attendees */}
      <div className="space-y-2">
        <label htmlFor="maxAttendees" className="text-sm font-medium text-base-content/80">
          Maximum Attendees
        </label>
        <input
          type="number"
          id="maxAttendees"
          value={formData.maxAttendees}
          onChange={e => setFormData({ ...formData, maxAttendees: e.target.value })}
          placeholder="Enter maximum number of attendees"
          min="1"
          className="input input-bordered w-full"
        />
        <p className="text-xs text-base-content/60">
          Cannot exceed total available tickets (
          {formData.ticketTypes.reduce((sum, ticket) => sum + Number(ticket.quantity || 0), 0)})
        </p>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-base-content/80">Event Privacy</label>
        <div className="flex gap-4">
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="privacy"
              className="radio radio-primary mr-2"
              checked={formData.privacyLevel === "public"}
              onChange={() => setFormData({ ...formData, privacyLevel: "public" })}
            />
            <span className="label-text">Public Event</span>
          </label>
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="privacy"
              className="radio radio-primary mr-2"
              checked={formData.privacyLevel === "private"}
              onChange={() => setFormData({ ...formData, privacyLevel: "private" })}
            />
            <span className="label-text">Private Event</span>
          </label>
        </div>
      </div>

      {/* Secret ID Staking */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary mr-2"
              checked={formData.secretIdRequired}
              onChange={e => setFormData({ ...formData, secretIdRequired: e.target.checked })}
            />
            <span className="label-text">Require Secret ID Staking</span>
          </label>
          <LockClosedIcon className="w-4 h-4 text-base-content/50" />
        </div>
        {formData.secretIdRequired && (
          <div className="ml-6">
            <label htmlFor="stakeAmount" className="text-sm font-medium text-base-content/80">
              Stake Amount (MATIC)
            </label>
            <input
              type="number"
              id="stakeAmount"
              value={formData.secretIdStakeAmount}
              onChange={e => setFormData({ ...formData, secretIdStakeAmount: e.target.value })}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        )}
      </div>

      {/* Required Information */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Required Information</h3>
          <button
            onClick={addCustomField}
            className="btn btn-outline btn-sm gap-2"
            disabled={formData.requiredInfo.length >= 5}
          >
            <PlusIcon className="w-4 h-4" />
            Add Custom Field
          </button>
        </div>

        {formData.requiredInfo.map(field => (
          <div key={field.id} className="bg-base-200 p-4 rounded-lg">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={field.label}
                  onChange={e => updateRequiredInfo(field.id, { label: e.target.value })}
                  placeholder="Field Label"
                  className="input input-bordered w-full"
                  disabled={["name", "email"].includes(field.id)}
                />
                {!["name", "email"].includes(field.id) && (
                  <select
                    value={field.type}
                    onChange={e => updateRequiredInfo(field.id, { type: e.target.value as typeof field.type })}
                    className="select select-bordered w-full"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="custom">Custom</option>
                  </select>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={field.isRequired}
                    onChange={e => updateRequiredInfo(field.id, { isRequired: e.target.checked })}
                    disabled={["name", "email"].includes(field.id)}
                  />
                  <span className="label-text ml-2">Required</span>
                </label>
                {!["name", "email"].includes(field.id) && (
                  <button onClick={() => removeCustomField(field.id)} className="btn btn-ghost btn-sm text-error">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn btn-outline">
          Back
        </button>
        <button onClick={onNext} className="btn btn-primary" disabled={!isAttendeesValid()}>
          Create Event
        </button>
      </div>
    </div>
  );
};
