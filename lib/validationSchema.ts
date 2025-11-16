import { array, object, string } from 'yup';
import { ErrorMessages } from '@/enums/errorMessages';
import { initialValues } from '@/constants/initialValues';
import { JobTypeEnum } from '@/enums/jobTypeEnum';

export const validationSchema = object().shape({
  recipients: array()
    .of(
      object().shape({
        email: string()
          .email(ErrorMessages.INVALID_EMAIL)
          .required(ErrorMessages.EMAIL_REQUIRED),
        name: string()
          .min(2, ErrorMessages.NAME_MIN_LENGTH)
          .required(ErrorMessages.NAME_REQUIRED),
      })
    )
    .min(1, ErrorMessages.RECIPIENTS_MIN)
    .required(ErrorMessages.RECIPIENTS_REQUIRED),
  jobType: string()
    .oneOf(
      [JobTypeEnum.FRONTEND, JobTypeEnum.BACKEND, JobTypeEnum.FULLSTACK],
      ErrorMessages.INVALID_JOB_TYPE
    )
    .required(ErrorMessages.JOB_TYPE_REQUIRED),
  userDetails: object().shape({
    yourName: string().default(initialValues.userDetails.yourName),
    currentCompany: string().default(initialValues.userDetails.currentCompany),
    role: string().required(ErrorMessages.ROLE_REQUIRED),
    targetCompany: string().required(ErrorMessages.TARGET_COMPANY_REQUIRED),
    linkedIn: string().default(initialValues.userDetails.linkedIn),
    jobLink: string()
      .url(ErrorMessages.INVALID_URL_FORMAT)
      .required(ErrorMessages.JOB_LINK_REQUIRED),
  }),
});
