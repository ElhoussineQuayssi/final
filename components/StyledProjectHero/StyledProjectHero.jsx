import React from "react";
import Image from "next/image";

/**
 * Replacement for ProjectHero, using H1 typography and Accent/Primary-Light colors.
 */
const StyledProjectHero = ({ title, excerpt, image, categories }) => (
  // Hero Section Pattern: Use inline style for background color
  <header
    className="py-24 mb-16 rounded-3xl overflow-hidden shadow-2xl scroll-reveal"
    style={{ backgroundColor: "#B0E0E6" }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
      {/* Text Content */}
      <div className="md:order-1 space-y-4">
        {/* H1 Typography Pattern: Use inline styles for dynamic color staggering */}
        <h1
          className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
          style={{ color: "#333333" }}
        >
          {/* Apply accent color staggering using inline style */}
          {title.split(" ").map((word, index) => (
            <span
              key={index}
              style={{ color: index % 2 === 0 ? "#6495ED" : "#333333" }}
            >
              {word}{" "}
            </span>
          ))}
        </h1>
        {/* FIX: Replaced invalid Tailwind opacity class with fixed hex opacity */}
        <p className="text-xl max-w-lg" style={{ color: "#333333E6" }}>
          {excerpt}
        </p>

        {/* Categories (Styled as Accent Pills) */}
        <div className="flex flex-wrap gap-2 pt-4">
          {categories?.map((cat) => (
            <span
              key={cat}
              className="text-xs font-semibold px-3 py-1 rounded-full border border-opacity-30"
              // Use inline styles for background and border colors with hardcoded opacity hex values
              style={{
                backgroundColor: "#6495ED1A",
                color: "#6495ED",
                borderColor: "#6495ED4D",
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Image: Styled with subtle grayscale/opacity for minimalism */}
      <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl md:order-2">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          className="filter grayscale opacity-90 transition duration-500"
        />
        {/* Subtle Accent Detail */}
        <div
          className="absolute inset-0 border-b-8 border-opacity-70 pointer-events-none"
          style={{ borderColor: "#6495ED" }}
        ></div>
      </div>
    </div>
  </header>
);

export default StyledProjectHero;
