import { ShowReportExecutorSchema } from './schema';
import executor from './executor';

const options: ShowReportExecutorSchema = {};

describe('ShowReport Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
