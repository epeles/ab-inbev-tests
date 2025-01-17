class LoginTest {
    enterUsername(username) {
        cy.get('[data-testid="email"]').type(username);
    }

    enterPassword(password) {
        cy.get('[data-testid="senha"]').type(password);
    }

    submit() {
        cy.get('button[type="submit"]').click();
    }

    getErrorMessage() {
        return cy.get('[role="alert"]'); 
    }

    get newUser() {
        return {
            default: {
                nome: 'Cypress Test',
                email: `defaultUser2@example.com`,
                password: 'password123',
                administrador: 'false'
            },
            new: {
                nome: 'Cypress Test',
                email: `cypress.test${Date.now()}@example.com`,
                password: 'password123',
                administrador: 'true'
                
            }
        };
    }

 
}


export default LoginTest;
