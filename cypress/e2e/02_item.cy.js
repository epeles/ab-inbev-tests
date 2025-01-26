import SearchItem from "../page_objects/search.items";
import LoginTest from "../page_objects/login.page";

describe('Item Search Tests', () => {
  const loginPage = new LoginTest();
  const searchItem = new SearchItem();
  let authToken;
  let constants;

  before(() => {
    cy.fixture('constants').then((data) => {
      constants = data;
    });
  });

  const setupUser = () => {
    const { email, password } = loginPage.user.default;
    
    return cy.request('GET', `${constants.API.USERS}?email=${email}`)
      .then((response) => {
        if (response.body.quantidade > 0) {
          return cy.request('DELETE', `${constants.API.USERS}/${response.body.usuarios[0]._id}`);
        }
      })
      .then(() => {
        return cy.request('POST', constants.API.USERS, loginPage.user.default);
      })
      .then(() => {
        return cy.request('POST', constants.API.LOGIN, { email, password });
      })
      .then((response) => {
        authToken = response.body.authorization;
      });
  };

  const verifyProductExists = () => {
    return cy.request(constants.API.PRODUCTS)
      .then((response) => {
        expect(response.status).to.eq(200);
        const produtos = response.body.produtos;
        const itemExists = produtos.some((produto) => 
          produto.nome.includes(searchItem.item())
        );
        
        if (!itemExists) {
          throw new Error(`Product ${searchItem.item()} not found`);
        }
      });
  };

  beforeEach(() => {
    setupUser();
    cy.visit(Cypress.config('baseUrl'));
    const { email, password } = loginPage.user.default;
    loginPage.enterUsername(email);
    loginPage.enterPassword(password);
    loginPage.submit();
    verifyProductExists();
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
    cy.contains('Nenhum produto foi encontrado').should('be.visible');
  });

  it('should add an item to the cart', () => {
    searchItem.enterItem(searchItem.item());
    searchItem.searchBtn();
    searchItem.addToListBtn();
    cy.url().should('include', '/minhaListaDeProdutos');
    cy.contains('Total: 1').should('be.visible');
    
    it('should extract the price value and store it', () => {
      cy.contains('Preço R$')
        .invoke('text')
        .then((text) => {
          const number = text.match(/\d+/)[0];
          cy.wrap(number).as('priceValue');
        });
    });
  
    it('should increase the quantity and verify the total price', () => {
      searchItem.increaseQuantity();
      cy.contains('Total: 2').should('be.visible');
      cy.get('@priceValue').then((priceValue) => {
        cy.contains(priceValue * 2).should('be.visible');
      });
    });
  
    it('should add the item to the cart and verify the cart URL', () => {
      searchItem.addToCartBtn();
      cy.url().should('include', '/carrinho');
    });
  });
});