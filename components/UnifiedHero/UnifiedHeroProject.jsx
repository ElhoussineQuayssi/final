"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useProjects } from '@/hooks/useProjects';

// Define the interval for the automatic slideshow (7 seconds)
const SLIDESHOW_INTERVAL = 7000;


const HeroProject = ({ title, description, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { projects, isLoading } = useProjects();

  // Generate optimized random images from projects if none provided
  const getRandomImages = () => {
    if (!projects || projects.length === 0) return [];

    // Collect all project images
    const allImages = [];
    projects.forEach(project => {
        if (project.project_images && project.project_images.length > 0) {
            project.project_images.forEach(img => {
                if (img.image_url) {
                    const cleanUrl = img.image_url.replace(/^"|"$/g, '');
                    if (cleanUrl && cleanUrl.startsWith('http')) {
                        allImages.push(cleanUrl);
                    }
                }
            });
        }
        // Also include main project image
        if (project.image) {
            const cleanUrl = project.image.replace(/^"|"$/g, '');
            if (cleanUrl && cleanUrl.startsWith('http')) {
                allImages.push(cleanUrl);
            }
        }
    });

    // Shuffle and take up to 10 random high-quality images for better performance
    const shuffled = allImages.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  // Determine which images to use
  const displayImages = images && images.length > 0 ? images : getRandomImages();

  // Function to move to the next slide, wrapped in useCallback for efficiency
  const goToNext = useCallback(() => {
    if (!displayImages || displayImages.length === 0) return;
    const isLastSlide = currentIndex === displayImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, displayImages?.length]);

  // Effect for the automatic slideshow timer
  useEffect(() => {
    if (!isPaused && displayImages && displayImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
        );
      }, SLIDESHOW_INTERVAL);

      return () => clearInterval(timer);
    }
  }, [currentIndex, isPaused, displayImages]);

  // Handler for navigation button clicks
  const handleNavClick = (index) => {
    setCurrentIndex(index);
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      {displayImages.map((imageUrl, index) => (
        <div
          key={index}
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
            transition: `opacity 1500ms ease-in-out`
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-5" />
      <div className="absolute inset-0 bg-black/40 z-6" />
      <div className="absolute inset-0 bg-blue-500/25 z-10" />

      {/* Centered Content */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="animate-fade-in-up-custom max-w-4xl text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-blue-300" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            {title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-light text-blue-100/90 mb-8 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
            {description}
          </p>
        </div>
      </div>

      {/* Timeline Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 z-20">
        <div
          className="max-w-4xl mx-auto flex w-full gap-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(index)}
              className="group flex-1 h-2 bg-blue-500/20 backdrop-blur-sm rounded-full cursor-pointer transition-all duration-300 hover:bg-blue-500/40"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{
                  width: index === currentIndex ? '100%' : (index < currentIndex ? '100%' : '0%'),
                  transition: 'width 0.3s ease-in-out'
                }}
              >
                {/* The animation element that fills up over the interval */}
                {index === currentIndex && !isPaused && (
                  <div className="h-full bg-blue-300/80 rounded-full animate-fill-progress" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroProject;