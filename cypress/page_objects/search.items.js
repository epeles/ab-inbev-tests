class SearchItem {
    enterItem(item) {
        cy.get('[data-testid="pesquisar"]').type(item);
    }

    searchBtn() {
        cy.get('[data-testid="botaoPesquisar"]').click();
    }

    item() {
        return 'generic';
    }
}



export default SearchItem;