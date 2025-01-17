**Serverest Test Automation Repository**

This repository contains automated tests for the serverest application, developed using Cypress and JavaScript. The tests are designed to validate the functionality and performance of various endpoints within the serverest API.

**Table of Contents**

•[Overview](#overview)

•[Prerequisites](#prerequisites)

•[Installation](#installation)

•[Running Tests](#running-tests)

•[Test Cases](#test-cases)


**Overview**

The serverest Automation Repository aims to ensure the reliability and robustness of the serverest API through comprehensive automated testing. The tests cover a range of scenarios, including user authentication, product management, and order processing.

**Prerequisites**

Before running the tests, ensure you have the following installed:

•[Node.js](https://nodejs.org/) (version 14 or higher)

•[npm](https://www.npmjs.com/) (Node Package Manager)

**Installation**

1.Clone the repository:

```bash
git clone https://github.com/epeles/ab-inbev-tests.git
```

```bash
cd ab-inbev-tests
```

2.Install the necessary dependencies:

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
**Test Cases**

The repository includes the following test cases:

1.**User Authentication**: Verifies that users can successfully log in and receive a valid authentication token.

2.**Product Management**: Tests the creation, retrieval, updating, and deletion of products within the API Swagger.

3.**Order Processing**: Ensures that orders can be placed, retrieved, updated, and deleted correctly.
