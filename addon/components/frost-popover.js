import Ember from 'ember'
const {$, run, get, getProperties: getProps, setProperties: setProps} = Ember
import {PropTypes} from 'ember-prop-types'
import {Component} from 'ember-frost-core'
import Utils, {
  checkLeft,
  checkRight,
  checkTop,
  checkBottom
} from './util'
import layout from '../templates/components/frost-popover'

export default Component.extend({
  // ==== Dependencies =======================================
  layout,
  // ==== Properties =========================================
  propTypes: {
    event: PropTypes.string,
    classes: PropTypes.string,
    position: PropTypes.string,
    remove: PropTypes.bool,
    constrainToWindow: PropTypes.bool,
    constrainToScrollParent: PropTypes.bool,
    withinBounds: PropTypes.bool
  },

  getDefaultProps () {
    return {
      event: 'click',
      classes: 'drop-theme-arrows-bounce',
      position: 'bottom',
      remove: true,
      constrainToWindow: true,
      constrainToScrollParent: true,
      autoposition: true
    }
  },
  // ==== Lifecycle Hooks =========================================
  didInsertElement () {
    this._super(...arguments)
    const position = Utils.parsePosition(this.get('position'))
    const auto = this.get('autoposition')
    const constraints = []

    // if (auto) {
    //   constraints.push({
    //     to: 'scrollParent',
    //     attachment: 'together',
    //     pin: true
    //   })
    // }
    const dropOptions = {
      target: document.querySelector(this.get('target')),
      content: this.get('element'),
      classes: this.get('classes'),
      remove: this.get('remove'),
      constrainToWindow: this.get('constrainToWindow'),
      constrainToScrollParent: this.get('constrainToWindow'),
      openOn: this.get('event'),
      tetherOptions: {
        attachment: position.attachment,
        targetAttachment: position.targetAttachment,
        constraints
      }
    }

    const dropInstance = new Drop(dropOptions)
    dropInstance.on('open', () => {
      run.begin()
      const onOpen = this.get('onOpen')

      if (auto) {
        this.calibrate()
      }

      if (onOpen) {
        onOpen(this)
      }
      run.end()
    })
    dropInstance.on('close', () => {
      run.begin()
      const onClose = this.get('onClose')
      if (onClose) {
        onClose(this)
      }
      run.end()
    })

    $(dropOptions.target)
      .blur(() => {dropInstance.close()})

    $(dropOptions.content).click(function () {
      $(dropOptions.target)
        .click()
        .focus()
      return true
    })
    if (auto) {
      $(window).resize(() => {
        this.calibrate()
      })
    }

    this.set('dropInstance', dropInstance)
  },
  willDestroy () {
    const dropInstance = this.get('dropInstance')
    dropInstance.destroy()
    this._super(...arguments)
  },
  // ==== Functions =======================================
  calibrate () {
    const el = this.get('dropInstance')
    const computedStyle = getComputedStyle(get(el, 'drop'))

    const [xPos, yPos] = computedStyle.getPropertyValue('transform')
      .replace(/\((.*?)\)/, '$1')
      .split(',')
      .map(Number)
      .slice(-2)

    const originalSettings = getProps(
      el.tether,
      'attachment',
      'targetAttachment'
    )
    const orientation = Utils.findRoom(xPos, yPos, el.drop) || this.get('position')

    const {
      attachment,
      targetAttachment
    } = Utils.parsePosition(orientation)

    const [top, left] = attachment.split(' ')
    const [targetTop, targetleft] = targetAttachment.split(' ')

    el.tether.attachment = {
      top,
      left
    }
    el.tether.targetAttachment = {
      top: targetTop,
      left: targetleft
    }

    el.tether.position()

    setProps(el.tether, originalSettings)
  },

  // ==== Actions =========================================
})
