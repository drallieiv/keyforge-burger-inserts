'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    sassOptions: {
      implementation: require('sass'), // Use dart-sass
      includePaths: [
        'app/styles', // Default styles path
        'node_modules/foundation-sites/scss', // Add your custom load path here
        'node_modules/foundation-sites/scss/util',
      ]
    },
    fingerprint: {
      extensions: ['js', 'css']
    }
  });

  return app.toTree();
};
