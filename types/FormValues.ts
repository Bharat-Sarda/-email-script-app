import { JobType, Recipient, UserDetails } from '@/lib/email-templates';

export interface FormValues {
  recipients: Recipient[];
  jobType: JobType;
  userDetails: UserDetails;
}
