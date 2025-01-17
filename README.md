# ServeRest Test Automation

This repository contains automated tests for the serverest application, developed using Cypress and JavaScript. The tests are designed to validate the functionality and performance of various endpoints within the serverest API.

**Table of Contents**

•[Overview](#overview)

•[Prerequisites](#prerequisites)

•[Installation](#installation)

•[Running Tests](#running-tests)

•[GitHub Actions Pipeline](#github-actions-pipeline)

•[Cypress Cloud Reports](#cypress-cloud-reports)

•[Test Cases](#test-cases)


**Overview**

The serverest Automation Repository aims to ensure the reliability and robustness of the serverest API through comprehensive automated testing. The tests cover a range of scenarios, including user authentication, product management, and order processing.

**Prerequisites**

Before running the tests, ensure you have the following installed:

•[Node.js](https://nodejs.org/) (version 14 or higher)

•[npm](https://www.npmjs.com/) (Node Package Manager)

**Installation**

1. Clone the repository:

```bash
git clone https://github.com/epeles/ab-inbev-tests.git
```

```bash
cd ab-inbev-tests
```

2. Install the necessary dependencies:

```bash
npm install
```

**Running Tests**

To execute the tests, use the following command:

```bash
npx cypress open
```

This command will launch the Cypress Test Runner, allowing you to select and run individual tests or all tests in the suite.

To run the tests in headless mode, use the following command:

```bash
npx cypress run
```

**GitHub Actions Pipeline**

This repository includes a GitHub Actions pipeline to run Cypress tests automatically in Chrome and Firefox. 

**Cypress Cloud Reports**

After the pipeline execution on GitHub Actions, the test reports will be available on Cypress Cloud. You can access detailed test results, including screenshots and videos of the test runs, on your Cypress Dashboard.



**Test Cases**

The repository includes the following test cases:

1. **Login Tests:** Validate user authentication, including creating a new user, logging in with valid/invalid credentials, and handling missing username errors.

2. **Search Tests:** Test product search functionality, ensuring correct results display, handling no results scenarios, and adding items to the cart.

3. **API Tests:** Interact with the backend API to create users, authenticate, and manage shopping carts, validating successful operations and error handling.
