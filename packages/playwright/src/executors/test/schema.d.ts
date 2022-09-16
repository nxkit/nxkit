export interface TestExecutorSchema {
  outputPath: string;
  playwrightConfig: string;
  headed?: boolean;
  browser?: string;
  debug?: boolean;
  forbidOnly?: boolean;
  grep?: string;
  grepInvert?: string;
  globalTimeout?: number;
  list?: boolean;
  maxFailures?: number;
  project?: string;
  quiet?: boolean;
  repeatEach?: number;
  reporter?: string;
  retries?: number;
  shard?: string;
  timeout?: number;
  updateSnapshots?: boolean;
  workers?: number;
}
