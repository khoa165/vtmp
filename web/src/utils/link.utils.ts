
export const extractJobPostingMetaDatPrompt = async (extractedText: string, workSheet) => {


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

if you are not able to extract the information, return an empty string for each field.

Here are examples of job postings and their expected output format.\n
${workSheet.eachRow((row, rowNumber) => {
  const values = row.values as ExcelJS.CellValue[];
  return `
Example of the job posting ${rowNumber}: ${values[1]}
Example of the output with the correct information and format ${rowNumber}: ${values[2]}\n\n
`;
})}
Return the extracted information in JSON format with the following fields:
{
  "jobTitle": string,
  "companyName": string,
  "location": string,
  "datePosted": string,
  "jobDescription": string
}
`;

  return prompt;
};
