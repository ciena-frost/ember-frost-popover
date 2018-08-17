import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================
  tagName: 'rect',
  attributeBindings: ['x', 'y', 'width', 'height', 'fill'],
  x: 10,
  y: 60,
  width: 50,
  height: 20,
  fill: '#000',

  // == PropTypes =============================================================
  propTypes: {
    // options
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================
  mouseEnter (event) {
    this.get('onMouseEnter')({
      x: this.get('x'),
      y: this.get('y'),
      items: [
        {label: 'Count', value: '2'},
        {label: 'Shape', value: 'Rectangle'}
      ]
    })
  },
  mouseLeave (event) {
    this.get('onMouseLeave')({})
  },
  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
