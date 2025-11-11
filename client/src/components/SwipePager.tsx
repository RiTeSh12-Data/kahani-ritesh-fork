import { useState, useRef, useEffect, Children, cloneElement, isValidElement } from 'react';
import styles from '@/styles/pager.module.css';

interface SwipePagerProps {
  index: number;
  onIndexChange: (newIndex: number) => void;
  children: React.ReactNode;
}

export default function SwipePager({ index, onIndexChange, children }: SwipePagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const childrenArray = Children.toArray(children);
  const totalSlides = childrenArray.length;

  const SWIPE_THRESHOLD = 60;

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset > 0 && index > 0) {
        onIndexChange(index - 1);
      } else if (dragOffset < 0 && index < totalSlides - 1) {
        onIndexChange(index + 1);
      }
    }

    setDragOffset(0);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleDragMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && index > 0) {
        onIndexChange(index - 1);
      } else if (e.key === 'ArrowRight' && index < totalSlides - 1) {
        onIndexChange(index + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, totalSlides, onIndexChange]);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {childrenArray.map((child, i) => {
        const offset = (i - index) * 100;
        const transform = `translateX(calc(${offset}% + ${isDragging ? dragOffset : 0}px))`;

        return (
          <div
            key={i}
            className={`${styles.slide} ${isDragging ? styles.dragging : ''}`}
            style={{ transform }}
          >
            {isValidElement(child) ? cloneElement(child) : child}
          </div>
        );
      })}
    </div>
  );
}
