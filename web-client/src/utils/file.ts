import { BlogFileMapping, BlogMetadata } from '#vtmp/web-client/types';

export const getFileName = (filepath: string): string => {
  console.log('filepath', filepath);
  const fullFileName = filepath.split('/').at(-1);
  console.log('fullFileName', fullFileName);
  if (!fullFileName) {
    throw new Error('Invalid file path');
  }
  const filenameWithoutExtension = fullFileName.split('.')[0].split('-');
  console.log('filenameWithoutExtension', filenameWithoutExtension);
  const filename = filenameWithoutExtension
    .slice(0, filenameWithoutExtension.length - 1)
    .join('-');
  console.log('filename', filename);
  return filename;
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
  metadata: BlogMetadata[]
): BlogFileMapping => {
  const mapping: BlogFileMapping = {};
  metadata.forEach((blogMeta) => {
    mapping[blogMeta.name] = { ...blogMeta, path: blogMeta.filepath };
  });
  return mapping;
};
