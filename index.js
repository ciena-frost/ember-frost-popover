/* globals module */

'use strict'

module.exports = {
  name: 'ember-frost-popover',
  included: function (app) {
    this._super.included.apply(this, arguments)
    ;[
      '/tether/dist/js/tether.min.js',
      '/tether-drop/dist/css/drop-theme-arrows-bounce.min.css',
      '/tether-drop/dist/js/drop.min.js'
    ].forEach(file => this.app.import(`${app.bowerDirectory}${file}`))
  }
}
