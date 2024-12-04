import Link from "next/link";
import { CalendarIcon, MapPinIcon, UsersIcon, CurrencyDollarIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const navItems = [
    { id: "basic", label: "Basic Info", icon: PhotoIcon },
    { id: "datetime", label: "Date & Time", icon: CalendarIcon },
    { id: "location", label: "Location", icon: MapPinIcon },
    { id: "tickets", label: "Tickets", icon: CurrencyDollarIcon },
    { id: "attendees", label: "Attendees", icon: UsersIcon },
  ];

  return (
    <div className="w-64 bg-base-100 border-r border-base-300">
      <div className="p-4 border-b border-base-300">
        <Link href="/" className="text-2xl font-bold text-primary">
          ZKonnect
        </Link>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200 text-base-content"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}; 