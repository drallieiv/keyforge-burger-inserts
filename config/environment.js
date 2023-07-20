'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'burger-inserts',
    environment,
    rootURL: process.env.EMBER_CLI_ELECTRON ? '' : '/',
    locationType: process.env.EMBER_CLI_ELECTRON ? 'hash' : 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    googleFonts: [
      'Righteous:300,400,500',
      'Lato:300,400,500,400italic',
      'Roboto:300'
    ],
    
    // Set or update content security policies
    contentSecurityPolicy: {
      'font-src': "'self' fonts.gstatic.com",
      'style-src': "'self' fonts.googleapis.com"
    },

    kfapi: "https://www.keyforgegame.com/api/",
    
    dok: {
      sharedApiKey: "57f0d4c3-8101-4f0a-a2cc-b2a39bec622b",
      lastSasUpdate: "2021-04-06",
      lastSasVersion: 37
    }      
  };

  if (environment === 'development') {
    // ENV.kfapi = "/mv/api/"
    ENV.kfapi = "https://www.keyforgegame.com/api/"
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
