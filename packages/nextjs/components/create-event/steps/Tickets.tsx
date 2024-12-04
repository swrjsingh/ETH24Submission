import { StepProps } from "../types";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export const Tickets = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [
        ...formData.ticketTypes,
        {
          id: crypto.randomUUID(),
          name: "",
          price: "",
          quantity: "",
          description: "",
        },
      ],
    });
  };

  const removeTicketType = (id: string) => {
    if (formData.ticketTypes.length === 1) return;
    setFormData({
      ...formData,
      ticketTypes: formData.ticketTypes.filter(ticket => ticket.id !== id),
    });
  };

  const updateTicketType = (id: string, field: keyof (typeof formData.ticketTypes)[0], value: string) => {
    setFormData({
      ...formData,
      ticketTypes: formData.ticketTypes.map(ticket => (ticket.id === id ? { ...ticket, [field]: value } : ticket)),
    });
  };

  const isTicketsValid = () => {
    return formData.ticketTypes.every(
      ticket =>
        ticket.name.trim() !== "" &&
        ticket.price.trim() !== "" &&
        !isNaN(Number(ticket.price)) &&
        ticket.quantity.trim() !== "" &&
        !isNaN(Number(ticket.quantity)) &&
        Number(ticket.quantity) > 0,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-neutral">Ticket Types</h2>
        <button
          onClick={addTicketType}
          className="btn btn-outline btn-accent btn-sm gap-2 shadow-sm hover:shadow-md transition-all duration-200"
          disabled={formData.ticketTypes.length >= 5}
        >
          <PlusIcon className="w-4 h-4" />
          Add Ticket Type
        </button>
      </div>

      {formData.ticketTypes.map((ticket, index) => (
        <div
          key={ticket.id}
          className="bg-base-300/50 p-4 rounded-lg space-y-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-neutral">Ticket Type {index + 1}</h3>
            {formData.ticketTypes.length > 1 && (
              <button
                onClick={() => removeTicketType(ticket.id)}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor={`name-${ticket.id}`} className="text-sm font-medium text-neutral opacity-85">
                Ticket Name
              </label>
              <input
                type="text"
                id={`name-${ticket.id}`}
                value={ticket.name}
                onChange={e => updateTicketType(ticket.id, "name", e.target.value)}
                placeholder="e.g., General Admission"
                className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`price-${ticket.id}`} className="text-sm font-medium text-neutral opacity-85">
                Price (MATIC)
              </label>
              <input
                type="number"
                id={`price-${ticket.id}`}
                value={ticket.price}
                onChange={e => updateTicketType(ticket.id, "price", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor={`quantity-${ticket.id}`} className="text-sm font-medium text-neutral opacity-85">
                Available Quantity
              </label>
              <input
                type="number"
                id={`quantity-${ticket.id}`}
                value={ticket.quantity}
                onChange={e => updateTicketType(ticket.id, "quantity", e.target.value)}
                placeholder="Enter quantity"
                min="1"
                className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`description-${ticket.id}`} className="text-sm font-medium text-neutral opacity-85">
                Description (Optional)
              </label>
              <input
                type="text"
                id={`description-${ticket.id}`}
                value={ticket.description}
                onChange={e => updateTicketType(ticket.id, "description", e.target.value)}
                placeholder="Add description"
                className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="btn btn-outline btn-neutral shadow-sm hover:shadow-md transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="btn btn-primary shadow-sm hover:shadow-md transition-all duration-200"
          disabled={!isTicketsValid()}
        >
          Next: Attendees
        </button>
      </div>
    </div>
  );
};
