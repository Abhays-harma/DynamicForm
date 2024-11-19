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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSchemaChange = (schema: FormSchema | null) => {
    setFormSchema(schema);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newDividerPosition =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setDividerPosition(Math.min(90, Math.max(10, newDividerPosition))); // Limit range from 10% to 90%
  };

  const handleMouseUp = () => {
    if (isDragging) setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex flex-col md:flex-row relative"
    >
      {/* JSON Editor Section */}
      <div
        className="bg-gray-800 h-full overflow-y-auto"
        style={{
          flexBasis: `${dividerPosition}%`,
          minHeight: '50vh',
        }}
      >
        <JsonEditor onSchemaChange={handleSchemaChange} />
      </div>

      {/* Divider for resizing */}
      <div
        className="bg-gray-600 hover:bg-gray-400 cursor-col-resize md:block hidden"
        style={{ width: '8px' }}
        onMouseDown={() => setIsDragging(true)}
      ></div>

      {/* Form Section */}
      <div
        className="bg-gray-800 h-full overflow-y-auto"
        style={{
          flexBasis: `${100 - dividerPosition}%`,
          minHeight: '50vh',
        }}
      >
        <Form schema={formSchema} />
      </div>
    </div>
  );
};

export default App;
