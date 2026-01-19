import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";


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
  // globalTimeout: 60000,
  expect:{
    timeout: 2000,
    toMatchSnapshot: {maxDiffPixels: 50}
  },
  
  retries: 1,
  reporter: [
    // Use "dot" reporter on CI, "list" otherwise (Playwright default).
    process.env.CI ? ["dot"] : ["list"],
    // Add Argos reporter.
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,

      }),
    ],
  
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    // ['allure-playwright'],
    ['html']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
     globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
     baseURL: process.env.DEV === '1' ? 'http://localhost:4201/' 
            : process.env.STAGING == '1' ? 'http://localhost:4202/' 
            : 'http://localhost:4200/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // Capture screenshot after each test failure.
    screenshot: "only-on-failure",
    actionTimeout: 20000,
    navigationTimeout: 25000,
    video: {
      mode: 'off',
      //size: {width: 1920, height: 1080}
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
       },
    },

    // {
    //   name: 'staging',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //   baseURL: 'http://localhost:4202/'
    //   },
    // },

    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
        video: {
        mode: 'on',
        size: {width: 1920, height: 1080}
       },
      },
    },

    {
      name: 'pageObjectFullscreen',
      testMatch: 'usepageObjects.spec.ts',
      use: {
        viewport: {width: 1920, height: 1080}
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro'],
        // viewport: {width: 400, height: 800}
      }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
    timeout: 120 * 1000,
  }
});
