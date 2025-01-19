import SearchItem from "../page_objects/search.items"; // Import the SearchItem page object for interacting with search functionality
import LoginTest from "../page_objects/login.page"; // Import the LoginTest page object for handling login actions
const loginPage = new LoginTest(); // Create an instance of the LoginTest class
const searchItem = new SearchItem(); // Create an instance of the SearchItem class

// Main test suite for Item Search Tests
describe('Item Search Tests', () => {

  // Hook to run before each test case in this suite
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl')); // Navigate to the base URL defined in Cypress config
    const { email, password } = loginPage.user.default; // Retrieve default user credentials
    loginPage.enterUsername(email); // Enter the username (email)
    loginPage.enterPassword(password); // Enter the password
    loginPage.submit(); // Submit the login form
    cy.intercept(`https://serverest.dev/produtos?nome=${searchItem.item()}`).as('productSearch'); // Set up an intercept for the product search API
  });

  // Test case: Verify that searching for an item displays results
  it('should search for an item and show results', () => {
    cy.get('input[placeholder="Pesquisar Produtos"]').should('exist'); // Verify the search input field exists
    searchItem.enterItem(searchItem.item()); // Enter the item to search for
    searchItem.searchBtn(); // Click the search button
    cy.wait('@productSearch').then(({ response }) => { // Wait for the search API call to complete
      expect(response.statusCode).to.eq(200); // Verify the response status code is 200 (OK)
      const quantity = response.body.quantidade; // Retrieve the quantity of search results from the response
      cy.get('.card-body').should('have.length', quantity); // Verify the number of result cards matches the quantity
    });
  });

  // Test case: Verify that searching for a non-existent item shows a "no results" message
  it('should show no results message', () => {
    searchItem.enterItem('Produto inexistente'); // Enter a non-existent product name
    searchItem.searchBtn(); // Click the search button
    cy.contains('Nenhum produto foi encontrado').should('be.visible'); // Verify the "no results" message is visible
  });

  // Test case: Verify that an item can be added to the cart
  it('should add an item to the cart', () => {
    searchItem.enterItem(searchItem.item()); // Enter the item to search for
    searchItem.searchBtn(); // Click the search button
    searchItem.addToListBtn(); // Click the button to add the item to the list
    cy.url().should('include', '/minhaListaDeProdutos'); // Verify the URL includes the "my list of products" path
    searchItem.increaseQuantity(); // Increase the quantity of the selected item
    searchItem.addToCartBtn(); // Click the button to add the item to the cart
    cy.url().should('include', '/carrinho'); // Verify the URL includes the "cart" path
  });
});