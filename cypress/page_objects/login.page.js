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

    get defaultUser() {
        return {
            nome: 'Cypress Test',
            email: `defaultUser1@example.com`,
            password: 'password123',
            administrador: 'false'
        };
    }

 
}


export default LoginTest;
