export enum ErrorMessages {
  // Recipient errors
  INVALID_EMAIL = 'Invalid email address',
  EMAIL_REQUIRED = 'Email is required',
  NAME_MIN_LENGTH = 'Name must be at least 2 characters',
  NAME_REQUIRED = 'Name is required',
  RECIPIENTS_MIN = 'At least one recipient is required',
  RECIPIENTS_REQUIRED = 'Recipients are required',

  // Job type errors
  INVALID_JOB_TYPE = 'Invalid job type',
  JOB_TYPE_REQUIRED = 'Job type is required',

  // User details errors
  ROLE_REQUIRED = 'Role is required',
  TARGET_COMPANY_REQUIRED = 'Target company is required',
  INVALID_URL_FORMAT = 'Invalid URL format',
  JOB_LINK_REQUIRED = 'Job link is required',
}
