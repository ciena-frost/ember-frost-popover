import Ember from 'ember'
const {$, Component, run} = Ember
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import _ from 'lodash'

import layout from '../templates/components/frost-popover'
import {checkBottom, checkLeft, checkRight, checkTop} from './util'

const arrowMargin = 5
const maxPlacementRetries = 5

export default Component.extend(PropTypeMixin, {
  layout,
  classNameBindings: ['visible:visible:invisible', 'autoPosition'],
  classNames: ['tooltip-frost-popover'],
  propTypes: {
    closest: PropTypes.bool,
    event: PropTypes.string,
    excludePadding: PropTypes.bool,
    index: PropTypes.number,
    offset: PropTypes.number,
    position: PropTypes.string,
    resize: PropTypes.bool,
    viewport: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.func
    ])
  },

  getDefaultProps () {
    return {
      closest: false,
      event: 'click',
      excludePadding: false,
      index: 0,
      offset: 10,
      position: 'bottom',
      resize: true,
      viewport: 'body',
      visible: false,
      autoPosition: 'bottom'
    }
  },

  didInsertElement () {
    run.next(() => {
      const target = this.getTarget()
      const event = this.get('event')

      this._eventHandler = (event) => {
        const popover = this.get('element')
        if ($(event.target).closest(popover).length === 0) {
          this.send('togglePopover')
        }
      }

      $(target).on(event, this._eventHandler)
    })
  },

  willDestroyElement () {
    const target = this.getTarget()
    const event = this.get('event')
    $(target).off(event, this._eventHandler)
    this.unregisterClickOff()
  },

  registerClickOff () {
    run.next(this, () => {
      const elementId = this.get('elementId')
      $('html').on(`click.container.${elementId}`, (event) => {
        let popover = this.get('element')
        if ($(event.target).closest(popover).length === 0) {
          this.set('visible', false)
          this.unregisterClickOff()
        }
      })
    })
  },

  unregisterClickOff () {
    const elementId = this.get('elementId')
    $('html').off(`click.container.${elementId}`)
  },

  /**
   * Gets the computed style for element
   * @param {DOMElement} element - the element to target
   * @param {String} properties - the css properties to get (must be a number property)
   * @returns {Number[]} the parsed property values
   */
  getComputedStyle (element, properties) {
    let cs = window.getComputedStyle(element)
    let values = {}
    properties.forEach((property) => {
      values[property] = parseInt(cs.getPropertyValue(property))
    })

    return values
  },

  getTarget () {
    const target = this.get('target')
    const index = this.get('index')
    const parent = this.get('parentView')

    if (this.get('closest')) {
      return this.$().closest(target)[index]
    }

    if (parent && parent.$) {
      return parent.$(target)[index]
    }

    return $(target)[index]
  },

/* eslint-disable complexity */
  getViewport () {
    const viewportProp = this.get('viewport')

    switch (typeof viewportProp) {
      case 'object':
        return viewportProp
      case 'string':
        return $(viewportProp)[0]
      case 'function':
        return viewportProp.call(this, this.getTarget())
    }
  },
