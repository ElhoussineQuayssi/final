"use client"
import { useState, useEffect, useRef } from 'react';

export const useCountAnimation = (endValue, duration = 2000, trigger = true) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  // Parse endValue to number, handling strings like "36+", "6,000+", "10,000+"
  const parseEndValue = (value) => {
    if (typeof value === 'string') {
      // Remove commas and + symbols, then parse
      return parseInt(value.replace(/[,\+]/g, ''), 10);
    }
    return value;
  };

  const finalValue = parseEndValue(endValue);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && trigger) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [trigger]);

  // Animation logic
  useEffect(() => {
    if (!isVisible || !finalValue) return;

    let startTime = null;
    const startValue = 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      const currentValue = Math.floor(startValue + (finalValue - startValue) * easedProgress);
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(finalValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, finalValue, duration]);

  return { count, elementRef };
};