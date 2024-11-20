import React, { useState, useEffect, useRef } from 'react';
import JsonEditor from './components/JsonEditor';
import Form from './components/FormGenerator';

interface FormSchema {
  formTitle: string;
  formDescription: string;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    required: boolean;
    placeholder?: string;
  }>;
}

const App = () => {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(50); // Percentage for split
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSchemaChange = (schema: FormSchema | null) => {
    setFormSchema(schema);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let newPosition;

    if (isSmallScreen) {
      // Calculate vertical position for small screens
      newPosition = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    } else {
      // Calculate horizontal position for larger screens
      newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    }

    // Limit range from 10% to 90%
    setDividerPosition(Math.min(90, Math.max(10, newPosition)));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const touch = e.touches[0];
    const containerRect = containerRef.current.getBoundingClientRect();
    let newPosition;

    if (isSmallScreen) {
      newPosition = ((touch.clientY - containerRect.top) / containerRect.height) * 100;
    } else {
      newPosition = ((touch.clientX - containerRect.left) / containerRect.width) * 100;
    }

    setDividerPosition(Math.min(90, Math.max(10, newPosition)));
  };

  const handleMouseUp = () => {
    if (isDragging) setIsDragging(false);
  };

  const handleTouchEnd = () => {
    if (isDragging) setIsDragging(false);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isSmallScreen]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex flex-col md:flex-row relative"
    >
      <div
        className="bg-gray-800 overflow-y-auto"
        style={{
          [isSmallScreen ? 'height' : 'flexBasis']: `${dividerPosition}%`,
          minHeight: isSmallScreen ? '10vh' : '50vh',
        }}
      >
        <JsonEditor onSchemaChange={handleSchemaChange} />
      </div>
      <div
        className={`bg-gray-600 hover:bg-gray-400 ${
          isSmallScreen ? 'cursor-row-resize h-2 w-full' : 'cursor-col-resize w-2 h-full'
        }`}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      ></div>
      
      <div
        className="bg-gray-800 overflow-y-auto"
        style={{
          [isSmallScreen ? 'height' : 'flexBasis']: `${100 - dividerPosition}%`,
          minHeight: isSmallScreen ? '10vh' : '50vh',
        }}
      >
        <Form schema={formSchema} />
      </div>
    </div>
  );
};

export default App;