import { JobTypeEnum } from '@/enums/jobTypeEnum';

/**
 * Get resume link based on job type from environment variables
 * @param jobType - The job type enum value
 * @returns The resume link URL for the specified job type
 */
export const getResumeLink = (jobType: JobTypeEnum): string => {
  switch (jobType) {
    case JobTypeEnum.FRONTEND:
      return process.env.NEXT_PUBLIC_RESUME_LINK_FRONTEND || '';
    case JobTypeEnum.BACKEND:
      return process.env.NEXT_PUBLIC_RESUME_LINK_BACKEND || '';
    case JobTypeEnum.FULLSTACK:
      return process.env.NEXT_PUBLIC_RESUME_LINK_FULLSTACK || '';
    default:
      return '';
  }
};
