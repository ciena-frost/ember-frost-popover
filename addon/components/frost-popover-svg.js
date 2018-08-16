import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-popover-svg'
import {getHeightOfContent, getWidthOfContent} from 'ember-frost-popover/utils/svg'

const {isBlank, isEmpty, isNone} = Ember

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================
  tagName: 'foreignObject',
  attributeBindings: ['transform', '_width:width', '_height:height'],
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
      yOffset: 0
    }
  },

  // == Computed Properties ===================================================
  @readOnly
  @computed('x', 'y', '_height', 'xOffset', 'yOffset')
  transform (x, y, height, xOffset, yOffset) {
    if (!isNone(x) && !isNone(y)) {
      const offsetX = x - xOffset
      const offsetY = y - height - yOffset
      return `translate(${offsetX}, ${offsetY})`
    }
  },

  @readOnly
  @computed('content', 'items.[]')
  isHidden (content, items) {
    return isBlank(content) && isEmpty(items)
  },

  @readOnly
  @computed('width', 'content', 'items.[]')
  _width (width, content, items) {
    if (!isNone(width)) {
      return width
    }

    return getWidthOfContent(content || items)
  },

  @readOnly
  @computed('height', 'content', 'items.[]')
  _height (height, content, items) {
    if (!isNone(height)) {
      return height
    }

    return getHeightOfContent(content || items)
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
