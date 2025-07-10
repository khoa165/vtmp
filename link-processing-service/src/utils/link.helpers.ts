export const formatJobDescription = (description?: {
  responsibility?: string | undefined;
  requirement?: string | undefined;
  preferred?: string | undefined;
}): string | undefined => {
  const formatSection = (title: string, content: string) => {
    const lines = content
      .trim()
      .replace(/\n\n/g, '\n')
      .split('\n')
      .map((line) => {
        const words = line.trim().split(/\s+/);
        if (words[0] && words.length && !/^[a-zA-Z]/.test(words[0])) {
          words.shift();
        }
        return `- ${words.join(' ')}`;
      });
    return `${title}:\n${lines.join('\n')}\n`;
  };

  let result = '';
  if (description && description.responsibility) {
    result += formatSection('Responsibilities', description.responsibility);
  }
  if (description && description.requirement) {
    result += formatSection('Requirements', description.requirement);
  }
  if (description && description.preferred) {
    result += formatSection('Preferred Qualifications', description.preferred);
  }

  return result.length > 0 ? result.trim() : undefined;
};

export const stringToEnumValue = <T extends Record<string, string>>({
  stringValue,
  enumObject,
}: {
  stringValue: string | undefined;
  enumObject: T;
}): T[keyof T] | undefined => {
  if (!stringValue) return undefined;
  const match = Object.values(enumObject).find((v) => v === stringValue);
  return match as T[keyof T];
};
