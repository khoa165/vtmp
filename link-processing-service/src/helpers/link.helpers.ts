import { JobFunction, JobType, LinkRegion } from '@vtmp/common/constants';

const formatJobDescription = (description: {
  responsibility?: string | undefined;
  requirement?: string | undefined;
  preferred?: string | undefined;
}): string => {
  const formatSection = (title: string, content: string) => {
    const lines = content
      .replace(/\n\n/g, '\n')
      .split('\n')
      .map((line) => `- ${line.replace('-', '').trim()}`);
    return `${title}:\n${lines.join('\n')}\n`;
  };

  let result = '';

  if (description.responsibility) {
    result += formatSection('Responsibilities', description.responsibility);
  }

  if (description.requirement) {
    result += '\n' + formatSection('Requirements', description.requirement);
  }

  if (description.preferred) {
    result +=
      '\n' + formatSection('Preferred Qualifications', description.preferred);
  }

  return result.length > 0 ? '\n' + result.trim() : '';
};

export const mapStringToEnum = <T extends Record<string, string>>({
  enumObject,
  value,
  fallback,
}: {
  enumObject: T;
  value: string | undefined;
  fallback: T[keyof T];
}): T[keyof T] => {
  const match = Object.values(enumObject).find((v) => v === value);
  if (!match) {
    return fallback;
  }
  return match as T[keyof T];
};

const buildPrompt = (extractedText: string): string => `
${extractedText}
\n\n
You are given a raw text of a job posting. Extract the following structured fields from it:

jobTitle: The title of the job. It is usually located near the top of the posting, typically above or near the "Apply" section.

companyName: The name of the company offering the job. It is usually listed near the job title.

location: Choose the best match from this list: ${Object.values(LinkRegion).join(', ')}. If none are a good fit, return "OTHER".

jobFunction: Choose the best match from this list: ${Object.values(JobFunction).join(', ')}. If none are a good fit, return "SOFTWARE_ENGINEER".

jobType: Choose from: ${Object.values(JobType).join(', ')}. Use the following rules:
- If the job title or description includes "Intern", "Co-op", "Program", or "Apprenticeship", return "INTERNSHIP".
- If it includes "New Grad", "Entry-Level", or "Early Career", return "NEW_GRAD".
- Otherwise, return "INDUSTRY".

datePosted: The date the job was posted. If unavailable, return an empty string. If available, format as MM/DD/YYYY.

jobDescription: Extract and structure the content into the following Markdown fields:
- responsibility: List the main responsibilities or duties of the role.
- requirement: List the required qualifications, skills, or experience.
- preferred: List any preferred qualifications.

Strategy:
- First, find the main body of the job posting text.
- Look for an “Apply” section or similar phrases like “Apply Now” or “Submit Application.” Job title and company are typically located just above this.
- The job description, including responsibilities and requirements, is generally located below.

**Important:**
- If any of the above fields are not available in the input, do not include them in the returned object.
- Do not explain your answer.
- Return only a single JSON object, with no extra text, markdown, or code block formatting.
- Field names must match exactly as shown below.

Return the extracted information with the following format:
{
  "jobTitle": string,
  "companyName": string,
  "location": string,
  "jobFunction": string,
  "jobType": string,
  "datePosted": string,
  "jobDescription": object 
  {
    "responsibility": string,
    "requirement": string,
    "preferred": string
  }
}
`;

export { buildPrompt, formatJobDescription };
