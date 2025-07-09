import { capitalize } from 'remeda';
import { z, ZodObject, ZodRawShape } from 'zod';

export const formatEnumName = (
  name: string,
  options?: {
    uppercase: boolean;
  }
) => {
  return name
    .toLowerCase()
    .split('_')
    .map((word) => (options?.uppercase ? word.toUpperCase() : capitalize(word)))
    .join(' ');
};

// <T extends ZodObject<ZodRawShape>> means T must be a Zod object schema
// ZodRawShape ensures that each key maps to a valid Zod schema like  { PORT: z.number(), URL: z.string() }
export const parseEnvConfig = <T extends ZodObject<ZodRawShape>>({
  env,
  schema,
  workspaceName,
}: {
  env: NodeJS.ProcessEnv;
  schema: T;
  workspaceName: string;
}): z.infer<T> => {
  const envs = schema.safeParse(env);
  if (!envs.success) {
    const issues = envs.error.issues
      .map((issue) => `${issue.path[0]}: ${issue.message}`)
      .join(', ');
    throw new Error(
      `Environment variables are not set correctly in ${workspaceName} workspace. Please check your .env file.\n Problems with: ${issues}`
    );
  }
  return envs.data;
};
