import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
const {isBlank, isEmpty, isNone} = Ember

import layout from '../templates/components/frost-popover-svg'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================
  tagName: 'foreignObject',
  attributeBindings: ['transform', 'width', 'height'],
  classNameBindings: ['isHidden:tooltip-hidden'],
  layout,

  // == PropTypes =============================================================
  propTypes: {
    // options
    content: PropTypes.string,
    items: PropTypes.array,
    x: PropTypes.number,
    y: PropTypes.number,
    xOffset: PropTypes.number,
    yOffset: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  },

  getDefaultProps () {
    return {
      // options
      x: 0,
      y: 0,
      xOffset: 10,
      yOffset: 20,
      width: 100,
      height: 20
    }
  },

  // == Computed Properties ===================================================
  @readOnly
  @computed('x', 'y', 'xOffset', 'yOffset')
  transform (x, y, xOffset, yOffset) {
    if (!isNone(x) && !isNone(y)) {
      const offsetX = x - xOffset
      const offsetY = y - yOffset
      return `translate(${offsetX}, ${offsetY})`
    }
  },

  @readOnly
  @computed('content', 'items.[]')
  isHidden (content, items) {
    return isBlank(content) && isEmpty(items)
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
