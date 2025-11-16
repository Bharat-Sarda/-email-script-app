import { Field, ErrorMessage } from 'formik';
import { FormFieldProps } from '@/types/props/FormFieldProps';

export default function FormField({
  name,
  label,
  placeholder,
  type = 'text',
  touched,
  errors,
  required = true,
  className = '',
}: FormFieldProps) {
  // Helper to check if field has error
  const getFieldError = (fieldName: string): boolean => {
    if (!touched || !errors) return false;

    const keys = fieldName.split('.');
    let touchedValue = touched;
    let errorValue = errors;

    for (const key of keys) {
      touchedValue = touchedValue?.[key];
      errorValue = errorValue?.[key];
    }

    return !!(touchedValue && errorValue);
  };

  const hasError = getFieldError(name);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 !mb-0.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className={`!w-full !px-4 !py-2 !border !rounded-md ${
          hasError ? '!border-red-500 ' : '!border-gray-300'
        }`}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="!text-red-500 !text-sm !mt-1"
      />
    </div>
  );
}
