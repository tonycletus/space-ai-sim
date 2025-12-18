import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  status?: 'neutral' | 'success' | 'danger';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  unit, 
  subtext,
  status = 'neutral' 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-400 border-green-900/30 bg-green-900/10';
      case 'danger': return 'text-red-400 border-red-900/30 bg-red-900/10';
      default: return 'text-gray-100 border-gray-800 bg-gray-900/50';
    }
  };

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-sm ${getStatusColor()} flex flex-col justify-between h-full`}>
      <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold font-mono tracking-tight">{value}</span>
        {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
      </div>
      {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
    </div>
  );
};