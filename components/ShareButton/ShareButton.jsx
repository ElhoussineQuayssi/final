import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

/**
 * Share Button Component (Refactored for inline colors)
 */
function ShareButton({ platform, slug, title, excerpt }) {
  // Use a safe fallback for window.location.origin for server-side rendering
  const baseUrl = "https://www.fondationassalam.org";
  const url = `${baseUrl}/blogs/${slug}`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title || "")}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent((title || "") + " - " + (excerpt || ""))}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    instagram: "https://www.instagram.com/fondationassalam", // Direct link to foundation profile
  };

  const platformIcons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
  };

  // Fixed hex colors for social platforms (avoiding Tailwind classes)
  const platformColors = {
    facebook: "#1877F2",
    twitter: "#1DA1F2",
    linkedin: "#0A66C2",
    instagram: "#E4405F",
  };

  const platformLabels = {
    facebook: "Facebook",
    twitter: "X",
    linkedin: "LinkedIn",
    instagram: "Instagram",
  };

  const Icon = platformIcons[platform];
  const color = platformColors[platform];

  return (
    <a
      href={shareUrls[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center transition-colors hover:opacity-80"
      style={{ color: color }}
    >
      <Icon className="w-5 h-5 mr-2" />
      {platformLabels[platform]}
    </a>
  );
}

export default ShareButton;
