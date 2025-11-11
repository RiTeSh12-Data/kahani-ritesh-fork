import {  useRef, useEffect, useState, type ReactNode } from "react";
import styles from "@/styles/pager.module.css";

interface SwipePagerProps {
  index: number;
  onIndexChange: (newIndex: number) => void;
  children: ReactNode[];
}

export function SwipePager({ index, onIndexChange, children }: SwipePagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, index });
  const isDragHorizontalRef = useRef<boolean | null>(null);

  const maxIndex = children.length - 1;

  const handleStart = (clientX: number, clientY: number) => {
    dragStartRef.current = { x: clientX, y: clientY, index };
    isDragHorizontalRef.current = null;
    setIsDragging(true);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    // Determine direction on first significant movement
    if (isDragHorizontalRef.current === null) {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        isDragHorizontalRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    // Only handle horizontal drags
    if (isDragHorizontalRef.current) {
      setDragOffset(deltaX);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 60;
    let newIndex = index;

    if (dragOffset > threshold && index > 0) {
      newIndex = index - 1;
    } else if (dragOffset < -threshold && index < maxIndex) {
      newIndex = index + 1;
    }

    setDragOffset(0);
    isDragHorizontalRef.current = null;

    if (newIndex !== index) {
      onIndexChange(newIndex);
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
    
    // Only prevent default if horizontal drag is confirmed and significant
    if (isDragHorizontalRef.current && Math.abs(dragOffset) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, index]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (index > 0) onIndexChange(index - 1);
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        if (index < maxIndex) onIndexChange(index + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, maxIndex, onIndexChange]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      data-testid="swipe-pager"
    >
      {children.map((child, i) => {
        const isActive = i === index;
        const offset = (i - index) * 100;
        const transform = isActive && isDragging
          ? `translateX(calc(${offset}% + ${dragOffset}px))`
          : `translateX(${offset}%)`;

        return (
          <div
            key={i}
            className={`${styles.slide} ${isDragging ? styles.dragging : ''}`}
            style={{
              transform,
              zIndex: isActive ? 1 : 0,
            }}
            data-testid={`slide-${i}`}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
