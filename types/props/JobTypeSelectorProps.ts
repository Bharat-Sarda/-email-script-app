import { JobTypeEnum } from '@/enums/jobTypeEnum';

export interface JobTypeSelectorProps {
  name?: string;
  label?: string;
  required?: boolean;
  options?: JobTypeEnum[];
  errors?: any;
  touched?: any;
}

