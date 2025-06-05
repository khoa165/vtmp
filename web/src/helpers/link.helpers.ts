import { JobFunction, JobType } from '@vtmp/common/constants';

const formatJobDescription = (description: {
  responsibility: string;
  requirement: string;
  prefferred: string;
}): string => {
  const formatSection = (title: string, content: string) => {
    const lines = content
      .replace(/\n\n/g, '\n')
      .split('\n')
      .map((line) => `- ${line.replace('-', '').trim()}`);
    return `${title}:\n${lines.join('\n')}\n`;
  };

  let result = '';

  if (description.responsibility != '') {
    result += formatSection('Responsibilities', description.responsibility);
  }

  if (description.requirement != '') {
    result += '\n' + formatSection('Requirements', description.requirement);
  }

  if (description.prefferred != '') {
    result +=
      '\n' + formatSection('Preferred Qualifications', description.prefferred);
  }

  return result.length > 0 ? '\n' + result.trim() : '';
};

const extractLinkMetaDatPrompt = async (extractedText: string) => `
${extractedText}
\n\n
You are given a raw text of a job posting. Extract the following structured fields from it:

jobTitle: The title of the job. It is usually located near the top of the posting, typically above or near the "Apply" section.

companyName: The name of the company offering the job. It is usually listed near the job title.

location: The country or state where the job is located. Return:
- "US" if it is a U.S. city or state
- "CANADA" if it is a Canadian city or province
- Otherwise, return the country name

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

If any of the above fields are not available in the input, leave them as an empty string.

Do not explain your answer.
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
    "prefferred": string
  }
}

`;

export { extractLinkMetaDatPrompt, formatJobDescription };
