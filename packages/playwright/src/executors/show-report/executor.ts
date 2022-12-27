import { logger } from '@nrwl/devkit';
import { PlaywrightCLI } from '../../utils/playwright';
import { ShowReportExecutorSchema } from './schema';

export default async function runExecutor(options: ShowReportExecutorSchema) {
  try {
    await PlaywrightCLI.showReport(options.reportPath);

    return { success: true };
  } catch (error) {
    // ¯\_(ツ)_/¯
    logger.error(error.stdout);
    logger.error(error.error);
    logger.error('❌ Error running showing playwright report');
    return { success: false };
  }
}
