export interface UserDetails {
  yourName: string;
  currentCompany: string;
  role: string;
  targetCompany: string;
  resumeLink: string;
  linkedIn: string;
  jobLink?: string;
}

export interface Recipient {
  email: string;
  name: string;
}

export type JobType = 'frontend' | 'backend' | 'fullstack';

export function getEmailTemplate(
  userDetails: UserDetails,
  recipient: Recipient,
  jobType: JobType
): string {
  const { yourName, currentCompany, role, targetCompany, resumeLink, linkedIn, jobLink } = userDetails;

  const experienceText = getExperienceText(jobType, currentCompany);
  const roleDescription = getRoleDescription(jobType);

  return `<p>Hi ${recipient.name},</p>

<p>I hope you're doing well.</p>

<p>
I came across an exciting opportunity for <b>${role}</b> at <b>${targetCompany}</b> and wanted to express my keen interest in it.
</p>

<p>
${experienceText}
</p>

<p>
I would love the opportunity to contribute to ${targetCompany}'s mission and would appreciate it if you could consider my profile for the role.
</p>

<p>
I've attached my <a href="${resumeLink}"><b>Resume</b></a> and <a href="${linkedIn}"><b>LinkedIn</b></a>${jobLink ? `, along with the <a href="${jobLink}"><b>Job Opening</b></a>` : ''} for your quick reference.
</p>

<p>
Thank you for your time and consideration. Looking forward to hearing from you!
</p>

<p>
Warm regards,<br>
<b>${yourName}</b><br>
${roleDescription}<br>
${linkedIn}<br>
https://my-portfolio-git-main-bharatsarda18s-projects.vercel.app/<br>
7627064727 | sardabharat71@gmail.com
</p>`;
}

function getExperienceText(jobType: JobType, currentCompany: string): string {
  switch (jobType) {
    case 'frontend':
      return `I bring 3 years of experience as a frontend developer, working extensively with React.js. Currently, I'm working at ${currentCompany} as a Full Stack Developer with a frontend focus, where I've built and maintained complex UI components and enterprise-grade applications.`;
    case 'backend':
      return `I bring 3 years of experience as a backend developer, working extensively with Node.js, databases, and API development. Currently, I'm working at ${currentCompany} as a Full Stack Developer with a backend focus, where I've designed and implemented scalable server-side solutions and robust APIs.`;
    case 'fullstack':
      return `I bring 3 years of experience as a full stack developer, working extensively with React.js, Node.js, and modern web technologies. Currently, I'm working at ${currentCompany} as a Full Stack Developer, where I've built end-to-end solutions, from frontend interfaces to backend services and database design.`;
    default:
      return `I bring 3 years of experience in software development. Currently, I'm working at ${currentCompany} as a Full Stack Developer.`;
  }
}

function getRoleDescription(jobType: JobType): string {
  switch (jobType) {
    case 'frontend':
      return 'Frontend Developer';
    case 'backend':
      return 'Backend Developer';
    case 'fullstack':
      return 'Full Stack Developer';
    default:
      return 'Software Developer';
  }
}

