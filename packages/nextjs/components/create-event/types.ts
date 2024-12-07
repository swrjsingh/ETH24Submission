export interface StepProps {
  formData: EventFormData;
  setFormData: (data: EventFormData) => void;
  onNext: () => void;
  onBack?: () => void;
}

export interface EventFormData {
  name: string;
  description: string;
  imageCID: string;
  startTime: number;
  endTime: number;
  venueName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isOnline: boolean;
  ticketPrice: string;
  maxAttendees: number;
  isPrivate: boolean;
}
