import React from 'react';

const colorMap = {
  'NOT UPLOADED': 'bg-[#F4F1EA] text-[#687066] border-[#D9D5CA]',
  'UPLOADED': 'bg-[#536B58]/15 text-[#536B58] border-[#536B58]/35',
  'VALIDATING': 'bg-[#B56B32]/15 text-[#B56B32] border-[#B56B32]/40 animate-pulse',
  'READY': 'bg-[#24352B]/15 text-[#24352B] border-[#24352B]/40',
  'ERROR': 'bg-rose-50 text-rose-700 border-rose-200',
  'AWAITING DATA': 'bg-[#B56B32]/15 text-[#B56B32] border-[#B56B32]/40',
  'DEFAULT': 'bg-[#F4F1EA] text-[#20241F] border-[#D9D5CA]'
};

export function Badge({ children, status, className = '' }) {
  const badgeStyle = colorMap[status || children] || colorMap.DEFAULT;
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold border uppercase ${badgeStyle} ${className}`}
    >
      {children}
    </span>
  );
}
