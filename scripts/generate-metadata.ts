import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type BlogMetadata = Record<string, string> & {
  authors: string;
  contributors?: string;
  date: string;
  tags: string;
};

const extractMetadata = (text: string): BlogMetadata => {
  const metadata = {};

  const metaRegExp = RegExp(/^---[\r\n](((?!---).|[\r\n])*)[\r\n]---$/m);
  const rawMetadata = metaRegExp.exec(text);

  let keyValues;

  if (rawMetadata !== null) {
    keyValues = rawMetadata[1].split('\n');
    keyValues.forEach((keyValue) => {
      const colonIndex = keyValue.indexOf(':');
      if (colonIndex > 0) {
        const key = keyValue.substring(0, colonIndex).trim();
        let value = keyValue.substring(colonIndex + 1).trim();
        metadata[key] = value;
      }
    });
  }

  return metadata as BlogMetadata;
};

const buildMetadataFileOutput = (metadata) =>
  `import { BlogMetadata } from 'src/types';\n\nexport const allBlogsMetadata: BlogMetadata[] = [\n${metadata
    .map(
      (m) =>
        '  {\n    ' +
        Object.entries(m)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join(',\n    ') +
        '\n  },'
    )
    .join('\n')}\n];\n`;

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const generateImportName = (filename: string) =>
  filename
    .split('-')
    .map((word) => capitalize(word))
    .join('');

const buildFilePathsFileOutput = (metadata) => {
  metadata.sort((a, b) => b.date - a.date);

  const importPart = metadata
    .map(
      ({ name, filepath }) =>
        `import T${generateImportName(name)} from '@/blogs/content/${
          filepath.split('content/')[1]
        }';`
    )
    .join('\n');

  const arrayPart = `export const allBlogsFilepaths = [\n${metadata
    .map(({ name }) => '  T' + generateImportName(name))
    .join(',\n')},\n];\n`;

  return importPart + '\n\n' + arrayPart;
};

const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);

async function generatedMetadata() {
  try {
    const directoryPath = path.join(
      __dirname,
      '../web-client/src/blogs/content'
    );
    const directoryContent = (
      await readdir(directoryPath, {
        recursive: true,
      })
    ).map(String);
    const mdFiles = directoryContent.filter((directoryChild: string) =>
      directoryChild.endsWith('.md')
    );
    const filepaths = mdFiles.map((filename) =>
      path.join(__dirname, '../web-client/src/blogs/content', filename)
    );

    const contents = await Promise.all(
      filepaths.map(async (filepath) => {
        return {
          content: await readfile(filepath, 'utf-8'),
          filepath,
        };
      })
    );

    const mdMetadata = contents.map(({ content, filepath }, index) => {
      const { date, authors, contributors, tags, ...remainingMetadata } =
        extractMetadata(content);
      return {
        ...remainingMetadata,
        name: mdFiles[index].split('/')[1].split('.')[0],
        date: date ? new Date(date) : new Date(),
        authors: authors ? authors.split(',').map((s) => s.trim()) : [],
        contributors: contributors
          ? contributors.split(',').map((s) => s.trim())
          : [],
        tags: tags ? tags.split(',').map((s) => s.trim()) : [],
        filepath: './' + filepath.split('vtmp/web-client/')[1],
      };
    });

    fs.writeFileSync(
      path.join(__dirname, '../web-client/src/blogs/metadata/metadata.ts'),
      buildMetadataFileOutput(mdMetadata)
    );

    fs.writeFileSync(
      path.join(__dirname, '../web-client/src/blogs/metadata/filepaths.ts'),
      buildFilePathsFileOutput(mdMetadata)
    );
  } catch (err) {
    return console.log('Unable to finish generate metadata: ' + err);
  }

  console.log('Metadata extraction completed!');
}

generatedMetadata();
