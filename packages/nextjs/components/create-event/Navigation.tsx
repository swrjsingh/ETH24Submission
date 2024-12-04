import Link from "next/link";
import { CalendarIcon, CurrencyDollarIcon, MapPinIcon, PhotoIcon, UsersIcon } from "@heroicons/react/24/outline";

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
    <div className="w-64 bg-base-100 border-r border-base-200 shadow-md animate-fade-in">
      <div className="p-4 border-b border-base-200 bg-base-200/50">
        <Link
          href="/"
          className="text-2xl font-bold text-primary hover:text-primary-focus transition-colors duration-200"
        >
          ZKonnect
        </Link>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={item.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                  activeSection === item.id
                    ? "bg-primary text-primary-content font-medium shadow-md"
                    : "hover:bg-base-200 text-neutral hover:text-neutral-focus"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    activeSection === item.id ? "scale-110" : "group-hover:scale-105"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
