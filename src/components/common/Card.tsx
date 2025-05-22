import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  children: ReactNode;
}

export function Card({ title, icon: Icon, iconColor, children }: CardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-6 h-6 ${iconColor}`} />
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}