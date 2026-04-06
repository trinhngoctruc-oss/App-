import React from 'react';
import { Element } from '../types';

interface ElementCardProps {
  element: Element;
  onClick: (element: Element) => void;
}

const categoryColors: Record<string, string> = {
  "phi kim lưỡng nguyên tử": "bg-blue-100 border-blue-300 text-blue-800",
  "khí hiếm": "bg-purple-100 border-purple-300 text-purple-800",
  "kim loại kiềm": "bg-red-100 border-red-300 text-red-800",
  "kim loại kiềm thổ": "bg-orange-100 border-orange-300 text-orange-800",
  "á kim": "bg-green-100 border-green-300 text-green-800",
  "phi kim đa nguyên tử": "bg-blue-50 border-blue-200 text-blue-700",
  "kim loại sau chuyển tiếp": "bg-gray-100 border-gray-300 text-gray-800",
  "kim loại chuyển tiếp": "bg-yellow-100 border-yellow-300 text-yellow-800",
  "lanthan": "bg-pink-100 border-pink-300 text-pink-800",
  "actini": "bg-emerald-100 border-emerald-300 text-emerald-800",
  "unknown": "bg-slate-100 border-slate-300 text-slate-800",
};

export const ElementCard: React.FC<ElementCardProps> = ({ element, onClick }) => {
  const colorClass = categoryColors[element.category] || categoryColors.unknown;

  return (
    <div
      onClick={() => onClick(element)}
      className={`
        relative w-full h-full border-2 rounded-lg cursor-pointer 
        transition-all duration-200 hover:scale-105 hover:shadow-lg 
        flex flex-col items-center justify-center p-1 text-center min-h-[80px]
        ${colorClass}
      `}
    >
      <span className="absolute top-1 left-1 text-[10px] font-bold opacity-70">
        {element.number}
      </span>
      <span className="text-lg sm:text-xl font-bold">{element.symbol}</span>
      <span className="text-[10px] sm:text-xs truncate w-full">{element.name}</span>
      <span className="text-[8px] opacity-60">{element.atomic_mass}</span>
    </div>
  );
};
