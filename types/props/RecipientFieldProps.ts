export interface RecipientFieldProps {
  index: number;
  fieldName: 'email' | 'name';
  label: string;
  placeholder: string;
  type?: 'email' | 'text';
  touched?: any;
  errors?: any;
  required?: boolean;
}

