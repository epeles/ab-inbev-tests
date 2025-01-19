class SearchItem {
    enterItem(item) {
        cy.get('[data-testid="pesquisar"]').type(item);
    }

    searchBtn() {
        cy.get('[data-testid="botaoPesquisar"]').click();
    }

    item() {
        return 'test';
    }

    addToListBtn() {
        cy.get('[data-testid="adicionarNaLista"]').first().click();
    }

    addToCartBtn() {
        cy.get('[data-testid="adicionar carrinho"]').click();
    }

    increaseQuantity() {
        cy.get('[data-testid="product-increase-quantity"]').click();
    }
}



export default SearchItem;