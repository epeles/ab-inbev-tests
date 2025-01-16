import LoginTest from "../page_objects/login.page";
const loginPage = new LoginTest();

describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    cy.intercept('https://serverest.dev/login').as('login');
  });

  it('should login with valid credentials', () => {
    loginPage.enterUsername('epeles@ymail.com');
    loginPage.enterPassword('12345678');
    loginPage.submit();
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message).to.eq('Login realizado com sucesso');
      
    });
    cy.url().should('include', '/home'); // Verifica se redirecionou para o dashboard
  });

  it('should show error with invalid credentials', () => {
    loginPage.enterUsername('as@vc.com');
    loginPage.enterPassword('invalidPassword');
    loginPage.submit();
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(401);
      expect(response.body.message).to.eq("Email e/ou senha inválidos");
      
    });
    loginPage.getErrorMessage().should('be.visible'); // Verifica se a mensagem de erro está visível
  });
});