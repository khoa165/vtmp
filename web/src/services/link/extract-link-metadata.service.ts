import {
  extractLinkMetaDatPrompt,
  formatJobDescription,
} from 'helpers/link.helpers';
import { LinkMetaData } from '@/types/link.types';
import {
  By,
  WebDriver,
  WebElement,
  Builder,
  Browser,
} from 'selenium-webdriver';
import { GenerateContentResponse } from '@google/genai';
import chrome from 'selenium-webdriver/chrome';
import { GoogleGenAI } from '@google/genai';
import { ResourceNotFoundError } from '@/utils/errors';
import ExcelJS from 'exceljs';

const getGoogleGenAI = async (): Promise<GoogleGenAI> => {
  const geminiApiKey = process.env.Google_Gemini_API_KEY;
  if (!geminiApiKey) {
    throw new ResourceNotFoundError('Google_Gemini_API_KEY is not set', {
      key: geminiApiKey,
    });
  }
  return new GoogleGenAI({ apiKey: geminiApiKey });
};

const getSeleniumWebDriver = async (): Promise<WebDriver> => {
  const options: chrome.Options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments(
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage'
  );

  return new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
};

const getPromptExamples = async (): Promise<string> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(
    `C://AProgramming//vtmp//web//src//data//vtmp-training-data.xlsx`
  );
  const workSheet = workbook.getWorksheet(1);

  if (!workSheet) {
    throw new ResourceNotFoundError('Worksheet not found', {});
  }
  const examples: string[] = [];
  workSheet.eachRow((row, rowNumber) => {
    const values = row.values as ExcelJS.CellValue[];
    examples.push(`
Example of the job posting ${rowNumber}: ${values[1]}\n
Example of the output with the correct information and format ${rowNumber}: ${values[2]}
  `);
  });
  return examples.join('\n\n');
};
const generateMetaData = async (
  extractedText: string,
  url: string
): Promise<LinkMetaData | { url: string }> => {
  const genAI = await getGoogleGenAI();
  const examples = await getPromptExamples();
  const prompt = await extractLinkMetaDatPrompt(extractedText, examples);

  const response: GenerateContentResponse = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const text = response.text?.replace(/```json|```/g, '').trim();
  console.log('Response from AI:', text);
  if (!text) return { url };

  const parsedResponse = JSON.parse(text);

  const formattedLinkMetaData: LinkMetaData = {
    ...parsedResponse,
    jobDescription: formatJobDescription(parsedResponse.jobDescription),
    url,
  };

  if (
    !formattedLinkMetaData.jobTitle ||
    !formattedLinkMetaData.companyName ||
    !formattedLinkMetaData.jobDescription
  ) {
    return { url };
  }

  return formattedLinkMetaData;
};

const scrapeWebsite = async (url: string): Promise<string> => {
  let driver: WebDriver | undefined;
  try {
    driver = await getSeleniumWebDriver();
    await driver.get(url);
    await driver.wait(async () => {
      const readyState = await driver?.executeScript(
        'return document.readyState'
      );
      return readyState === 'complete';
    }, 10000);
    const bodyElement: WebElement = await driver.findElement(By.css('body'));
    const jobPostingText = await bodyElement.getText();

    return jobPostingText;
  } finally {
    await driver?.quit();
  }
};

const ExtractLinkMetadataService = {
  extractMetadata: async (
    url: string
  ): Promise<LinkMetaData | { url: string }> => {
    try {
      const extractedText = await scrapeWebsite(url);
      return generateMetaData(extractedText, url);
    } catch {
      return { url };
    }
  },
};

export { scrapeWebsite, generateMetaData, ExtractLinkMetadataService };
