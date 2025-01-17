import LoginTest from "../page_objects/login.page";
const loginPage = new LoginTest();

describe('User Deletion', () => {
    it('Should create a new user and delete it successfully', () => {  
      // Step 1: Create a new user
      cy.request('POST', 'https://serverest.dev/usuarios', loginPage.newUser.new).then((response) => {
        // Step 2: Store the user ID
        expect(response.status).to.eq(201);
        const userId = response.body._id;
  
        // Step 3: Delete the user
        cy.request('DELETE', `https://serverest.dev/usuarios/${userId}`).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
          expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso');
  
          // Step 4: Verify deletion
          cy.request({
            method: 'GET',
            url: `https://serverest.dev/usuarios/${userId}`,
            failOnStatusCode: false 
          }).then((getResponse) => {
            expect(getResponse.status).to.eq(400);
            expect(getResponse.body.message).to.eq('Usuário não encontrado');
          });
        });
      });
    });
});

describe('Shopping Cart Tests', () => {
    let authToken;
  
    before(() => {
        cy.request('GET', `https://serverest.dev/usuarios?email=${loginPage.newUser.default.email}`).then((response) => {
            if (response.body.quantidade > 0) {
              cy.request('DELETE', `https://serverest.dev/usuarios/${response.body.usuarios[0]._id}`);
            }
        });
      
        cy.request('POST', 'https://serverest.dev/usuarios', loginPage.newUser.default).then((response) => {
          expect(response.status).to.eq(201); // Check if the status code is 201 (Created)
          expect(response.body.message).to.eq('Cadastro realizado com sucesso'); // Check if the response message is correct

          // Step 2: Authenticate and obtain the token
          cy.request('POST', 'https://serverest.dev/login', {
            email: loginPage.newUser.default.email,
            password: loginPage.newUser.default.password
          }).then((response) => {
            expect(response.status).to.eq(200);
            authToken = response.body.authorization;
          });
        });
      });
  
    it('Should create a new cart for the user', () => {
        const produtos = {
            produtos: [
              {
                "idProduto": "BeeJh5lz3k6kSIzA",
                "quantidade": 1
              },
              {
                "idProduto": "K6leHdftCeOJj8BJ",
                "quantidade": 3
              }
            ]
        };
  
      cy.request({
        method: 'POST',
        url: 'https://serverest.dev/carrinhos',
        headers: {
          Authorization: authToken
        },
        body: produtos
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      });
    });

    it('Delete the cart', () => {
        cy.request({
            method: 'DELETE',
            url: 'https://serverest.dev/carrinhos/concluir-compra',
            headers: {
              authorization: authToken, // Ensure `authToken` contains the valid token string
            },
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200);
            expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso');
          });
        }) 
});