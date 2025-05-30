import { InternalServerError } from '@/utils/errors';
import ExcelJS from 'exceljs';

export const formatJobDescription = (description: {
  responsibility: string;
  requirement: string;
  prefferred: string;
}): string => {
  const formatSection = (title: string, content: string) => {
    const lines = content.split('\n').map((line) => `- ${line.trim()}`);
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

  return result.trim();
};

export const extractLinkMetaDatPrompt = async (extractedText: string) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(
    `C://AProgramming//vtmp//web//src//data//vtmp-training-data.xlsx`
  );
  const workSheet = workbook.getWorksheet(1);

  if (!workSheet) {
    throw new InternalServerError('Worksheet not found', {});
  }
  let examples: string[] = [];
  workSheet.eachRow((row, rowNumber) => {
    const values = row.values as ExcelJS.CellValue[];
    examples.push(`
Example of the job posting ${rowNumber}: ${values[1]}\n
Example of the output with the correct information and format ${rowNumber}: ${values[2]}
  `);
  });
  const prompt = `
${extractedText}
\n\n
Given the string above, can you extract the part of the string that is the actual content of the primary job posting?
For job title, this field will show the title of the job posting
For company name, this field will show the name of the company that offers that job posting
For location, this field will show the state or country where the job is located
For date posted, this field will show the date when the job was posted
For job description, this field include the following markdowns:
- responsibility: this field will show the responsibilities of the job
- requirement: this field will show the requirements of the job
- prefferred: this field will show the preferred qualifications of the job

Use the following strategy:
- Look for an “Apply” button or similar phrase (e.g., “Apply Now”, “Submit Application”).
- The job title and company are typically located just above this section.
- The job description, including responsibilities and requirements, is typically located below.

Here are examples of job postings and their expected output format.\n
${examples.join('\n\n')}
Return the extracted information with the following format:
{
  "jobTitle": string,
  "companyName": string,
  "location": string,
  "datePosted": string,
  "jobDescription": object 
  {
    "responsibility": string,
    "requirement": string,
    "prefferred": string
  }
}

if you are not able to extract the information, return an empty string for each field.
For the datePosted field, if the date is not available, return an empty string, otherwise format it into mm/dd/yyyy format.
For the location, if it is a state or city belongs to United States, return US, if they belong to Canada, return CANADA, otherwise return the country name.
`;

  return prompt;
};
