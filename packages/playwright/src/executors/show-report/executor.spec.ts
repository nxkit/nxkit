import { PlaywrightCLI } from '../../utils/playwright';
import executor from './executor';
import { ShowReportExecutorSchema } from './schema';

jest.mock('../../utils/playwright');

const options: ShowReportExecutorSchema = {
  reportPath: '',
};

describe('ShowReport Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(PlaywrightCLI.showReport).toHaveBeenCalled();
    expect(output.success).toBe(true);
  });
});
