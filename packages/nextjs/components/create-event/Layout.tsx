import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Layout = ({ children, activeSection, onSectionChange }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-base-200">
      <Navigation activeSection={activeSection} onSectionChange={onSectionChange} />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
          
          <div className="bg-base-100 rounded-box p-6 shadow-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 