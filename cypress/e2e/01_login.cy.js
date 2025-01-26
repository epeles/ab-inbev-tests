import LoginTest from "../support/page_objects/login.page";

describe('Login Tests', () => {
  const loginPage = new LoginTest();
  let constants;

  before(() => {
    cy.fixture('constants').then((data) => {
      constants = data;
    });
  });

  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    cy.intercept(constants.API.LOGIN).as('login');
  });

  const checkAndDeleteUser = (email) => {
    return cy.request('GET', `${constants.API.USERS}?email=${email}`).then((response) => {
      if (response.body.quantidade > 0) {
        return cy.request('DELETE', `${constants.API.USERS}/${response.body.usuarios[0]._id}`);
      }
    });
  };

  it('Should create a new user and confirm its creation', () => {
    checkAndDeleteUser(loginPage.user.default.email).then(() => {
      cy.request('POST', constants.API.USERS, loginPage.user.default).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq(constants.MESSAGES.SUCCESS_REGISTER);
      });
    });
  });

  it('should login with valid credentials', () => {
    const { email, password } = loginPage.user.default;
    loginPage.enterUsername(email); // Enter the username
    loginPage.enterPassword(password); // Enter the password
    loginPage.submit(); // Submit the login form
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(200); // Check if the status code is 200 (OK)
      expect(response.body.message).to.eq(constants.MESSAGES.SUCCESS_LOGIN); // Check if the response message is correct
    });
    cy.url().should('include', '/home'); // Check if the URL includes '/home'
  });

  it('should show error with invalid credentials', () => {
    loginPage.enterUsername('as@vc.com'); // Enter an invalid username
    loginPage.enterPassword('invalidPassword'); // Enter an invalid password
    loginPage.submit(); // Submit the login form
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(401); // Check if the status code is 401 (Unauthorized)
      expect(response.body.message).to.eq(constants.MESSAGES.INVALID_CREDENTIALS); // Check if the response message is correct
    });
    loginPage.getErrorMessage().should('be.visible').and('contain', constants.MESSAGES.INVALID_CREDENTIALS); // Check if the error message is visible and contains the expected text
  });

  it('should show error with no username', () => {
    loginPage.enterPassword('invalidPassword'); // Enter an invalid password
    loginPage.submit(); // Submit the login form without entering a username
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(400); // Check if the status code is 400 (Bad Request)
      expect(response.body.email).to.eq(constants.MESSAGES.REQUIRED_EMAIL); // Check if the response message is correct
    });
    loginPage.getErrorMessage().should('be.visible').and('have.css', 'background-color', 'rgb(243, 150, 154)')// Check if the error message is visible and the background color is correct
  });
});