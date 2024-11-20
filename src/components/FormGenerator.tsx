import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Moon, Sun } from 'lucide-react';

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
          className={`${isDarkMode ? 'text-gray-200 w-full' : 'text-white w-full'}`}
        >
          <div className='flex justify-between'>
            <div className=' overflow-hidden '>
              <h2 className="text-2xl font-bold mb-2">{schema.formTitle}</h2>
              <p className="mb-6">{schema.formDescription}</p>
            </div>
            {/* Dark Mode Toggle */}
            <div className="flex justify-end mb-16 px-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleDarkMode();
                }}
                className="cursor-pointer p-2 rounded-lg"
                aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <svg
                    className="w-6 h-6 fixed text-yellow-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                    />
                    <path
                      d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
                      strokeWidth="2"
                      strokeLinecap="round"
                      stroke="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 fixed text-blue-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                )}
              </button>
            </div>


          </div>
        </div>

        <div className="w-full mx-auto p-4 shadow-md rounded-lg">

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
