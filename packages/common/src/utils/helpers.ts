import { capitalize } from 'remeda';
import { z, ZodObject, ZodRawShape } from 'zod';

export const formatEnumName = (name: string) => {
  return name
    .toLowerCase()
    .split('_')
    .map((word) => capitalize(word))
    .join(' ');
};

// <T extends ZodObject<ZodRawShape>> means T must be a Zod object schema
// ZodRawShape ensures that each key maps to a valid Zod schema like  { PORT: z.number(), URL: z.string() }
export const parseEnvConfig = <T extends ZodObject<ZodRawShape>>({
  env,
  schema,
}: {
  env: NodeJS.ProcessEnv;
  schema: T;
}): z.infer<T> => {
  const envs = schema.safeParse(env);
  if (!envs.success) {
    console.log('Problems with: ', envs.error.issues);
    const issues = envs.error.issues
      .map((issue) => `${issue.path[0]}: ${issue.message}`)
      .join(', ');
    throw new Error(
      `Environment variables are not set correctly. Please check your .env file. Problems with: ${issues}`
    );
  }
  return envs.data;
};
