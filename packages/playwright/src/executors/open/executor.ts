import { OpenExecutorSchema } from './schema';

export default async function runExecutor(options: OpenExecutorSchema) {
  console.log('Executor ran for Open', options);
  return {
    success: true,
  };
}
