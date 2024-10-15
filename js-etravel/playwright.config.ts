import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './src/tests',
  timeout: 60000,
  retries: 1,
  workers: 1, 
  reporter: [ ['html', { outputFolder: 'reports' }] ],
  use: {
    viewport: { width: 1280, height: 720 },
    actionTimeout: 60000,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        video: 'retain-on-failure'
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
        video: 'retain-on-failure'
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 },
        video: 'retain-on-failure',      },
    },
  ],
}

export default config
