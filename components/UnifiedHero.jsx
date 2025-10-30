"use client";

import React, { useState, useEffect } from "react";
import { Heart, Users, Target, ChevronDown } from "lucide-react";

// --- Sub-Components (Concise & Grouped) ---

// 1. Animated Background Pattern
const BackgroundPattern = () => (
    <div className="absolute inset-0 opacity-15" aria-hidden="true">
        {[20, 50, 80, 45, 70, 95].map((top, i) => (
            <div
                key={i}
                className={`absolute bg-white rounded-full animate-pulse-slow`}
                style={{
                    top: `${top}%`,
                    left: `${i * 15}%`,
                    width: `${10 + i * 2}px`,
                    height: `${10 + i * 2}px`,
                    animationDelay: `${i * 0.5}s`,
                    filter: 'blur(1px)'
                }}
            />
        ))}
    </div>
);

// 2. Decorative Icons
const DecorativeIcons = () => (
    <div className="flex justify-center space-x-6 mb-8 opacity-90" aria-hidden="true">
        {[Heart, Users, Target].map((Icon, i) => (
            <div
                key={i}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full transition duration-300 hover:scale-110"
                style={{ animation: `stagger-fade-in 0.8s ease-out ${0.1 + i * 0.1}s both` }}
            >
                <Icon className="w-6 h-6 text-white" />
            </div>
        ))}
    </div>
);

// 3. Scroll Indicator
const ScrollIndicator = () => (
    <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-80 animate-bounce transition-opacity duration-500"
        aria-hidden="true"
    >
        <ChevronDown className="w-6 h-6 text-white" />
    </div>
);

// 4. Background Image Slideshow
const BackgroundSlideshow = ({ images, currentIndex }) => {
    if (!images || images.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                    aria-hidden="true"
                />
            ))}
            {/* Overlay for better text readability with light blue background */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(176, 224, 230, 0.7), rgba(100, 149, 237, 0.7))'
                }}
            />
        </div>
    );
};

// --- Main Component ---

/**
 * UnifiedHero Component
 * Enhanced hero section with background image slideshow based on AboutHeader design.
 * Features automatic image transitions, gradient overlay, staggered text animations, decorative icons, and scroll indicator.
 *
 * @param {string} title - The main heading text
 * @param {string} subtitle - The subtitle text
 * @param {string[]} [images] - Array of background image URLs for slideshow
 * @returns {JSX.Element} The rendered hero component
 */
const UnifiedHero = ({ title, subtitle, images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Add prop validation and default values
    const safeTitle = title || "Assalam - Ensemble pour un avenir meilleur";
    const safeSubtitle = subtitle || "Une fondation marocaine dédiée à l'amélioration des conditions de vie, à l'éducation et au développement durable au Maroc.";
    const words = safeTitle.split(" ");

    // Preload images for smooth transitions
    useEffect(() => {
        if (images && images.length > 0) {
            images.forEach((image) => {
                const img = new Image();
                img.src = image;
            });
        }
    }, [images]);

    // Automatic slideshow transitions
    useEffect(() => {
        if (images && images.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === images.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000); // Change every 3 seconds

            return () => clearInterval(interval);
        }
    }, [images]);

    const hasImages = images && images.length > 0;

    return (
        <header
                className="relative h-screen overflow-hidden shadow-2xl bg-blue-50"
                style={{
                    background: hasImages
                        ? undefined // Use background images
                        : "linear-gradient(135deg, #B0E0E6 0%, #87CEEB 50%, #6495ED 100%)",
                    minHeight: '100vh'
                }}
                role="banner"
            >
            {/* Background Slideshow or Gradient */}
            {hasImages ? (
                <BackgroundSlideshow images={images} currentIndex={currentIndex} />
            ) : null}

            {/* Custom Keyframes for Staggered Animation - Moved to globals.css */}

            {/* 1. Animated Background */}
            <BackgroundPattern />

            {/* 2. Main Content Container */}
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center justify-center h-full">

                {/* Decorative Icons */}
                <DecorativeIcons />

                {/* Main Title (Enhanced Staggered Reveal) */}
                <h1
                    className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white"
                    aria-label={safeTitle}
                >
                    {words.map((word, index) => (
                        <span
                            key={index}
                            className={`mx-1 inline-block transition-transform duration-300 hover:scale-105 ${
                                index % 2 === 0 ? "text-white drop-shadow-lg" : "text-blue-900"
                            }`}
                            style={{
                                // Apply the staggered animation using the custom keyframe
                                animation: `stagger-fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 + index * 0.1}s both`,
                                textShadow: index % 2 === 0 ? "2px 2px 4px rgba(0,0,0,0.3)" : "none",
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </h1>

                {/* Subtitle (Simplified and Inlined) */}
            <div className="max-w-3xl mx-auto">
                <p
                    className="text-lg md:text-xl text-blue-900 font-medium leading-relaxed opacity-0"
                    style={{ animation: "stagger-fade-in 0.8s ease-out 1.2s forwards" }}
                >
                    {safeSubtitle}
                </p>

                    {/* Decorative separator line */}
                    <div
                        className="w-16 h-1 mt-6 bg-white mx-auto rounded-full shadow-md opacity-0"
                        style={{ animation: "stagger-fade-in 0.8s ease-out 1.4s forwards" }}
                        aria-hidden="true"
                    />
                </div>
            </div>

            {/* 3. Scroll Indicator */}
            <ScrollIndicator />
        </header>
    );
};

export default UnifiedHero;