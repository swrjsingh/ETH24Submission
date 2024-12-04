import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Layout = ({ children, activeSection, onSectionChange }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <Navigation activeSection={activeSection} onSectionChange={onSectionChange} />

      <div className="flex-1 p-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-neutral">Create New Event</h1>
          <p className="text-neutral opacity-85 mb-8">Fill in the details below to create your event</p>

          <div className="bg-base-100/95 backdrop-blur-sm rounded-xl p-8 shadow-medium hover:shadow-strong transition-all duration-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
