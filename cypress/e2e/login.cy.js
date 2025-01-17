import LoginTest from "../page_objects/login.page";
const loginPage = new LoginTest();

describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    cy.intercept('https://serverest.dev/login').as('login');
  });

  // it('Should create a new user and confirm its creation', () => {
  //   // Step 1: Create a new user
  //   cy.request('POST', 'https://serverest.dev/usuarios', loginPage.defaultUser).then((response) => {
  //     // Step 2: Validate the creation response
     
  //     expect(response.status).to.eq(201);
  //     expect(response.body.message).to.eq('Cadastro realizado com sucesso');
  //     const userId = response.body._id;
  //   });
  // });

  it('should login with valid credentials', () => {
    const { email, password } = loginPage.defaultUser
    loginPage.enterUsername(email);
    loginPage.enterPassword(password);
    loginPage.submit();
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message).to.eq('Login realizado com sucesso');
      
    });
    cy.url().should('include', '/home'); 
  });

  it('should show error with invalid credentials', () => {
    loginPage.enterUsername('as@vc.com');
    loginPage.enterPassword('invalidPassword');
    loginPage.submit();
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(401);
      expect(response.body.message).to.eq("Email e/ou senha inválidos");
      
    });
    loginPage.getErrorMessage().should('be.visible').and('contain', 'Email e/ou senha inválidos'); // Verifica se a mensagem de erro está visível
  });

  it('should show error with no username', () => {
    loginPage.enterPassword('invalidPassword');
    loginPage.submit();
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.eq(400);    
      expect(response.body.email).to.eq("email é obrigatório");
    });
    loginPage.getErrorMessage().should('be.visible') 
  });
});

