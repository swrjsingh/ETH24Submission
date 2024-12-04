export interface TicketType {
  id: string;
  name: string;
  price: string;
  quantity: string;
  description: string;
}

export interface RequiredInfo {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "custom";
  isRequired: boolean;
}

export interface EventFormData {
  name: string;
  description: string;
  image: File | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  venueName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isOnline: boolean;
  onlineLink?: string;
  ticketTypes: TicketType[];
  maxAttendees: string;
  requiredInfo: RequiredInfo[];
  privacyLevel: "public" | "private";
  secretIdRequired: boolean;
  secretIdStakeAmount: string;
}

export interface StepProps {
  formData: EventFormData;
  setFormData: (data: EventFormData) => void;
  onNext: () => void;
  onBack?: () => void;
} 