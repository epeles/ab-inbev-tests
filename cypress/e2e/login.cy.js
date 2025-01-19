import LoginTest from "../page_objects/login.page";
const loginPage = new LoginTest();

describe('Login Tests', () => {
  beforeEach(() => {
    // Visit the base URL configured in Cypress
    cy.visit(Cypress.config('baseUrl'));
    // Intercept requests to the login endpoint
    cy.intercept('https://serverest.dev/login').as('login');
  });

  it('Should create a new user and confirm its creation', () => {
    // Check if the user already exists and delete if it does
    cy.request('GET', `https://serverest.dev/usuarios?email=${loginPage.user.default.email}`).then((response) => {
      if (response.body.quantidade > 0) {
        cy.request('DELETE', `https://serverest.dev/usuarios/${response.body.usuarios[0]._id}`);
      }
    });

    // Step 1: Create a new user
    cy.request('POST', 'https://serverest.dev/usuarios', loginPage.user.default).then((response) => {
      // Step 2: Validate the creation response
      expect(response.status).to.eq(201); // Check if the status code is 201 (Created)
      expect(response.body.message).to.eq('Cadastro realizado com sucesso'); // Check if the response message is correct
    });
  });

  it('should login with valid credentials', () => {
    const { email, password } = loginPage.user.default;
    loginPage.enterUsername(email); // Enter the username
    loginPage.enterPassword(password); // Enter the password
    loginPage.submit(); // Submit the login form
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(200); // Check if the status code is 200 (OK)
      expect(response.body.message).to.eq('Login realizado com sucesso'); // Check if the response message is correct
    });
    cy.url().should('include', '/home'); // Check if the URL includes '/home'
  });

  it('should show error with invalid credentials', () => {
    loginPage.enterUsername('as@vc.com'); // Enter an invalid username
    loginPage.enterPassword('invalidPassword'); // Enter an invalid password
    loginPage.submit(); // Submit the login form
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(401); // Check if the status code is 401 (Unauthorized)
      expect(response.body.message).to.eq("Email e/ou senha inválidos"); // Check if the response message is correct
    });
    loginPage.getErrorMessage().should('be.visible').and('contain', 'Email e/ou senha inválidos'); // Check if the error message is visible and contains the expected text
  });

  it('should show error with no username', () => {
    loginPage.enterPassword('invalidPassword'); // Enter an invalid password
    loginPage.submit(); // Submit the login form without entering a username
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(400); // Check if the status code is 400 (Bad Request)
      expect(response.body.email).to.eq("email é obrigatório"); // Check if the response message is correct
    });
    loginPage.getErrorMessage().should('be.visible').and('have.css', 'background-color', 'rgb(243, 150, 154)')// Check if the error message is visible and the background color is correct
  });
});

