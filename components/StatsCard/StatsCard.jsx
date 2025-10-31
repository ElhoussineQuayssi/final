"use client";

import { useCountAnimation } from "@/hooks/useCountAnimation";

const StatsCard = ({ title, value, color, description }) => {
  // Default description if not provided
  const defaultDescription = "Impact mesuré de nos actions";
  const displayDescription = description || defaultDescription;

  // Use the counting animation hook
  const { count, elementRef } = useCountAnimation(value);

  return (
    <div
      ref={elementRef}
      className={`bg-white rounded-xl p-8 shadow-lg border-t-4 text-center transition duration-300 hover:shadow-xl hover:scale-[1.02]`}
      style={{ borderColor: "#6495ED" }}
    >
      <div className="text-3xl font-extrabold mb-2" style={{ color: "#6495ED" }}>
        {count}{typeof value === 'string' && value.includes('+') ? '+' : ''}
      </div>
      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
        {title}
      </div>
      <div className="text-sm text-gray-700">{displayDescription}</div>
    </div>
  );
};

export default StatsCard;
