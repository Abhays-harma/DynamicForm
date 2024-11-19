export interface FieldOption {
    value: string;
    label: string;
  }
  
  export interface Field {
    id: string;
    type: string;
    label: string;
    required: boolean;
    placeholder?: string;
    validation?: {
      pattern: string;
      message: string;
    };
    options?: FieldOption[];
  }
  
  export interface FormSchema {
    formTitle: string;
    formDescription: string;
    fields: Field[];
  }