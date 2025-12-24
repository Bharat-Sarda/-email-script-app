'use client';
import { Formik, Form, FieldArray } from 'formik';
import { validationSchema } from '@/lib/validationSchema';
import { FormValues } from '@/types/FormValues';
import { initialValues } from '@/constants/initialValues';
import { useSendEmail } from './hooks/useSendEmail';
import RecipientField from './components/RecipientField';
import JobTypeSelector from './components/JobTypeSelector';
import FormField from './components/FormField';

export default function Home() {
  const { sendEmails, isSending, sendResults, clearResults } = useSendEmail();

  const handleSubmit = async (values: FormValues) => {
    await sendEmails(values);
  };

  const handleReset = (resetForm: () => void) => {
    resetForm();
    clearResults();
  };

  return (
    <div className="bg-gray-50 !p-3">
      <div className="mx-auto h-full">
        <div className="bg-white rounded-lg shadow-xl min-h-[calc(100vh-2rem)]  !p-3">
          <h1 className="text-3xl font-bold text-gray-900 !mb-6 text-center">
            Job Email Generator
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, resetForm }) => {
              return (
                <Form>
                  {/* Recipients Section */}
                  <div className="!mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 !mb-4">
                      Recipients
                    </h2>
                    <FieldArray name="recipients">
                      {({ push, remove }) => (
                        <div className="!space-y-4">
                          {values.recipients.map((recipient, index) => (
                            <div key={index} className="flex md:gap-4 items-start">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <RecipientField
                                  index={index}
                                  fieldName="email"
                                  label="Email"
                                  placeholder="email@example.com"
                                  type="email"
                                  touched={touched}
                                  errors={errors}
                                />
                                <RecipientField
                                  index={index}
                                  fieldName="name"
                                  label="Name"
                                  placeholder="Recipient Name"
                                  type="text"
                                  touched={touched}
                                  errors={errors}
                                />
                              </div>
                              {values.recipients.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className=" cursor-pointer !mt-6 !p-2 !pr-0  md:!p-2 hover:bg-red-50 !rounded-md !transition-colors"
                                  title="Remove recipient"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="!w-5 !h-5 !text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                          {(() => {
                            const recipientsError = errors.recipients;
                            if (
                              recipientsError &&
                              typeof recipientsError === 'string'
                            ) {
                              return (
                                <div className="!text-red-500 !text-sm !mb-2">
                                  {recipientsError}
                                </div>
                              );
                            }
                            return null;
                          })()}
                          <button
                            type="button"
                            onClick={() => push({ email: '', name: '' })}
                            className="cursor-pointer !w-full md:!w-auto !px-4 !py-2 !bg-green-500 !text-white !rounded-md hover:!bg-green-600 !transition-colors"
                          >
                            + Add Recipient
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Job Type Selection */}
                  <JobTypeSelector touched={touched} errors={errors} />

                  {/* User Details Section */}
                  <div className="!mb-8 border-gray-200 border-t !pt-3">
                    <h2 className="text-xl font-semibold text-gray-800 !mb-4">
                      Your Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 !gap-4">
                      <FormField
                        name="userDetails.role"
                        label="Role/Position"
                        placeholder="e.g., SDE-2 (Front-end)"
                        type="text"
                        touched={touched}
                        errors={errors}
                        required={true}
                      />
                      <FormField
                        name="userDetails.targetCompany"
                        label="Target Company"
                        placeholder="e.g., slice"
                        type="text"
                        touched={touched}
                        errors={errors}
                        required={true}
                      />
                      <FormField
                        name="userDetails.jobLink"
                        label="Job Link"
                        placeholder="https://..."
                        type="url"
                        touched={touched}
                        errors={errors}
                        required={true}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>

                  {/* Send Button */}
                  <div className="flex justify-center gap-3 items-center md:flex-row flex-col">
                    <button
                      type="button"
                      onClick={() => handleReset(resetForm)}
                      disabled={isSending || isSubmitting}
                      className={`!px-8 !w-full md:!w-auto cursor-pointer !py-3 !rounded-md !font-semibold !text-gray-700  bg-gray-200 hover:!bg-gray-300 !transition-colors ${isSending || isSubmitting
                          ? '!opacity-50 !cursor-not-allowed'
                          : ''
                        }`}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={isSending || isSubmitting}
                      className={`!px-8 !w-full md:!w-auto cursor-pointer !py-3 !rounded-md !font-semibold !text-white !transition-colors ${isSending || isSubmitting
                          ? '!bg-gray-400 !cursor-not-allowed'
                          : '!bg-blue-600 hover:!bg-blue-700'
                        }`}
                    >
                      {isSending || isSubmitting
                        ? 'Sending Emails...'
                        : 'Send Emails'}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>

          {/* Results Section */}
          {sendResults.length > 0 && (
            <div className="!mt-8">
              <h2 className="text-xl font-semibold text-gray-800 !mb-4">
                Send Results
              </h2>
              <div className="space-y-2">
                {sendResults.map((result, index) => (
                  <div
                    key={index}
                    className={`!p-4 rounded-md ${result.status === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 break-words">
                          {result.name} ({result.email})
                        </p>
                        {result.error && (
                          <p className="text-sm text-red-600 !mt-1 break-words">
                            Error: {result.error}
                          </p>
                        )}
                      </div>
                      <span
                        className={`!px-3 !py-1 !rounded-full !text-sm !font-medium !whitespace-nowrap !flex-shrink-0 ${result.status === 'success'
                            ? '!bg-green-200 !text-green-800'
                            : '!bg-red-200 !text-red-800'
                          }`}
                      >
                        {result.status === 'success' ? '✓ Sent' : '✗ Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
