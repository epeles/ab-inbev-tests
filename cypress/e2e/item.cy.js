import SearchItem from "../page_objects/search.items";
import LoginTest from "../page_objects/login.page";
const loginPage = new LoginTest();
const searchItem = new SearchItem();
import 'cypress-xpath';

describe('Item Search Tests', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    loginPage.enterUsername('epeles@ymail.com');
    loginPage.enterPassword('12345678');
    loginPage.submit();
    cy.intercept(`https://serverest.dev/produtos?nome=${searchItem.item()}`).as('productSearch');
    
  });

  it('should search for an item and show results{', () => {
    cy.get('input[placeholder="Pesquisar Produtos"]').should('exist');
    searchItem.enterItem(searchItem.item());
    searchItem.searchBtn();
    
    cy.wait('@productSearch').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      const quantity = response.body.quantidade;
      cy.get('.card-body').should('have.length', quantity);  

    });
  });

  // it('should show no results message', () => {
  //   searchItem.enterProduct('Produto inexistente');
  //   searchItem.searchBtn();
  //   cy.get('[data-testid="sem-resultados"]').should('be.visible');
  // });
});
