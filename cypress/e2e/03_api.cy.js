import SearchItem from "../support/page_objects/search.items";
import LoginTest from "../support/page_objects/login.page";
import { faker } from '@faker-js/faker';

let constants; // Define constants at the top level

const generateProductData = () => ({
  nome: faker.commerce.productName(),
  descricao: faker.commerce.productDescription(),
  preco: faker.number.int({ min: 100, max: 700 }),
  quantidade: faker.number.int({ min: 10, max: 300 })
});

const createAuthenticatedUser = (user) => {
  return cy.request('GET', `${constants.API.USERS}?email=${user.email}`)
    .then((response) => {
      if (response.body.quantidade > 0) {
        return cy.request('DELETE', `${constants.API.USERS}/${response.body.usuarios[0]._id}`);
      }
    })
    .then(() => cy.request('POST', constants.API.USERS, user))
    .then(() => cy.request('POST', constants.API.LOGIN, {
      email: user.email,
      password: user.password
    }))
    .then((response) => response.body.authorization);
};

describe('Shopping Cart Tests', () => {
  let authToken;
  const loginPage = new LoginTest();
  const searchItem = new SearchItem();

  before(() => {
    // Load constants first, then proceed with other operations
    cy.fixture('constants').then((data) => {
      constants = data;
      // Only after constants are loaded, create the authenticated user
      return createAuthenticatedUser(loginPage.user.default);
    }).then((token) => {
      authToken = token;
    });
  });

  it('Should create a new cart for the user', () => {
    cy.request({
      method: 'POST',
      url: constants.API.CARTS,
      headers: {
        Authorization: authToken
      },
      body: searchItem.produtos
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq(constants.MESSAGES.SUCCESS_REGISTER);
    });
  });

  it('Delete the cart', () => {
    cy.request({
      method: 'DELETE',
      url: `${constants.API.CARTS}/concluir-compra`,
      headers: {
        Authorization: authToken
      }
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200);
      expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso');
    });
  });
});

describe('Product Test', () => {
  let token, produtoID, updatedItem;
  const loginPage = new LoginTest();
  const { email, password } = loginPage.user.new;
  const newItem = generateProductData();

  before(() => {
    cy.fixture('constants').then((data) => {
      constants = data;
      return createAuthenticatedUser(loginPage.user.new);
    }).then((authToken) => {
      token = authToken;
    });
  });

  it('should register a new product', () => {
    cy.request({
      method: 'POST',
      url: constants.API.PRODUCTS,
      headers: {
        Authorization: token
      },
      body: newItem
    }).then((produtoResponse) => {
      expect(produtoResponse.status).to.eq(201);
      produtoID = produtoResponse.body._id;
    });
  });

  it('should edit the product', () => {
    updatedItem = { ...newItem, preco: faker.number.int({ min: 100, max: 700 }) };
    cy.request({
      method: 'PUT',
      url: `${constants.API.PRODUCTS}/${produtoID}`,
      headers: {
        Authorization: token
      },
      body: updatedItem
    }).then((updateResponse) => {
      expect(updateResponse.status).to.eq(200);
    });
  });

  it('should verify the product was edited', () => {
    cy.request('GET', `${constants.API.PRODUCTS}/${produtoID}`).then((getProdutoResponse) => {
      const { nome, preco, descricao, quantidade } = getProdutoResponse.body;
      expect(nome).to.eq(updatedItem.nome);
      expect(preco).to.eq(updatedItem.preco);
      expect(descricao).to.eq(updatedItem.descricao);
      expect(quantidade).to.eq(updatedItem.quantidade);
    });
  });

  it('should delete the user', () => {
    cy.request('GET', `${constants.API.USERS}?email=${email}`).then((response) => {
      cy.request('DELETE', `${constants.API.USERS}/${response.body.usuarios[0]._id}`);
    });
  });
});