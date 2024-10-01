'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    outputPaths: {
      app: {
        css: {
          app: "/assets/burger-inserts.css"
        },
      },
    },
    // Add options here
    'ember-cli-foundation-6-sass': {
      'foundationJs': 'all'
    },
    fingerprint: {
      extensions: ['js', 'css']
    }
  });

  return app.toTree();
};
