import { useState } from "react";
import Link from "next/link";
import { StepProps } from "../types";
import { PhotoIcon } from "@heroicons/react/24/outline";

export const BasicInfo = ({ formData, setFormData, onNext }: StepProps) => {
  const [imagePreview, setImagePreview] = useState<string>(formData.image ? URL.createObjectURL(formData.image) : "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-base-content/80">Event Image</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-base-300 border-dashed rounded-lg cursor-pointer hover:bg-base-200 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <PhotoIcon className="w-12 h-12 text-base-content/50 mb-4" />
                  <p className="mb-2 text-sm text-base-content/70">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-base-content/50">PNG, JPG or GIF (MAX. 5MB)</p>
                </>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      {/* Event Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-base-content/80">
          Event Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="input input-bordered w-full"
          placeholder="Enter event name"
        />
      </div>

      {/* Event Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-base-content/80">
          Event Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="textarea textarea-bordered w-full h-32"
          placeholder="Describe your event..."
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Link href="/" className="btn btn-outline">
          Cancel
        </Link>
        <button onClick={onNext} className="btn btn-primary" disabled={!formData.name || !formData.description}>
          Next: Date & Time
        </button>
      </div>
    </div>
  );
};
