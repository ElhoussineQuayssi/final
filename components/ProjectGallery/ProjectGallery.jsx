'use client';

import React, { useState } from "react";
import Image from "next/image";
import ImageModal from "@/components/ImageModal/ImageModal";

/**
 * Replacement for ProjectGallery, simple image grid with hover effect and modal.
 */
const ProjectGallery = ({ images, projectTitle, className = "" }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
    <div className={`space-y-4 ${className} scroll-reveal`}>
    <h3
      className="text-2xl font-bold mb-6 pl-3 border-l-4 border-opacity-70"
      style={{ color: "#333333", borderColor: "#6495EDB3" }} // B3 is 70% opacity
    >
      Images de l'Impact
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((imageSrc, index) => {
        // Validate image URL - remove quotes if present
        const cleanUrl = imageSrc && typeof imageSrc === 'string' ? imageSrc.replace(/^"|"$/g, '') : '';
        const validImageSrc = cleanUrl && (cleanUrl.startsWith('http') || cleanUrl.startsWith('/')) ? cleanUrl : null;

        if (!validImageSrc) {
          return (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden shadow-md bg-gray-200 flex items-center justify-center"
            >
              <span className="text-gray-500 text-sm">Image non disponible</span>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden shadow-md group transition duration-300 hover:scale-[1.02] hover:shadow-xl scroll-reveal cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => openModal(index)}
          >
            <Image
              src={validImageSrc}
              alt={`${projectTitle} photo ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="transition duration-300 group-hover:scale-105"
            />
            {/* Use inline style for hover overlay background color */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "#6495ED1A" }} // 1A is 10% opacity
            ></div>
          </div>
        );
      })}
    </div>

    <ImageModal
      isOpen={modalOpen}
      onClose={closeModal}
      images={images}
      currentIndex={currentImageIndex}
      onNext={nextImage}
      onPrevious={previousImage}
      projectTitle={projectTitle}
    />
    </div>
    </>
  );
};

export default ProjectGallery;
