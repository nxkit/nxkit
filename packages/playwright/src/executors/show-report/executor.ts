import { PlaywrightCLI } from '../../utils/playwright';
import { ShowReportExecutorSchema } from './schema';

export default async function runExecutor(options: ShowReportExecutorSchema) {
  PlaywrightCLI.showReport(options.reportPath);
  return {
    success: true,
  };
}
