import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

require('dotenv').config();


export default defineConfig<TestOptions>({
  timeout: 40000,
  globalTimeout: 60000,
  expect:{
    timeout: 2000
  },

  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
     globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
     baseURL: 'http://localhost:4200/',

  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
    },
  ],
});