import SearchItem from "../page_objects/search.items";
import LoginTest from "../page_objects/login.page";
const loginPage = new LoginTest();
const searchItem = new SearchItem();

describe('Item Search Tests', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    const { email, password } = loginPage.defaultUser
    loginPage.enterUsername(email);
    loginPage.enterPassword(password);
    loginPage.submit();
    cy.intercept(`https://serverest.dev/produtos?nome=${searchItem.item()}`).as('productSearch');    
  });

  it('should search for an item and show results', () => {
    cy.get('input[placeholder="Pesquisar Produtos"]').should('exist');
    searchItem.enterItem(searchItem.item());
    searchItem.searchBtn();
    cy.wait('@productSearch').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      const quantity = response.body.quantidade;
      cy.get('.card-body').should('have.length', quantity);  
    });
  });

  it('should show no results message', () => {
    searchItem.enterItem('Produto inexistente');
    searchItem.searchBtn();
    // cy.get('[data-testid="sem-resultados"]').should('be.visible');
    cy.contains('Nenhum produto foi encontrado').should('be.visible');
  });

  it('should add an item to the cart', () => {
    searchItem.enterItem(searchItem.item());
    searchItem.searchBtn();
    searchItem.addToListBtn(); // Clica na primeira ocorrência do botão adicionar na lista
    cy.url().should('include', '/minhaListaDeProdutos');
    searchItem.increaseQuantity();
    searchItem.addToCartBtn();
    cy.url().should('include', '/carrinho');
  });
});
