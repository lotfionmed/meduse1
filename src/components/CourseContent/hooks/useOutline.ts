import { useState, useRef, useEffect } from 'react';

export const useOutline = () => {
  const [showOutline, setShowOutline] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const questionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const outlineRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        outlineRef.current && 
        !outlineRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setShowOutline(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = questionsRef.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    questionsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return {
    showOutline,
    setShowOutline,
    activeSection,
    outlineRef,
    menuButtonRef,
    questionsRef
  };
};