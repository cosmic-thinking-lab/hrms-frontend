import { useEffect, useRef, useState } from 'react';

// Hook for scroll-triggered animations
export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

// Hook for staggered animations
export const useStaggerAnimation = (delay = 100) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, shouldAnimate];
};

// Hook for smooth page transitions
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return [isTransitioning, startTransition];
};