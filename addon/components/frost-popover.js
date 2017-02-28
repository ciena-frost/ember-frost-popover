import Ember from 'ember'
const {
  $,
  getProperties: getProps,
  run,
  setProperties: setProps
} = Ember
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-popover'
import Utils from './util'

const {
  Drop
} = window

export default Component.extend({
  // ==== Dependencies =======================================
  layout,
  // ==== Properties =========================================
  propTypes: {
    target: PropTypes.string.isRequired,
    offset: PropTypes.string,
    event: PropTypes.string,
    className: PropTypes.string,
    position: PropTypes.string,
    remove: PropTypes.bool,
    constrainToWindow: PropTypes.bool,
    constrainToScrollParent: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onBeforeClose: PropTypes.func
  },

  getDefaultProps () {
    return {
      event: 'click',
      className: 'drop-theme-arrows-bounce',
      position: 'auto',
      remove: true,
      constrainToWindow: true,
      constrainToScrollParent: true,
      offset: '0 0'
    }
  },
  // ==== Lifecycle Hooks =========================================
  didInsertElement () {
    this._super(...arguments)

    const position = this.get('position')

    const constraints = []

    if (this.constrainToScrollParent) {
      constraints.push({
        to: 'scrollParent',
        pin: 'top, bottom, left, right',
        attachment: 'together none'
      })
    } else {
      constraints.push({to: 'scrollParent'})
    }

    if (this.constrainToWindow) {
      constraints.push({
        to: 'window',
        attachment: 'together'
      })
    } else {
      constraints.push({
        to: 'window'
      })
    }

    const parsedPosition = Utils.parsePosition(position)

    const beforeClose = run.bind(this, function () {
      if (this.get('_wasForceClosed')) {
        this.set('_wasForceClosed', false)
        return true
      }

      const beforeClose = this.get('onBeforeClose')
      if (beforeClose) {
        return beforeClose(this.get('dropInstance'))
      }
      return true
    })

    const dropOptions = {
      target: document.querySelector(this.get('target')),
      content: this.get('element'),
      classes: this.get('className'),
      remove: this.get('remove'),
      constrainToWindow: this.get('constrainToWindow'),
      constrainToScrollParent: this.get('constrainToScrollParent'),
      openOn: this.get('event'),
      beforeClose,
      tetherOptions: {
        attachment: parsedPosition.attachment,
        targetAttachment: parsedPosition.targetAttachment,
        targetOffset: this.get('offset'),
        constraints
      }
    }

    const dropInstance = new Drop(dropOptions)
    dropInstance.on('open', () => {
      run.begin()
      const onOpen = this.get('onOpen')

      if (onOpen) {
        onOpen(this.get('dropInstance'))
      }
      run.end()
    })
    dropInstance.on('close', () => {
      const onClose = this.get('onClose')
      if (onClose) {
        onClose(this.get('dropInstance'))
      }
    })

    $(dropOptions.target)
      .blur(() => { dropInstance.close() })

    $(dropOptions.content).click(function () {
      $(dropOptions.target)
        .click()
        .focus()
      return true
    })
    this.set('dropInstance', dropInstance)
  },
  willDestroy () {
    console.log(this._super)
    const dropInstance = this.get('dropInstance')
    dropInstance.destroy()
  },
  // ==== Functions =======================================
  calibrate () {
    const el = this.get('dropInstance')
    const regex = /translateX\((.*)px\) translateY\((.*)px\) translateZ\((.*)\)/g
    const [xPos, yPos] = el.drop.style.transform
      .replace(regex, '$1 $2')
      .split(' ')
      .map(Number)

    const originalSettings = getProps(
      el.tether,
      'attachment',
      'targetAttachment'
    )
    const orientation = Utils.findRoom(xPos, yPos, el.drop, this.get('position'))

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
  actions: {
    close () {
      const dropInstance = this.get('dropInstance')
      this.set('_wasForceClosed', true)
      dropInstance.close()
    },
    destroy () {
      this.destroy()
    }
  }
})
