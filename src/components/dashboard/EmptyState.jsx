import React from 'react';
import { AlertTriangle, Database, Cpu, Layers } from 'lucide-react';

export function EmptyState({
  title,
  message,
  actionText,
  onAction,
  icon: Icon = Database,
  variant = 'default'
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#D9D5CA] rounded-sm bg-[#F4F1EA]/60">
      <div className="p-3 bg-[#FFFFFF] border border-[#D9D5CA] rounded-full text-[#687066] mb-3 shadow-sm">
        <Icon className="w-6 h-6 text-[#687066]" />
      </div>
      <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#20241F] mb-1.5">
        {title}
      </h4>
      <p className="text-xs text-[#687066] max-w-sm leading-relaxed mb-4">
        {message}
      </p>
      {actionText && (
        <button
          onClick={onAction}
          className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-medium text-white bg-[#24352B] hover:bg-[#2e4335] border border-[#24352B] rounded transition-colors cursor-pointer shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
