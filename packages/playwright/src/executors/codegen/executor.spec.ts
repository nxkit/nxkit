import { CodegenExecutorSchema } from './schema';
import executor from './executor';

const options: CodegenExecutorSchema = {};

describe('Codegen Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
