import React, { useState, useRef } from 'react';

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

interface JsonEditorProps {
  onSchemaChange: (schema: FormSchema | null) => void;
}

const defaultSchema: FormSchema = {
  formTitle: "Project Requirements Survey",
  formDescription: "Please fill out this survey about your project needs",
  fields: [
    {
      id: "name",
      type: "text",
      label: "Full Name",
      required: true,
      placeholder: "Enter your full name"
    }
  ]
};

const JsonEditor: React.FC<JsonEditorProps> = ({ onSchemaChange }) => {
  const [code, setCode] = useState<string>(JSON.stringify(defaultSchema, null, 2));
  const [error, setError] = useState<string>('');
  const [lineCount, setLineCount] = useState<number>(code.split('\n').length);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getIndentation = (text: string, position: number): number => {
    const lastNewLine = text.lastIndexOf('\n', position - 1);
    const currentLine = text.slice(lastNewLine + 1, position);
    const match = currentLine.match(/^\s*/);
    return match ? match[0].length : 0;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    const autoClosePairs: { [key: string]: string } = {
      '{': '}',
      '[': ']',
      '"': '"'
    };

    if (autoClosePairs[e.key]) {
      e.preventDefault();
      const closingChar = autoClosePairs[e.key];
      const newValue =
        value.slice(0, selectionStart) +
        e.key +
        (selectionStart === selectionEnd ? closingChar : '') +
        value.slice(selectionEnd);

      setCode(newValue);

      setTimeout(() => {
        textarea.setSelectionRange(selectionStart + 1, selectionStart + 1);
      }, 0);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const currentIndentation = getIndentation(value, selectionStart);
      const lastChar = value[selectionStart - 1];
      const extraIndent = (lastChar === '{' || lastChar === '[') ? 2 : 0;
      const spaces = ' '.repeat(currentIndentation + extraIndent);
      const newValue =
        value.slice(0, selectionStart) +
        '\n' +
        spaces +
        value.slice(selectionEnd);

      setCode(newValue);
      setLineCount(newValue.split('\n').length);

      setTimeout(() => {
        textarea.setSelectionRange(
          selectionStart + 1 + spaces.length,
          selectionStart + 1 + spaces.length
        );
      }, 0);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const spaces = '  ';
      const newValue =
        value.slice(0, selectionStart) +
        spaces +
        value.slice(selectionEnd);

      setCode(newValue);

      setTimeout(() => {
        textarea.setSelectionRange(
          selectionStart + spaces.length,
          selectionStart + spaces.length
        );
      }, 0);
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCode(newValue);
    setLineCount(newValue.split('\n').length);

    try {
      const parsed = JSON.parse(newValue);
      if (!parsed.formTitle || !parsed.formDescription || !Array.isArray(parsed.fields)) {
        throw new Error('Invalid schema structure. Must include formTitle, formDescription, and fields array.');
      }
      onSchemaChange(parsed as FormSchema);
      setError('');
    } catch (err) {
      onSchemaChange(null);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const formatCode = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(code), null, 2);
      setCode(formatted);
      setLineCount(formatted.split('\n').length);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert('JSON copied to clipboard!');
    });
  };

  const downloadJSON = () => {
    const blob = new Blob([code], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col border border-gray-300 bg-gray-900 overflow-hidden">
      <div className="bg-gray-800 px-2 py-1 flex items-center justify-between border-b border-gray-700">
        <div className="text-gray-300 text-sm font-mono">form-schema.json</div>
        <div className="flex space-x-2">
          <button 
            onClick={formatCode}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Format
          </button>
          <button 
            onClick={copyToClipboard}
            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Copy
          </button>
          <button 
            onClick={downloadJSON}
            className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="absolute top-0 left-0 bottom-0 w-12 bg-gray-800 text-gray-500 text-right pr-2 py-1 select-none font-mono text-sm">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-1 pl-14 resize-none focus:outline-none leading-6"
          spellCheck={false}
          style={{
            tabSize: 2,
          }}
        />
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-300 px-2 py-1 text-xs font-mono border-t border-red-800">
          {error}
        </div>
      )}
    </div>
  );
};

export default JsonEditor;
