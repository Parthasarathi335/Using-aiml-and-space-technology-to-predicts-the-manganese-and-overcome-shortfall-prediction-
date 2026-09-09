import React from 'react';

export function Card({ title, subtitle, badge, action, children, className = '', noPadding = false }) {
  return (
    <div className={`bg-[#FFFFFF] border border-[#D9D5CA] rounded-sm shadow-sm flex flex-col ${className}`}>
      {(title || subtitle || badge || action) && (
        <div className="px-3.5 py-2.5 border-b border-[#D9D5CA] flex items-center justify-between bg-[#F4F1EA]/50">
          <div>
            {title && (
              <h3 className="text-xs font-semibold tracking-wider text-[#20241F] uppercase font-mono flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-[#687066] mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {badge}
            {action}
          </div>
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-3.5'} flex-1 text-[#20241F]`}>
        {children}
      </div>
    </div>
  );
}
