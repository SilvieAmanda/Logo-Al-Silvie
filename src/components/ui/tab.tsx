// src/components/ui/tab.tsx
import React, { useState, createContext, useContext, ReactNode } from "react";

interface TabsContextType {
  activeValue: string;
  setActiveValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: ReactNode;
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [activeValue, setActiveValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
  return <div className={className}>{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs");
  }

  const { activeValue, setActiveValue } = context;
  const isActive = activeValue === value;

  return (
    <button
      onClick={() => setActiveValue(value)}
      className={`px-4 py-2 rounded ${
        isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
      }`}
      type="button"
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs");
  }

  const { activeValue } = context;

  if (activeValue !== value) return null;

  return <div className={className}>{children}</div>;
}
