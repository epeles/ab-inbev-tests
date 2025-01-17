const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "fvtch4",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://front.serverest.dev/login' // Adicione a baseUrl aqui

  },


});
