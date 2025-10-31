"use client";

import React, { useState } from "react";
import Image from "next/image";

const TeamMemberCard = ({ name, role, imageSrc, imageAlt, linkedin, email, phone }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 overflow-hidden text-center animate-fade-in border border-gray-100"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        borderBottom: `4px solid #6495ED`,
        animation: `fadeIn 0.8s ease-out forwards`,
        boxShadow: '0 4px 20px rgba(100, 149, 237, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Elegant background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-6 right-6 w-20 h-20 border border-blue-200 rounded-full"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 border border-blue-200 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-blue-100 rounded-full opacity-50"></div>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-3xl">
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
          className="grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
        />

        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <div className="relative p-8">
        <h4 className="font-heading font-heading-medium text-2xl mb-3 transition-colors duration-500 group-hover:text-blue-600 leading-tight" style={{ color: "#333333" }}>
          {name}
        </h4>
        <p
          className="text-base font-body font-body-medium leading-relaxed transition-colors duration-500 mb-4"
          style={{ color: isHovered ? "#6495ED" : "#666666" }}
        >
          {role}
        </p>

        {/* Elegant decorative elements */}
        <div className="flex justify-center items-center space-x-2">
          <div className={`w-8 h-0.5 transition-all duration-700 ${isHovered ? 'bg-blue-500 w-12' : 'bg-gray-300'}`}></div>
          <div className={`w-2 h-2 rounded-full transition-all duration-700 ${isHovered ? 'bg-blue-500 scale-125' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-0.5 transition-all duration-700 ${isHovered ? 'bg-blue-500 w-12' : 'bg-gray-300'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
