import { JobFunction, JobType, LinkRegion } from '@vtmp/common/constants';

export const buildPrompt = (extractedText: string): string => {
  const outputFormat = `
\`\`\`json
{
  "jobTitle": string,
  "companyName": string,
  "location": string,
  "jobFunction": string,
  "jobType": string,
  "datePosted": string,
  "jobDescription": {
    "responsibility": string,
    "requirement": string,
    "preferred": string
  }
  "aiNote": string,
  "aiScore": number,
}
\`\`\`
`;
  return `
${extractedText}
\n\n
First, evaluate a score from 0 to 100 indicating your confidence that the text is a job posting.

if score < 25, return JSON object with only "aiScore" field set to the score

otherwise, please follow the step below

**General Instructions:**
- Extract the following fields if available. If a field is not present in the text, omit it entirely from the output JSON.
- Do not explain your answer.
- Output only a single, minified JSON object. Do not include markdown, comments, or extra text.
- Field names must match exactly as shown below.

**Field definitions:**
- jobTitle: The title of the job, usually near the top above or near the "Apply" section.
- companyName: The company offering the job, usually near the job title.
- location: Choose the best match from: ${Object.values(LinkRegion).join(', ')}. If none closely match, omit the "location" field entirely from the output.
- jobFunction: Choose the best match from: ${Object.values(JobFunction).join(', ')}. If none closely match, omit the "jobFunction" field entirely from the output.
- jobType: Choose from: ${Object.values(JobType).join(', ')}. Use these rules:
  - If the job title or description includes "Intern", "Co-op", "Program", or "Apprenticeship", use "INTERNSHIP".
  - If it includes "New Grad", "Entry-Level", or "Early Career", use "NEW_GRAD".
  - Otherwise, use "INDUSTRY".
- datePosted: The date the job was posted. If unavailable, omit this field. If available, format as MM/DD/YYYY.
- jobDescription: Structure as an object with:
  - responsibility: This field shows what the employee will do in the role, such as day-to-day tasks and key responsibilities.
  - requirement: This field shows the minimum qualifications, skills, or experience required for the position.
  - preferred: This field shows any additional qualifications or skills that are preferred but not strictly required.
  For "jobDescription", if at least one of these subfields is present, include the "jobDescription" field and only the present subfields. If none are present, omit the "jobDescription" field entirely.
- aiNote: A brief explanation of what the opportunity is and why it’s suitable for SWE or PD students. 
- aiScore: the score you evaluated earlier


**Strategy:**
- First, find the main body of the job posting.
- Look for an “Apply” section or similar phrases; job title and company are typically just above this.
- The job description, including responsibilities and requirements, is generally located down below in the job posting.

Return the extracted information with the JSON format:
${outputFormat.trim()}
`;
};
