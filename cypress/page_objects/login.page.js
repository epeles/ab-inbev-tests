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
        return cy.get('[data-dismiss="alert"]'); 
    }
}

export default LoginTest;