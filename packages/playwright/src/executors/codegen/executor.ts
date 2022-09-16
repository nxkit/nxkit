import { CodegenExecutorSchema } from './schema';

export default async function runExecutor(options: CodegenExecutorSchema) {
  console.log('Executor ran for Codegen', options);
  return {
    success: true,
  };
}
