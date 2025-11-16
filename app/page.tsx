'use client';
import { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { UserDetails, Recipient, JobType } from '@/lib/email-templates';

interface FormValues {
  recipients: Recipient[];
  jobType: JobType;
  userDetails: UserDetails;
}

const validationSchema = Yup.object().shape({
  recipients: Yup.array()
    .of(
      Yup.object().shape({
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        name: Yup.string()
          .min(2, 'Name must be at least 2 characters')
          .required('Name is required'),
      })
    )
    .min(1, 'At least one recipient is required')
    .required('Recipients are required'),
  jobType: Yup.string()
    .oneOf(['frontend', 'backend', 'fullstack'], 'Invalid job type')
    .required('Job type is required'),
  userDetails: Yup.object().shape({
    yourName: Yup.string().default('Bharat Sarda'),
    currentCompany: Yup.string().default('Lumiq'),
    role: Yup.string()
      .min(2, 'Role must be at least 2 characters')
      .required('Role is required'),
    targetCompany: Yup.string()
      .min(2, 'Target company name must be at least 2 characters')
      .required('Target company is required'),
    linkedIn: Yup.string().default('https://www.linkedin.com/in/bharat-sarda-68b15b1aa/'),
    jobLink: Yup.string()
      .url('Invalid URL format')
      .required('Job link is required'),
  }),
});

const initialValues: FormValues = {
  recipients: [{ email: '', name: '' }],
  jobType: 'frontend',
  userDetails: {
    yourName: 'Bharat Sarda',
    currentCompany: 'Lumiq',
    role: 'SDE-2 (Front-end)',
    targetCompany: 'slice',
    resumeLink: '', // Will be set from env based on job type
    linkedIn: 'https://www.linkedin.com/in/bharat-sarda-68b15b1aa/',
    jobLink: 'https://www.linkedin.com/jobs/search/?currentJobId=4223448458&f_C=30246063&originToLandingJobPostings=4224566614%2C4223448458%2C4202521888%2C4194743610&trk=d_flagship3_company_posts',
  },
};

export default function Home() {
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<any[]>([]);

  const handleSubmit = async (values: FormValues) => {
    setIsSending(true);
    setSendResults([]);
    toast.loading('Starting email sending process...', { id: 'sending-emails' });

    try {
      // Get resume link based on job type from environment variables
      const getResumeLink = (jobType: JobType): string => {
        switch (jobType) {
          case 'frontend':
            return process.env.NEXT_PUBLIC_RESUME_LINK_FRONTEND || '';
          case 'backend':
            return process.env.NEXT_PUBLIC_RESUME_LINK_BACKEND || '';
          case 'fullstack':
            return process.env.NEXT_PUBLIC_RESUME_LINK_FULLSTACK || '';
          default:
            return '';
        }
      };

      // Ensure fixed values are always set
      const userDetailsWithFixedValues = {
        ...values.userDetails,
        yourName: 'Bharat Sarda',
        currentCompany: 'Lumiq',
        linkedIn: 'https://www.linkedin.com/in/bharat-sarda-68b15b1aa/',
        resumeLink: getResumeLink(values.jobType),
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: values.recipients,
          userDetails: userDetailsWithFixedValues,
          jobType: values.jobType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSendResults(data.results || []);
        toast.dismiss('sending-emails');
        
        // Show individual toasts for each recipient
        const results = data.results || [];
        results.forEach((result: any) => {
          if (result.status === 'success') {
            toast.success(`Email sent to ${result.name} (${result.email})`, {
              duration: 3000,
            });
          } else {
            toast.error(`Failed to send to ${result.name} (${result.email}): ${result.error || 'Unknown error'}`, {
              duration: 5000,
            });
          }
        });

        // Show summary toast
        const successCount = results.filter((r: any) => r.status === 'success').length;
        const failCount = results.filter((r: any) => r.status === 'error').length;
        
        if (failCount === 0) {
          toast.success(`All ${successCount} email(s) sent successfully!`, {
            duration: 4000,
          });
        } else {
          toast.error(`Completed: ${successCount} sent, ${failCount} failed`, {
            duration: 5000,
          });
        }
      } else {
        toast.dismiss('sending-emails');
        toast.error(data.error || 'Failed to send emails');
      }
    } catch (error: any) {
      toast.dismiss('sending-emails');
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Email Script Sender
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting }) => {
              const getFieldError = (fieldName: string) => {
                const fieldTouched = touched as any;
                const fieldErrors = errors as any;
                const keys = fieldName.split('.');
                let touchedValue = fieldTouched;
                let errorValue = fieldErrors;
                
                for (const key of keys) {
                  touchedValue = touchedValue?.[key];
                  errorValue = errorValue?.[key];
                }
                
                // Return error only if field is touched and error exists
                // If error is an object (like array errors), return null to handle separately
                if (touchedValue && errorValue) {
                  // If it's a string, return it directly
                  if (typeof errorValue === 'string') {
                    return errorValue;
                  }
                  // If it's an object/array, return null (we'll handle it separately)
                  return null;
                }
                
                return null;
              };

              return (
              <Form>
                {/* Recipients Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Recipients *
                  </h2>
                  <FieldArray name="recipients">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.recipients.map((recipient, index) => (
                          <div key={index} className="flex gap-4 items-start">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email *
                                </label>
                                <Field
                                  type="email"
                                  name={`recipients.${index}.email`}
                                  placeholder="email@example.com"
                                  className={`!w-full !px-4 !py-2 !border !rounded-md focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent ${
                                    getFieldError(`recipients.${index}.email`)
                                      ? '!border-red-500 !bg-red-50'
                                      : '!border-gray-300'
                                  }`}
                                />
                                <ErrorMessage
                                  name={`recipients.${index}.email`}
                                  component="div"
                                  className="!text-red-500 !text-sm !mt-1"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Name *
                                </label>
                                <Field
                                  type="text"
                                  name={`recipients.${index}.name`}
                                  placeholder="Recipient Name"
                                  className={`!w-full !px-4 !py-2 !border !rounded-md focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent ${
                                    getFieldError(`recipients.${index}.name`)
                                      ? '!border-red-500 !bg-red-50'
                                      : '!border-gray-300'
                                  }`}
                                />
                                <ErrorMessage
                                  name={`recipients.${index}.name`}
                                  component="div"
                                  className="!text-red-500 !text-sm !mt-1"
                                />
                              </div>
                            </div>
                            {values.recipients.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="!mt-6 !px-4 !py-2 !bg-red-500 !text-white !rounded-md hover:!bg-red-600 !transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        {(() => {
                          const recipientsError = errors.recipients;
                          if (recipientsError && typeof recipientsError === 'string') {
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
                          className="!w-full md:!w-auto !px-4 !py-2 !bg-green-500 !text-white !rounded-md hover:!bg-green-600 !transition-colors"
                        >
                          + Add Recipient
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Job Type Selection */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Job Type *
                  </h2>
                  <div className="flex gap-4">
                    {(['frontend', 'backend', 'fullstack'] as JobType[]).map((type) => (
                      <label
                        key={type}
                        className="flex items-center cursor-pointer"
                      >
                        <Field
                          type="radio"
                          name="jobType"
                          value={type}
                          className="!mr-2 !h-4 !w-4 !text-blue-600 focus:!ring-blue-500"
                        />
                        <span className="text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorMessage
                    name="jobType"
                    component="div"
                    className="!text-red-500 !text-sm !mt-1"
                  />
                </div>

                {/* User Details Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Your Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role/Position *
                      </label>
                      <Field
                        type="text"
                        name="userDetails.role"
                        placeholder="e.g., SDE-2 (Front-end)"
                        className={`!w-full !px-4 !py-2 !border !rounded-md focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent ${
                          getFieldError('userDetails.role')
                            ? '!border-red-500 !bg-red-50'
                            : '!border-gray-300'
                        }`}
                      />
                      <ErrorMessage
                        name="userDetails.role"
                        component="div"
                        className="!text-red-500 !text-sm !mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Company *
                      </label>
                      <Field
                        type="text"
                        name="userDetails.targetCompany"
                        className={`!w-full !px-4 !py-2 !border !rounded-md focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent ${
                          getFieldError('userDetails.targetCompany')
                            ? '!border-red-500 !bg-red-50'
                            : '!border-gray-300'
                        }`}
                      />
                      <ErrorMessage
                        name="userDetails.targetCompany"
                        component="div"
                        className="!text-red-500 !text-sm !mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Link *
                      </label>
                      <Field
                        type="url"
                        name="userDetails.jobLink"
                        placeholder="https://..."
                        className={`!w-full !px-4 !py-2 !border !rounded-md focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent ${
                          getFieldError('userDetails.jobLink')
                            ? '!border-red-500 !bg-red-50'
                            : '!border-gray-300'
                        }`}
                      />
                      <ErrorMessage
                        name="userDetails.jobLink"
                        component="div"
                        className="!text-red-500 !text-sm !mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Send Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSending || isSubmitting}
                    className={`!px-8 !py-3 !rounded-md !font-semibold !text-white !transition-colors ${
                      isSending || isSubmitting
                        ? '!bg-gray-400 !cursor-not-allowed'
                        : '!bg-blue-600 hover:!bg-blue-700'
                    }`}
                  >
                    {isSending || isSubmitting ? 'Sending Emails...' : 'Send Emails'}
                  </button>
                </div>
              </Form>
              );
            }}
          </Formik>

          {/* Results Section */}
          {sendResults.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Send Results
              </h2>
              <div className="space-y-2">
                {sendResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-md ${
                      result.status === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {result.name} ({result.email})
                        </p>
                        {result.error && (
                          <p className="text-sm text-red-600 mt-1">
                            Error: {result.error}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.status === 'success'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
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
