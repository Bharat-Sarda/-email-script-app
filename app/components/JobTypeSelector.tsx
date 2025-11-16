import { Field, ErrorMessage } from 'formik';
import { JobTypeEnum } from '@/enums/jobTypeEnum';
import { JobTypeSelectorProps } from '@/types/props/JobTypeSelectorProps';

export default function JobTypeSelector({
  name = 'jobType',
  label = 'Job Type',
  required = true,
  options = [JobTypeEnum.FRONTEND, JobTypeEnum.BACKEND, JobTypeEnum.FULLSTACK],
  errors,
  touched,
}: JobTypeSelectorProps) {
  const hasError = touched?.jobType && errors?.jobType;

  return (
    <div className="!mb-6 border-gray-200 border-t !pt-3">
      <h2
        className={`text-xl font-semibold !mb-2 ${hasError ? 'text-red-600' : 'text-gray-800'}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </h2>
      <div className="flex md:flex-row flex-col  !gap-4">
        {options.map((type) => (
          <label key={type} className="flex items-center cursor-pointer">
            <Field
              type="radio"
              name={name}
              value={type}
              className={`!mr-2 !h-4 !w-4 ${
                hasError ? '!text-red-600' : '!text-blue-600'
              }`}
            />
            <span
              className={`capitalize ${
                hasError ? 'text-red-600' : 'text-gray-700'
              }`}
            >
              {type}
            </span>
          </label>
        ))}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="!text-red-500 !text-sm !mt-1"
      />
    </div>
  );
}
