import { BlogFileMapping, BlogMetadata } from 'types';

export const getFileName = (filepath: string): string => {
  // Example: /static/media/something-fun.7142a8c9d1daebf8832a.md
  const fullFileName = filepath.split('/')[3];
  const partialFileName = fullFileName.split('.')[0];
  return partialFileName;
};

export const removeMetadata = (text: string): string => {
  const metaRegExp = RegExp(/^---[\s\S]*?---\s*/);
  const match = metaRegExp.exec(text);
  if (match) {
    return text.slice(match[0].length);
  }
  return text;
};

export const buildFileMetadata = (
  filepaths: string[],
  metadata: BlogMetadata[]
): BlogFileMapping => {
  const mapping = {};
  metadata.forEach(({ name, ...props }) => {
    mapping[name] = { name, ...props };
  });
  filepaths.forEach((filepath) => {
    mapping[getFileName(filepath)].path = filepath;
  });
  return mapping;
};
