import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: Array<string | { value: string; label: string }>;
}

interface FormSchema {
  formTitle: string;
  formDescription: string;
  fields: FormField[];
}

interface FormPreviewProps {
  schema: FormSchema | null;
}

const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
  const { handleSubmit, control } = useForm();
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode); // Toggle function

  if (!schema) {
    return (
      <div className="p-4 text-gray-500 text-center">
        Please enter a valid JSON schema
      </div>
    );
  }

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
      <div
      className={`overflow-y-auto max-h-full p-4 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
        }`}
    >
      <div
        style={{ backgroundColor: isDarkMode ? '#006A4E' : '#006A4E', padding: '20px' }}
        className={`${isDarkMode ? 'text-gray-200' : 'text-white'}`}
      >
        <div className='flex justify-between'>
          <div>
            <h2 className="text-2xl font-bold mb-2">{schema.formTitle}</h2>
            <p className="mb-6">{schema.formDescription}</p>
          </div>
          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-4 px-2">
            <a
              href="" // Add the desired link here
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                toggleDarkMode(); // Trigger dark mode toggle
              }}
              className="cursor-pointer"
            >
              <img
                src={isDarkMode ? "/light-mode.png" : "/night-mode.png"} // Correct path from the 'public' folder
                alt={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="w-8 h-8" // Adjust size as needed
              />
            </a>
          </div>


        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto p-4 shadow-md rounded-lg">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {schema.fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label
                htmlFor={field.id}
                className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              <Controller
                name={field.id}
                control={control}
                defaultValue=""
                rules={{ required: field.required }}
                render={({ field: controllerField }) => {
                  // Input types
                  if (field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number') {
                    return (
                      <input
                        {...controllerField}
                        type={field.type}
                        id={field.id}
                        placeholder={field.placeholder}
                        className={`block px-2 w-full rounded-md shadow-sm focus:ring-opacity-50 ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-green-500 focus:ring-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                      />
                    );
                  }
                  if (field.type === 'textarea') {
                    return (
                      <textarea
                        {...controllerField}
                        id={field.id}
                        placeholder={field.placeholder}
                        rows={4}
                        className={`block px-2 w-full rounded-md shadow-sm focus:ring-opacity-50 ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-green-500 focus:ring-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                      />
                    );
                  }
                  if (field.type === 'select' && field.options) {
                    return (
                      <select
                        {...controllerField}
                        id={field.id}
                        className={`block px-2 w-full rounded-md shadow-sm focus:ring-opacity-50 ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-green-500 focus:ring-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                      >
                        {field.options.map((option, index) => {
                          const value = typeof option === 'object' ? option.value : option;
                          const label = typeof option === 'object' ? option.label : option;
                          return (
                            <option key={index} value={value}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    );
                  }
                  if (field.type === 'email') {
                    return (
                      <input
                        {...controllerField}
                        type="email"
                        id={field.id}
                        placeholder={field.placeholder}
                        className={`block px-2 w-full rounded-md shadow-sm focus:ring-opacity-50 ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-green-500 focus:ring-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                      />
                    );
                  }
                  if (field.type === 'url') {
                    return (
                      <input
                        {...controllerField}
                        type="url"
                        id={field.id}
                        placeholder={field.placeholder}
                        className={`block px-2 w-full rounded-md shadow-sm focus:ring-opacity-50 ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-green-500 focus:ring-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                      />
                    );
                  }
                  if (field.type === 'date') {
                    return (
                      <input
                        {...controllerField}
                        type="date"
                        id={field.id}
                        className={`block px-2 w-full rounded-md shadow-sm focus:ring-opacity-50 ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-green-500 focus:ring-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                      />
                    );
                  }
                  if (field.type === 'time') {
                    return (
                      <input
                        {...controllerField}
                        type="time"
                        id={field.id}
                        className={`block px-2 w-full rounded-md shadow-sm focus:ring-opacity-50 ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-green-500 focus:ring-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                      />
                    );
                  }
                  if (field.type === 'color') {
                    return (
                      <input
                        {...controllerField}
                        type="color"
                        id={field.id}
                        className={`w-10 px-2 h-10 border-none ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                          }`}
                      />
                    );
                  }
                  if (field.type === 'file') {
                    return (
                      <input
                        {...controllerField}
                        type="file"
                        id={field.id}
                        className={`block px-2 w-full rounded-md shadow-sm focus:ring-opacity-50 ${isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-green-500 focus:ring-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                      />
                    );
                  }
                  if (field.type === 'radio' && field.options) {
                    return (
                      <div className="space-y-2">
                        {field.options.map((option, index) => {
                          const value = typeof option === 'object' ? option.value : option;
                          const label = typeof option === 'object' ? option.label : option;
                          return (
                            <label key={index} className=" px-2 inline-flex items-center space-x-2">
                              <input
                                {...controllerField}
                                type="radio"
                                value={value}
                                className={`form-radio ${isDarkMode
                                  ? 'text-green-500 focus:ring-green-500'
                                  : 'text-blue-500 focus:ring-blue-500'
                                  }`}
                              />
                              <span>{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    );
                  }
                  if (field.type === 'checkbox' && field.options) {
                    return (
                      <div className="space-y-2">
                        {field.options.map((option, index) => {
                          const value = typeof option === 'object' ? option.value : option;
                          const label = typeof option === 'object' ? option.label : option;
                          return (
                            <label key={index} className="inline-flex px-2 items-center space-x-2">
                              <input
                                type="checkbox"
                                value={value}
                                className={`form-checkbox ${isDarkMode
                                  ? 'text-green-500 focus:ring-green-500'
                                  : 'text-blue-500 focus:ring-blue-500'
                                  }`}
                              />
                              <span>{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    );
                  }
                  return <span className="text-red-500">Unsupported field type: {field.type}</span>;
                }}
              />
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode
                ? 'text-white bg-green-700 hover:bg-green-600 focus:ring-green-600'
                : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }`}
              style={{ backgroundColor: isDarkMode ? '#006A4E' : '#006A4E' }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default FormPreview;
