export interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'email' | 'text' | 'url' | 'password' | 'number';
  touched?: any;
  errors?: any;
  required?: boolean;
  className?: string;
}

