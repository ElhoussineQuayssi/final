"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

const PartnershipCard = ({ name, logo, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full h-64 perspective-1000 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-style-preserve-3d cursor-pointer ${isHovered ? 'scale-105 rotate-y-180' : ''}`}
        style={{ transform: isHovered ? 'scale(1.05) rotateY(180deg)' : 'scale(1) rotateY(0deg)' }}
      >
        {/* Front - Logo */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center p-6">
          {logo ? (
            <div className="relative w-32 h-32">
              <Image
                src={logo}
                alt={`${name} logo`}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-md">
              <Building2 size={48} style={{ color: '#9CA3AF' }} />
            </div>
          )}
        </div>

        {/* Back - Title */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-green-50 border border-gray-200 rounded-lg shadow-sm flex items-center justify-center p-6">
          <h3 className="text-xl font-bold text-gray-800 text-center">
            {name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PartnershipCard;