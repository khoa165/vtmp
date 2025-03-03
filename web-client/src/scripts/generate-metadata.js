const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const extractMetadata = (text) => {
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
        const value = keyValue.substring(colonIndex + 1).trim();
        metadata[key] = value;
      }
    });
  }
  return metadata;
};

const buildMetadataFileOutput = (metadata) =>
  `import { BlogMetadata } from 'types';\n\nexport const allBlogsMetadata: BlogMetadata[] = [\n${metadata
    .map(
      (m) =>
        '  {\n    ' +
        Object.entries(m)
          .filter(([key]) => key !== 'filepath')
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join(',\n    ') +
        '\n  },'
    )
    .join('\n')}\n];\n`;

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const generateImportName = (filename) =>
  filename
    .split('-')
    .map((word) => capitalize(word))
    .join('');

const buildFilePathsFileOutput = (metadata) => {
  metadata.sort((a, b) => b.date - a.date);

  const importPart = metadata
    .map(
      ({ name, filepath }, index) =>
        `import T${generateImportName(name)} from "../content/${filepath}";`
    )
    .join('\n');

  const arrayPart = `export const allBlogsFilepaths = [\n${metadata
    .map(({ name }) => '  T' + generateImportName(name))
    .join(',\n')}\n];\n`;

  return importPart + '\n\n' + arrayPart;
};

const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);

async function generatedMetadata() {
  const blogsMetadata = [];
  try {
    // const __filename = fileURLToPath(require("meta").url);
    const directoryPath = path.join(__dirname, '../blogs/content');
    const directoryContent = await readdir(directoryPath, {
      recursive: true,
    });
    const mdFiles = directoryContent.filter((directoryChild) =>
      directoryChild.endsWith('.md')
    );
    const filepaths = mdFiles.map((filename) =>
      path.join(__dirname, '../blogs/content', filename)
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
      const { date, tags, ...remainingMetadata } = extractMetadata(content);
      return {
        name: mdFiles[index].split('/')[1].split('.')[0],
        ...remainingMetadata,
        date: new Date(date),
        tags: tags.split(',').map((s) => s.trim()),
        filepath,
      };
    });
    blogsMetadata.push(...mdMetadata);

    fs.writeFileSync(
      path.join(__dirname, '../blogs/metadata/metadata.ts'),
      buildMetadataFileOutput(blogsMetadata)
    );

    fs.writeFileSync(
      path.join(__dirname, '../blogs/metadata/filepaths.ts'),
      buildFilePathsFileOutput(blogsMetadata)
    );
  } catch (err) {
    return console.log('Unable to finish generate metadata: ' + err);
  }

  console.log('Metadata extraction completed!');
}

generatedMetadata();
