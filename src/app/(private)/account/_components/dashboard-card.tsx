import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  name: string;
  description: string;
  value: number;
  isCurrency?: boolean;
  icon?: LucideIcon;
  color?: string;
}

function DashboardCard({
  name,
  description,
  value,
  isCurrency = false,
  icon: Icon,
  color = "from-orange-400 to-orange-600",
}: DashboardCardProps) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className={`absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r ${color}`}></div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          {Icon && (
            <div className={`p-2 rounded-full bg-gradient-to-r ${color} bg-opacity-10 text-white`}>
              <Icon size={20} />
            </div>
          )}
        </div>
        
        <h1 className="text-4xl font-bold mt-4 mb-2">
          {isCurrency ? `₹${Number(value).toLocaleString()}` : Number(value).toLocaleString()}
        </h1>
      </div>
    </div>
  );
}

export default DashboardCard;
