# Flight Network Automation

## Introduction

The Flight Network Automation Test Framework is utilized for automated testing of Flight Network's web application.

This framework, built with Playwright and TypeScript, ensures reliable and efficient test execution with detailed reporting capabilities.

## Prerequisite

    Node > 14.0

## Directory Structure

The project directory structure is as follows:

<pre>
js-etravel/
├── src/
│ ├── tests/
│ │ ├── flights/
│ │ │ ├── searchFlight.spec.ts
│ │ │ ├── filterFlight.spec.ts
│ ├── pages/
│ │ ├── SearchFlightPage.ts
│ │ ├── SearchResultPage.ts
│ ├── utils/
│ │ ├── test-data.ts
│ │ ├── constants.ts
├── playwright.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.json
├── package.json
├── package-lock.json
├── Readme.md
</pre>

## Installation

To set up the project, follow these steps:

1. **Install Dependencies**:

   Run the following command to install project dependencies :

   ```bash
    npm install
   ```

2. **Execute Test**


   To install the browser, run the following command:

   ```bash
   npm run install:browsers
   ```

   To execute the tests, run the following command:

   ```bash
   npm run test:default
   ```

This will run all tests in the `src/tests/` directory and generate a report.

## Writing Tests

Tests are located in the `src/tests/` directory.

Page objects are located in the `src/pages/` directory,

Utility functions are in the `src/utils/` directory.

## Configuration Files

`playwright.config.ts`: Configuration file for Playwright, including settings for the test runner, browser options, and other configurations required for running tests.

`tsconfig.json`: TypeScript configuration file that sets the compiler options for TypeScript.

`.eslintrc.json`: ESLint configuration file to enforce coding standards and ensure code quality.

`.prettierrc.json`: Prettier will format project's files according to the specified rules and configuration.

## Reporting

Test results are generated in the `test-results/` directory, and HTML reports can be found in the `reports/` directory.

After running tests, open the reports/index.html file to view the test results.