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

    get user() {
        return {
            default: {
                nome: 'Cypress Test',
                email: `defaultUser3@example.com`,
                password: 'password123',
                administrador: 'false'
            },
            new: {
                nome: 'Cypress Test',
                email: 'newUser_1@example.com',
                password: 'password123',
                administrador: 'true'
                
            }
        };
    }

 
}


export default LoginTest;
