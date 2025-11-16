import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getEmailTemplate, UserDetails, Recipient, JobType } from '@/lib/email-templates';

// Validate environment variables
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === undefined,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    // Check if required environment variables are set
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.EMAIL_FROM) {
      return NextResponse.json(
        { error: 'Email configuration is missing. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { recipients, userDetails, jobType } = body as {
      recipients: Recipient[];
      userDetails: UserDetails;
      jobType: JobType;
    };

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Recipients array is required' },
        { status: 400 }
      );
    }

    if (!userDetails || !jobType) {
      return NextResponse.json(
        { error: 'User details and job type are required' },
        { status: 400 }
      );
    }

    const results = [];
    const { yourName, role, targetCompany } = userDetails;

    for (const recipient of recipients) {
      try {
        const html = getEmailTemplate(userDetails, recipient, jobType);
        
        const mailOptions = {
          from: `${yourName} <${process.env.EMAIL_FROM}>`,
          to: recipient.email,
          subject: `Request for an Interview Opportunity - ${role} at ${targetCompany}`,
          html,
        };

        await transporter.sendMail(mailOptions);
        results.push({
          email: recipient.email,
          name: recipient.name,
          status: 'success',
        });

        // Wait 10s to 50s between emails
        if (recipients.indexOf(recipient) < recipients.length - 1) {
          const wait = Math.random() * 40000 + 10000;
          await new Promise((resolve) => setTimeout(resolve, wait));
        }
      } catch (error: any) {
        results.push({
          email: recipient.email,
          name: recipient.name,
          status: 'error',
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email sending process completed',
      results,
    });
  } catch (error: any) {
    console.error('Error in send-email API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send emails' },
      { status: 500 }
    );
  }
}

