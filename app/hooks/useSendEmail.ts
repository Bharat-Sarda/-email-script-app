import { useState } from 'react';
import toast from 'react-hot-toast';
import { FormValues } from '@/types/FormValues';
import { getResumeLink } from '@/lib/helpers';
import { JobTypeEnum } from '@/enums/jobTypeEnum';
import { UrlsEnum } from '@/enums/urlsEnum';
import { ToastMessages } from '@/enums/toastMessages';

interface SendEmailResult {
  email: string;
  name: string;
  status: 'success' | 'error';
  error?: string;
}

interface UseSendEmailReturn {
  sendEmails: (values: FormValues) => Promise<void>;
  isSending: boolean;
  sendResults: SendEmailResult[];
  clearResults: () => void;
}

export const useSendEmail = (): UseSendEmailReturn => {
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendEmailResult[]>([]);

  const sendEmails = async (values: FormValues) => {
    setIsSending(true);
    setSendResults([]);
    toast.loading(ToastMessages.STARTING_EMAIL_PROCESS, {
      id: 'sending-emails',
    });

    try {
      // Ensure fixed values are always set
      const userDetailsWithFixedValues = {
        ...values.userDetails,
        yourName: 'Bharat Sarda',
        currentCompany: 'Lumiq',
        linkedIn: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
        resumeLink: getResumeLink(values.jobType as JobTypeEnum),
      };

      const response = await fetch(UrlsEnum.SEND_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        results.forEach((result: SendEmailResult) => {
          if (result.status === 'success') {
            toast.success(
              ToastMessages.EMAIL_SENT_SUCCESS(result.name, result.email),
              {
                duration: 3000,
              }
            );
          } else {
            toast.error(
              ToastMessages.EMAIL_SEND_FAILED(
                result.name,
                result.email,
                result.error
              ),
              {
                duration: 5000,
              }
            );
          }
        });

        // Show summary toast
        const successCount = results.filter(
          (r: SendEmailResult) => r.status === 'success'
        ).length;
        const failCount = results.filter(
          (r: SendEmailResult) => r.status === 'error'
        ).length;

        if (failCount === 0) {
          toast.success(ToastMessages.ALL_EMAILS_SENT_SUCCESS(successCount), {
            duration: 4000,
          });
        } else {
          toast.error(
            ToastMessages.EMAIL_SEND_COMPLETED_WITH_ERRORS(
              successCount,
              failCount
            ),
            {
              duration: 5000,
            }
          );
        }
      } else {
        toast.dismiss('sending-emails');
        toast.error(data.error || ToastMessages.FAILED_TO_SEND_EMAILS);
      }
    } catch (error: any) {
      toast.dismiss('sending-emails');
      toast.error(ToastMessages.ERROR_SENDING_EMAILS(error.message));
    } finally {
      setIsSending(false);
    }
  };

  const clearResults = () => {
    setSendResults([]);
  };

  return {
    sendEmails,
    isSending,
    sendResults,
    clearResults,
  };
};
