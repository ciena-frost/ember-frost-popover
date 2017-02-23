/* globals module */

'use strict'

module.exports = {
  name: 'ember-frost-popover',
  included: function(app) {
    this._super.included.apply(this, arguments);
    this.app.import(app.bowerDirectory + '/tether/dist/js/tether.min.js');
    this.app.import(app.bowerDirectory + '/tether-drop/dist/css/drop-theme-arrows-bounce.min.css');
    this.app.import(app.bowerDirectory + '/tether-drop/dist/js/drop.min.js');
  }
}
