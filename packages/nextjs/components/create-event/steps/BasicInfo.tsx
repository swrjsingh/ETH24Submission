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
    <div className="space-y-8 animate-fade-in">
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral opacity-85">Event Image</label>
        <div className="flex items-center justify-center w-full">
          <label
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-neutral/20 border-dashed 
              rounded-lg cursor-pointer bg-base-200/50 hover:bg-base-300/50 transition-all duration-200
              ${imagePreview ? "p-0 hover:opacity-95" : "p-6 hover:border-primary/30"}`}
          >
            <div className="flex flex-col items-center justify-center h-full w-full">
              {imagePreview ? (
                <div className="relative w-full h-full group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg shadow-medium"
                  />
                  <div className="absolute inset-0 bg-neutral/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <p className="text-base-100 font-medium">Change Image</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <PhotoIcon className="w-12 h-12 text-neutral opacity-50 mb-4 mx-auto" />
                  <p className="mb-2 text-sm text-neutral opacity-85">
                    <span className="font-semibold text-primary hover:text-primary-focus">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-neutral opacity-50">PNG, JPG or GIF (MAX. 5MB)</p>
                </div>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
      </div>

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
      <div className="flex justify-between pt-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <Link href="/" className="btn btn-outline btn-neutral shadow-sm hover:shadow-md transition-all duration-200">
          Cancel
        </Link>
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
