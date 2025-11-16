import { FormValues } from '@/types/FormValues';
import { JobTypeEnum } from '@/enums/jobTypeEnum';

export const initialValues: FormValues = {
  recipients: [{ email: '', name: '' }],
  jobType: JobTypeEnum.FRONTEND,
  userDetails: {
    yourName: 'Bharat Sarda',
    currentCompany: 'Lumiq',
    role: '',
    targetCompany: '',
    resumeLink: '', // Will be set from env based on job type
    linkedIn: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
    jobLink: '',
  },
};
