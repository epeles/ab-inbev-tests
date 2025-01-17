describe('User Creation and Verification', () => {
    it('Should create a new user and confirm its creation', () => {
      const newUser = {
        nome: 'Cypress Test',
        email: `cypress.test${Date.now()}@example.com`,
        password: 'password123',
        administrador: 'true'
      };
  
      // Step 1: Create a new user
      cy.request('POST', 'https://serverest.dev/usuarios', newUser).then((response) => {
        // Step 2: Validate the creation response
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
        const userId = response.body._id;
  
        // Step 3: Confirm the user was created
        cy.request('GET', `https://serverest.dev/usuarios/${userId}`).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body.nome).to.eq(newUser.nome);
          expect(getResponse.body.email).to.eq(newUser.email);
        });
      });
    });
  });

  describe('User Deletion', () => {
    it('Should create a new user and delete it successfully', () => {
      const newUser = {
        nome: 'Cypress Test User',
        email: `cypress.test${Date.now()}@example.com`,
        password: 'password123',
        administrador: 'true'
      };
  
      // Step 1: Create a new user
      cy.request('POST', 'https://serverest.dev/usuarios', newUser).then((response) => {
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
    let userId;
  
    const newUser = {
        nome: 'Cypress Test',
        email: `cypress.test${Date.now()}@example.com`,
        password: 'password123',
        administrador: 'true'
    };


    before(() => {
        // Step 1: Create a new user
        cy.request('POST', 'https://serverest.dev/usuarios', newUser).then((response) => {
            expect(response.status).to.eq(201);
            userId = response.body._id;

            // Step 2: Authenticate and obtain the token
            cy.request('POST', 'https://serverest.dev/login', {
                email: newUser.email,
                password: newUser.password
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
  });