/* eslint-disable complexity */

  /**
   * Calculates the offsets needed to keep the the popover within the viewport. If the attachment
   * is horizontal (left/right) then the popover can only be constrained vertical. If if is vertical
   * then the popover is constrained horizontally.
   * @param {String} attachment - (top/left/right/bottom)
   * @returns {Object} the delta (top, left)
   */
  getViewportAdjustments (attachment) {
    const popoverRect = this.get('element').getBoundingClientRect()
    const viewportRect = $(this.get('viewport'))[0].getBoundingClientRect()

    let delta = {
      top: 0,
      left: 0
    }

    if (attachment === 'left' || attachment === 'right') {
      if (popoverRect.top < viewportRect.top) {
        delta.top = viewportRect.top - popoverRect.top
      } else if (popoverRect.top + popoverRect.height > viewportRect.bottom) {
        delta.top = viewportRect.bottom - popoverRect.height - popoverRect.top
      }
    } else {
      if (popoverRect.left < viewportRect.left) {
        delta.left = viewportRect.left - popoverRect.left
      } else if (popoverRect.left + popoverRect.width > viewportRect.right) {
        delta.left = viewportRect.right - popoverRect.width - popoverRect.left
      }
    }

    return delta
  },

  /**
   * Gets the box calculations using relative offsets
   * @param {DOMElement} element - the target element
   * @returns {Rect} the rect structure using the element's offsets rather than client rect
   */
  getOffsetRect (element) {
    const excludePadding = this.get('excludePadding')
    const paddingCss = this.getComputedStyle(element, [
      'padding-top',
      'padding-left',
      'padding-right',
      'padding-bottom'
    ])

    const rect = {
      top: element.offsetTop,
      left: element.offsetLeft,
      bottom: element.offsetTop + element.offsetHeight,
      right: element.offsetLeft + element.offsetWidth,
      width: element.offsetWidth,
      height: element.offsetHeight
    }

    if (excludePadding) {
      rect.top += paddingCss['padding-top']
      rect.left += paddingCss['padding-left']
      rect.bottom -= paddingCss['padding-bottom']
      rect.right -= paddingCss['padding-right']
    }

    return rect
  },

  /**
   * Deciphers the position attribute to determine the correct position to use
   * @param {Rect} targetRect - target client rect
   * @param {Rect} popoverRect - popover client rect
   * @param {Numer} offset - the offset requested
   * @returns {String} the correct position
   */
  getAutoPosition (targetRect, popoverRect, offset) {
    const positions = this.get('position').split(' ')
    let position = positions.shift()
    if (position === 'auto') {
      position = positions.shift()
      if (position === 'left') {
        position = checkBottom(targetRect, popoverRect, offset, position)
        position = checkTop(targetRect, popoverRect, offset, position)
        position = checkRight(targetRect, popoverRect, offset, position)
        position = checkLeft(targetRect, popoverRect, offset, position)
      } else if (position === 'right') {
        position = checkBottom(targetRect, popoverRect, offset, position)
        position = checkTop(targetRect, popoverRect, offset, position)
        position = checkLeft(targetRect, popoverRect, offset, position)
        position = checkRight(targetRect, popoverRect, offset, position)
      } else if (position === 'bottom') {
        position = checkLeft(targetRect, popoverRect, offset, position)
        position = checkRight(targetRect, popoverRect, offset, position)
        position = checkTop(targetRect, popoverRect, offset, position)
        position = checkBottom(targetRect, popoverRect, offset, position)
      } else {
        position = checkLeft(targetRect, popoverRect, offset, position)
        position = checkRight(targetRect, popoverRect, offset, position)
        position = checkBottom(targetRect, popoverRect, offset, position)
        position = checkTop(targetRect, popoverRect, offset, position)
      }
    }

    return position
  },

/* eslint-disable complexity */
  place () {
    let targetElement = this.getTarget()
    let popoverElement = this.get('element')
    let $popoverElement = $(popoverElement)
    let popoverRect = popoverElement.getBoundingClientRect()
    let targetRect = this.getOffsetRect(targetElement)
    let parentRect = this.getOffsetRect(targetElement.parentElement)
    let position = this.getAutoPosition(targetElement.getBoundingClientRect(), popoverRect, this.get('offset'))

    this.set('autoPosition', position)

    let top, left, bottom, right

    switch (position) {
      case 'bottom':
        top = targetRect.bottom + this.get('offset')
        left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2
        break
      case 'top':
        bottom = parentRect.height - (targetRect.top - this.get('offset'))
        left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2
        break
      case 'left':
        top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2
        right = parentRect.width - (targetRect.left - this.get('offset'))
        break
      case 'right':
        top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2
        left = targetRect.right + this.get('offset')
        break
    }

    // need to apply the changes before viewport adjustments can be made
    $popoverElement.css({
      top,
      right,
      bottom,
      left,
      // forced to prevent browser from resizing at the edges of the viewport
      width: this.get('resize') ? 'auto' : popoverRect.width,
      height: this.get('resize') ? 'auto' : popoverRect.height
    })

    return {
      top,
      right,
      bottom,
      left
    }
  },
/* eslint-disable complexity */

  /**
   * Attempts to place the popover repeating up to maxPlacementRetries since every placement could
   * potential cause reflows/relayouts making our center calculations inaccurate.
   * @returns {Object} the final placement offset
   */
  resolvePlacement () {
    let offset = this.place()
    let prevOffset = offset
    let maxTries = maxPlacementRetries
    do {
      prevOffset = offset
      offset = this.place()
      --maxTries
    }
    while ((offset.top !== prevOffset.top || offset.left !== prevOffset.left) && maxTries > 0)

    return offset
  },

  actions: {
    close (action) {
      if (this.get('isDestroyed')) {
        return
      }
      this.set('visible', false)
      this.unregisterClickOff()
      if (_.isFunction(action)) {
        action()
      }
    },
    togglePopover () {
      this.toggleProperty('visible')
      const position = this.get('position')

      if (this.get('visible')) {
        this.registerClickOff()
        let offset = this.resolvePlacement()

        const delta = this.getViewportAdjustments(position)

        // apply delta to contain the popover inside the viewport
        $(this.get('element')).css({
          top: offset.top + delta.top,
          left: offset.left + delta.left
        })
        // apply the negative delta on the arrow
        this.$('.tooltip-arrow').css({
          marginLeft: -delta.left - arrowMargin,
          marginTop: -delta.top - arrowMargin
        })
      } else {
        this.unregisterClickOff()
      }
    }
  }
})
