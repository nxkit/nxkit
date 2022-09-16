import { ShowReportExecutorSchema } from './schema';

export default async function runExecutor(options: ShowReportExecutorSchema) {
  console.log('Executor ran for ShowReport', options);
  return {
    success: true,
  };
}
