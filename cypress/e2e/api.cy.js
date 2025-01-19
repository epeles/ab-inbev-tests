import LoginTest from "../page_objects/login.page"; // Import the LoginTest page object for user-related actions
const loginPage = new LoginTest(); // Create an instance of the LoginTest class

// Test suite for User Deletion functionality
describe('User Deletion', () => {
    // Test case: Create a new user and delete it successfully
    it('Should create a new user and delete it successfully', () => {  
        // Step 1: Create a new user using a POST request
        cy.request('POST', 'https://serverest.dev/usuarios', loginPage.user.new).then((response) => {
            expect(response.status).to.eq(201); // Verify the user creation status is 201 (Created)

            // Step 2: Store the user ID from the response
            const userId = response.body._id;

            // Step 3: Delete the user using the stored user ID
            cy.request('DELETE', `https://serverest.dev/usuarios/${userId}`).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(200); // Verify the deletion status is 200 (OK)
                expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso'); // Confirm the success message

                // Step 4: Verify the user was deleted by attempting to fetch their details
                cy.request({
                    method: 'GET',
                    url: `https://serverest.dev/usuarios/${userId}`,
                    failOnStatusCode: false // Allow the test to continue even if the status code is an error
                }).then((getResponse) => {
                    expect(getResponse.status).to.eq(400); // Verify the user is not found (status 400)
                    expect(getResponse.body.message).to.eq('Usuário não encontrado'); // Confirm the error message
                });
            });
        });
    });
});

// Test suite for Shopping Cart functionality
describe('Shopping Cart Tests', () => {
    let authToken; // Variable to store the authentication token

    // Hook to set up user and authentication before tests
    before(() => {

        // Check if the default user exists and delete it if found
        cy.request('GET', `https://serverest.dev/usuarios?email=${loginPage.user.default.email}`).then((response) => {
            if (response.body.quantidade > 0) {
                cy.request('DELETE', `https://serverest.dev/usuarios/${response.body.usuarios[0]._id}`);
            }
        });

        // Step 1: Create the default user
        cy.request('POST', 'https://serverest.dev/usuarios', loginPage.user.default).then((response) => {
            expect(response.status).to.eq(201); // Verify user creation status is 201 (Created)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso'); // Confirm the success message

            // Step 2: Authenticate the user and obtain a token
            cy.request('POST', 'https://serverest.dev/login', {
                email: loginPage.user.default.email,
                password: loginPage.user.default.password
            }).then((response) => {
                expect(response.status).to.eq(200); // Verify authentication status is 200 (OK)
                authToken = response.body.authorization; // Store the authentication token
            });
        });
    });

    // Test case: Create a new cart for the user
    it('Should create a new cart for the user', () => {
        const produtos = {
            produtos: [
                {
                    "idProduto": "BeeJh5lz3k6kSIzA", // Product 1 with quantity 1
                    "quantidade": 1
                },
                {
                    "idProduto": "K6leHdftCeOJj8BJ", // Product 2 with quantity 3
                    "quantidade": 3
                }
            ]
        };

        // Send a POST request to create a cart with specified products
        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/carrinhos',
            headers: {
                Authorization: authToken // Include the authentication token in the request header
            },
            body: produtos
        }).then((response) => {
            expect(response.status).to.eq(201); // Verify cart creation status is 201 (Created)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso'); // Confirm the success message
        });
    });

    // Test case: Delete the cart
    it('Delete the cart', () => {

        // Send a DELETE request to conclude the purchase and delete the cart
        cy.request({
            method: 'DELETE',
            url: 'https://serverest.dev/carrinhos/concluir-compra',
            headers: {
                authorization: authToken // Include the authentication token in the request header
            }
        }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200); // Verify cart deletion status is 200 (OK)
            expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso'); // Confirm the success message
        });
    });
});