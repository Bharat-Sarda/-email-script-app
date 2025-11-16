export const ToastMessages = {
  // Loading messages
  STARTING_EMAIL_PROCESS: 'Starting email sending process...',

  // Success messages
  EMAIL_SENT_SUCCESS: (name: string, email: string) =>
    `Email sent to ${name} (${email})`,
  ALL_EMAILS_SENT_SUCCESS: (count: number) =>
    `All ${count} email(s) sent successfully!`,

  // Error messages
  EMAIL_SEND_FAILED: (name: string, email: string, error?: string) =>
    `Failed to send to ${name} (${email}): ${error || 'Unknown error'}`,
  EMAIL_SEND_COMPLETED_WITH_ERRORS: (successCount: number, failCount: number) =>
    `Completed: ${successCount} sent, ${failCount} failed`,
  FAILED_TO_SEND_EMAILS: 'Failed to send emails',
  ERROR_SENDING_EMAILS: (message: string) => `Error: ${message}`,
} as const;
