import Ember from 'ember'
import {task, timeout} from 'ember-concurrency'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-popover'
import {checkBottom, checkLeft, checkRight, checkTop} from './util'

const {$, Component, isPresent, run, typeOf} = Ember
const arrowMargin = 5
const maxPlacementRetries = 5

export default Component.extend(PropTypeMixin, {
  layout,
  classNameBindings: ['visible:visible:invisible', 'autoPosition'],
  classNames: ['tooltip-frost-popover'],

  propTypes: {
    closest: PropTypes.bool,
    delay: PropTypes.number,
    hideDelay: PropTypes.number, // This currently doesn't work properly with 'click'
    event: PropTypes.string,
    excludePadding: PropTypes.bool,
    handlerIn: PropTypes.string,
    handlerOut: PropTypes.string,
    index: PropTypes.number,
    offset: PropTypes.number,
    onDisplay: PropTypes.func,
    onHide: PropTypes.func,
    position: PropTypes.string,
    resize: PropTypes.bool,
    stopPropagation: PropTypes.bool,
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
      stopPropagation: false,
      viewport: 'body',
      visible: false,
      autoPosition: 'bottom'
    }
  },

  cancelShowDelayTask () {
    if (this.showDelayTask) {
      this.get('showDelayTask').cancelAll()
    }
  },

  showDelay (event, delay) {
    this.get('showDelayTask').perform(event, delay)
  },

  /* eslint-disable complexity */
  didInsertElement () {
    const target = this.getTarget()
    const delay = this.get('delay')
    const event = this.get('event')
    const hideDelay = this.get('hideDelay')
    const popover = this.get('element')
    const stopPropagation = this.get('stopPropagation')

    let handlerIn = this.get('handlerIn')
    let handlerOut = this.get('handlerOut')

    if (event && event.split(' ').length === 2) {
      [handlerIn, handlerOut] = event.split(' ')
      this.setProperties({handlerIn, handlerOut})
    }

    if (handlerIn && handlerOut) {
      this._eventHandlerIn = (event) => {
        if (stopPropagation) {
          event.stopPropagation()
        }
        run.next(() => {
          if (this.isDestroyed || this.isDestroying) {
            return
          }
          this.cancelShowDelayTask()
          if (!this.get('visible')) {
            if (delay) {
              this.showDelay(event, delay)
            } else {
              this.togglePopover(event)
            }
          }
        })
      }

      this._eventHandlerOut = (event) => {
        if (stopPropagation) {
          event.stopPropagation()
        }
        run.next(() => {
          if (this.isDestroyed || this.isDestroying) {
            return
          }
          this.cancelShowDelayTask()
          if (this.get('visible')) {
            if (hideDelay) {
              this.showDelay(event, hideDelay)
            } else {
              this.togglePopover(event)
            }
          }
        })
      }
      $(target).on(handlerIn, this._eventHandlerIn)
      $(target).on(handlerOut, this._eventHandlerOut)
    } else {
      this._eventHandler = (event) => {
        if (stopPropagation) {
          event.stopPropagation()
        }
        run.next(() => {
          if (this.isDestroyed || this.isDestroying) {
            return
          }
          this.cancelShowDelayTask()

          if (delay || hideDelay) {
            let delayToUse = this.get('visible') ? hideDelay : delay
            if (delayToUse) {
              this.showDelay(event, delayToUse)
            } else {
              this.togglePopover(event)
            }
          } else {
            this.togglePopover(event)
          }
        })
      }

      $(target).on(event, this._eventHandler)
    }

    // add handlers for persisting visible state when hovering
    if (handlerIn === 'mouseenter' && handlerOut === 'mouseleave') {
      // functions declared here for scope
      this._hoverHandlerIn = event => {
        if (this.get('visible')) {
          this.cancelShowDelayTask()
        }
      }
      this._hoverHandlerOut = event => {
        const hideDelay = this.get('hideDelay')
        if (this.get('visible')) {
          if (hideDelay) {
            this.showDelay(event, hideDelay)
          } else {
            this.togglePopover(event)
          }
        }
      }
      this._hoverClickHandler = event => {
        if (this.get('stopPropagation')) {
          event.stopPropagation()
        }
      }

      // handle mouse events on visible popover
      $(popover).on(handlerIn, this._hoverHandlerIn)
      $(popover).on(handlerOut, this._hoverHandlerOut)
      $(popover).on('click', this._hoverClickHandler)
    }
  },
  /* eslint-enable complexity */

  willDestroyElement () {
    const target = this.getTarget()
    const event = this.get('event')
    const handlerIn = this.get('handlerIn')
    const handlerOut = this.get('handlerOut')
    const popover = this.get('element')

    if (handlerIn && handlerOut) {
      $(target).off(handlerIn, this._eventHandlerIn)
      $(target).off(handlerOut, this._eventHandlerOut)
    } else {
      $(target).off(event, this._eventHandler)
    }

    this.cancelShowDelayTask()
    this.unregisterClickOff()

    // remove listeners attached for hover behavior
    if (handlerIn === 'mouseenter' && handlerOut === 'mouseleave') {
      $(popover).off(handlerIn, this._hoverHandlerIn)
      $(popover).off(handlerOut, this._hoverHandlerOut)
      $(popover).off('click', this._hoverClickHandler)
    }
  },

  /**
   * Toggles the popover
   * @param {DOMEvent} event - mouse event
   */
  togglePopover (event) {
    const handlerIn = this.get('handlerIn')
    const handlerOut = this.get('handlerOut')
    const popover = this.get('element')

    if ($(event.target).closest(popover).length === 0 ||
        (handlerIn === 'mouseenter' && handlerOut === 'mouseleave')) {
      this.send('togglePopover', event)
    }
  },

  /**
   * Closes the popover an unregisters the global click event
   * @param {DOMEvent} event - click event
   */
  closePopover (event) {
    let popover = this.get('element')
    if ($(event.target).closest(popover).length === 0) {
      this.get('showDelayTask').cancelAll()
      this.set('visible', false)
      this.unregisterClickOff()
      this.handleHide()
    }
  },

  registerClickOff () {
    const elementId = this.get('elementId')
    $('html').on(`click.container.${elementId}`, (event) => {
      run.next(this, () => {
        if (this.isDestroyed || this.isDestroying) {
          return
        }

        this.closePopover(event)
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

  /* eslint-disable complexity */
  getTarget () {
    const target = this.get('target')
    const index = this.get('index')
    const parent = this.get('parentView')

    let $elements

    if (this.get('closest')) {
      $elements = this.$().closest(target)
    } else if (parent && parent.$) {
      $elements = parent.$(target)
    } else {
      $elements = $(target)
    }

    if ($elements && $elements.length > index) {
      return $elements[index]
    }

    return null
  },

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
  /* eslint-enable complexity */

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

  handleDisplay () {
    if (isPresent(this.get('onDisplay'))) {
      this.onDisplay()
    }
  },

  handleHide () {
    if (isPresent(this.get('onHide'))) {
      this.onHide()
    }
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
  /* eslint-enable complexity */

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

  showDelayTask: task(function * (event, delay) {
    if (delay) {
      yield timeout(delay)
    }
    this.togglePopover(event)
  }).restartable(),

  actions: {
    close (action) {
      if (this.get('isDestroyed')) {
        return
      }
      this.set('visible', false)
      this.unregisterClickOff()
      if (typeOf(action) === 'function') {
        action()
      }
    },

    togglePopover (event) {
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

        this.handleDisplay()
      } else {
        this.unregisterClickOff()
        this.handleHide()
      }
    }
  }
})
