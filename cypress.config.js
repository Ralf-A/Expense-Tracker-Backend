const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'dt1cp1',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
