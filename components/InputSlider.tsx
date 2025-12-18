import React from 'react';
import { Info } from 'lucide-react';

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  tooltip: string;
  disabled?: boolean;
}

export const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  tooltip,
  disabled = false
}) => {
  return (
    <div className={`mb-6 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300">{label}</label>
          <div className="group relative">
            <Info size={14} className="text-gray-500 cursor-help" />
            <div className="absolute left-0 bottom-6 w-48 p-2 bg-gray-800 border border-gray-700 rounded text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        </div>
        <span className="text-sm font-bold text-cyan-400 font-mono">
          {value} <span className="text-gray-500 text-xs">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
      />
    </div>
  );
};