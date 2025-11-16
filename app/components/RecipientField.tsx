import { Field, ErrorMessage } from 'formik';
import { RecipientFieldProps } from '@/types/props/RecipientFieldProps';

export default function RecipientField({
  index,
  fieldName,
  label,
  placeholder,
  type = 'text',
  touched,
  errors,
  required = true,
}: RecipientFieldProps) {
  const hasError =
    touched?.recipients?.[index]?.[fieldName] &&
    errors?.recipients?.[index] &&
    typeof errors.recipients[index] === 'object' &&
    fieldName in errors.recipients[index] &&
    errors.recipients[index][fieldName];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 !mb-0.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Field
        type={type}
        name={`recipients.${index}.${fieldName}`}
        placeholder={placeholder}
        className={`!w-full !px-4 !py-2 !border !rounded-md ${
          hasError ? '!border-red-500 ' : '!border-gray-300'
        }`}
      />
      <ErrorMessage
        name={`recipients.${index}.${fieldName}`}
        component="div"
        className="!text-red-500 !text-sm !mt-1"
      />
    </div>
  );
}
