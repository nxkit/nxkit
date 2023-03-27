export interface TestExecutorSchema {
  outputPath: string;
  playwrightConfig: string;
  devServerTarget?: string;
  baseUrl?: string;
  skipServe?: boolean;

  // Playwright CLI options
  headed?: boolean;
  browser?: string;
  debug?: boolean;
  forbidOnly?: boolean;
  grep?: string;
  grepInvert?: string;
  globalTimeout?: number;
  list?: boolean;
  maxFailures?: number;
  pwProject?: string;
  quiet?: boolean;
  repeatEach?: number;
  reporter?: string;
  retries?: number;
  shard?: string;
  timeout?: number;
  ui?: boolean;
  updateSnapshots?: boolean;
  workers?: number;
}
