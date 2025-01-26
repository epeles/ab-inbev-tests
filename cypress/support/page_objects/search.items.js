class SearchItem {
    enterItem(item) {
        cy.get('[data-testid="pesquisar"]').type(item);
    }

    searchBtn() {
        cy.get('[data-testid="botaoPesquisar"]').click();
    }

    item() {
        return 'a';
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
    
    get produtos() {
        return {
            produtos: [{
                idProduto: "BeeJh5lz3k6kSIzA",
                quantidade: 1
              }, // Product 1 with quantity 1
              {
                idProduto: "K6leHdftCeOJj8BJ",
                quantidade: 3
              } // Product 2 with quantity 3
            ]
        }}
    }   


export default SearchItem;