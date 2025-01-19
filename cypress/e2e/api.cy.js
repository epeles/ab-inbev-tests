import LoginTest from "../page_objects/login.page"; // Import the LoginTest page object for user-related actions
const loginPage = new LoginTest(); // Instantiate the LoginTest class
import { faker }
from '@faker-js/faker'; // Import the Faker library to generate random data

// Test suite for user deletion functionality
describe('User Deletion', () => {
  it('Should create a new user and delete it successfully', () => {
    // Step 1: Create a new user
    cy.request('POST', 'https://serverest.dev/usuarios', loginPage.user.new).then((response) => {
      expect(response.status).to.eq(201); // Verify that the user creation status is 201
      const userId = response.body._id; // Store the created user's ID
      // Step 2: Delete the created user
      cy.request('DELETE', `https://serverest.dev/usuarios/${userId}`).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200); // Verify that the deletion status is 200
        expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso'); // Confirm the success message
        // Step 3: Verify the user no longer exists
        cy.request({
          method: 'GET',
          url: `https://serverest.dev/usuarios/${userId}`,
          failOnStatusCode: false
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(400); // Verify the user is not found (status 400)
          expect(getResponse.body.message).to.eq('Usuário não encontrado'); // Confirm the error message
        });
      });
    });
  });
});

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
    const produtos = {
      produtos: [{
          idProduto: "BeeJh5lz3k6kSIzA",
          quantidade: 1
        }, // Product 1 with quantity 1
        {
          idProduto: "K6leHdftCeOJj8BJ",
          quantidade: 3
        } // Product 2 with quantity 3
      ]
    };
    // Step 1: Create a cart with specified products
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/carrinhos',
      headers: {
        Authorization: authToken
      },
      body: produtos
    }).then((response) => {
      expect(response.status).to.eq(201); // Verify cart creation status is 201
      expect(response.body.message).to.eq('Cadastro realizado com sucesso'); // Confirm success message
    });
  });
  it('Delete the cart', () => {
    // Delete the cart
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
  it('Should register, edit, and delete a product', () => {
    let token, produtoID;
    const { email, password } = loginPage.user.new;
    const newItem = {
      nome: faker.commerce.productName(),
      descricao: faker.commerce.productDescription(),
      preco: faker.number.int({ min: 100, max: 700 }),
      quantidade: faker.number.int({ min: 10, max: 300 })
    };
    // Step 1: Check if the user exists and delete them
    cy.request('GET', `https://serverest.dev/usuarios?email=${email}`).then((response) => {
      if (response.body.quantidade > 0) {
        cy.request('DELETE', `https://serverest.dev/usuarios/${response.body.usuarios[0]._id}`);
      }
    });
    // Step 2: Create a new user
    cy.request('POST', 'https://serverest.dev/usuarios', loginPage.user.new).then((response) => {
      expect(response.status).to.eq(201); // Verify user creation
    });
    // Step 3: Authenticate and obtain token
    cy.request('POST', 'https://serverest.dev/login', {
      email,
      password
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200); // Verify login success
      token = loginResponse.body.authorization; // Store authentication token
      // Step 4: Register a new product
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
        // Step 5: Verify the product was created
        cy.request('GET', `https://serverest.dev/produtos/${produtoID}`).then((getProdutoResponse) => {
          const {
            nome,
            preco,
            descricao,
            quantidade
          } = getProdutoResponse.body;
          expect(nome).to.eq(newItem.nome);
          expect(preco).to.eq(newItem.preco);
          expect(descricao).to.eq(newItem.descricao);
          expect(quantidade).to.eq(newItem.quantidade);
        });
        // Step 6: Edit the product
        const updatedItem = {...newItem, preco: faker.number.int({ min: 100, max: 700 })};
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
        // Step 7: Verify the product was edited                
        cy.request('GET', `https://serverest.dev/produtos/${produtoID}`).then((getProdutoResponse) => {
          const {
            nome,
            preco,
            descricao,
            quantidade
          } = getProdutoResponse.body;
          expect(nome).to.eq(updatedItem.nome);
          expect(preco).to.eq(updatedItem.preco);
          expect(descricao).to.eq(updatedItem.descricao);
          expect(quantidade).to.eq(updatedItem.quantidade);
        });
        // Step 8: Delete the user
        cy.request('GET', `https://serverest.dev/usuarios?email=${email}`).then((response) => {
          cy.request('DELETE', `https://serverest.dev/usuarios/${response.body.usuarios[0]._id}`);
        });
      });
    });
  });
});