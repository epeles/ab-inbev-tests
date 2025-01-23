import SearchItem from "../page_objects/search.items"; // Import the SearchItem page object for interacting with search functionality
import LoginTest from "../page_objects/login.page"; // Import the LoginTest page object for handling login actions
const loginPage = new LoginTest(); // Create an instance of the LoginTest class
const searchItem = new SearchItem(); // Create an instance of the SearchItem class
import { faker }
from '@faker-js/faker'; // Import the Faker library to generate random data

// Test suite for shopping cart functionality
describe('Shopping Cart Tests', () => {
  let authToken; // Variable to store the authentication token
  before(() => {
    // Step 1: Check if the default user exists and delete it
    cy.request('GET', `https://serverest.dev/usuarios?email=${loginPage.user.default.email}`).then((response) => {
      if (response.body.quantidade > 0) {
        cy.request('DELETE', `https://serverest.dev/usuarios/${response.body.usuarios[0]._id}`);
      }
    });
    // Step 2: Create a default user
    cy.request('POST', 'https://serverest.dev/usuarios', loginPage.user.default).then((response) => {
      expect(response.status).to.eq(201); // Verify the user creation status is 201
      expect(response.body.message).to.eq('Cadastro realizado com sucesso'); // Confirm success message
      // Step 3: Authenticate the user and retrieve the token
      cy.request('POST', 'https://serverest.dev/login', {
        email: loginPage.user.default.email,
        password: loginPage.user.default.password
      }).then((response) => {
        expect(response.status).to.eq(200); // Verify successful authentication
        authToken = response.body.authorization; // Store the authentication token
      });
    });
  });
  it('Should create a new cart for the user', () => {
    
    // Create a cart with specified products
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/carrinhos',
      headers: {
        Authorization: authToken
      },
      body: searchItem.produtos
    }).then((response) => {
      expect(response.status).to.eq(201); // Verify cart creation status is 201
      expect(response.body.message).to.eq('Cadastro realizado com sucesso'); // Confirm success message
    });
  });
  it('Delete the cart', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://serverest.dev/carrinhos/concluir-compra',
      headers: {
        Authorization: authToken
      }
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200); // Verify successful deletion
      expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso'); // Confirm success message
    });
  });
});

// Test suite for product functionality
describe('Product Test', () => {
  let token, produtoID, updatedItem;
  const { email, password } = loginPage.user.new;
  const newItem = {
    nome: faker.commerce.productName(),
    descricao: faker.commerce.productDescription(),
    preco: faker.number.int({ min: 100, max: 700 }),
    quantidade: faker.number.int({ min: 10, max: 300 })
  };

  it('should check if the user exists and delete them', () => {
    cy.request('GET', `https://serverest.dev/usuarios?email=${email}`).then((response) => {
      if (response.body.quantidade > 0) {
        cy.request('DELETE', `https://serverest.dev/usuarios/${response.body.usuarios[0]._id}`);
      }
    });
  });

  it('should create a new user', () => {
    cy.request('POST', 'https://serverest.dev/usuarios', loginPage.user.new).then((response) => {
      expect(response.status).to.eq(201); // Verify user creation
    });
  });

  it('should authenticate and obtain token', () => {
    cy.request('POST', 'https://serverest.dev/login', { email, password }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200); // Verify login success
      token = loginResponse.body.authorization; // Store authentication token
    });
  });

  it('should register a new product', () => {
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/produtos',
      headers: {
        Authorization: token
      },
      body: newItem
    }).then((produtoResponse) => {
      expect(produtoResponse.status).to.eq(201); // Verify product registration
      produtoID = produtoResponse.body._id; // Store product ID
    });
  });

  it('should edit the product', () => {
    updatedItem = { ...newItem, preco: faker.number.int({ min: 100, max: 700 }) };
    cy.request({
      method: 'PUT',
      url: `https://serverest.dev/produtos/${produtoID}`,
      headers: {
        Authorization: token
      },
      body: updatedItem
    }).then((updateResponse) => {
      expect(updateResponse.status).to.eq(200); // Verify successful update
    });
  });

  it('should verify the product was edited', () => {
    cy.request('GET', `https://serverest.dev/produtos/${produtoID}`).then((getProdutoResponse) => {
      const { nome, preco, descricao, quantidade } = getProdutoResponse.body;
      expect(nome).to.eq(updatedItem.nome);
      expect(preco).to.eq(updatedItem.preco);
      expect(descricao).to.eq(updatedItem.descricao);
      expect(quantidade).to.eq(updatedItem.quantidade);
    });
  });

  it('should delete the user', () => {
    cy.request('GET', `https://serverest.dev/usuarios?email=${email}`).then((response) => {
      cy.request('DELETE', `https://serverest.dev/usuarios/${response.body.usuarios[0]._id}`);
    });
  });
});