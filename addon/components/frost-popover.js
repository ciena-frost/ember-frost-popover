import Ember from 'ember'
const {$, run} = Ember
import {PropTypes} from 'ember-prop-types'
import {Component} from 'ember-frost-core'

import layout from '../templates/components/frost-popover'

export default Component.extend({
  layout,

  propTypes: {
    event: PropTypes.string,
    classes: PropTypes.string,
    position: PropTypes.string,
    remove: PropTypes.bool,
    constrainToWindow: PropTypes.bool,
    constrainToScrollParent: PropTypes.bool
  },

  getDefaultProps () {
    return {
      event: 'click',
      classes: 'drop-theme-arrows-bounce',
      position: 'bottom center',
      remove: true,
      constrainToWindow: true,
      constrainToScrollParent: true
    }
  },
  didInsertElement () {
    this._super(...arguments)

    const dropOptions = {
      target: document.querySelector(this.get('target')),
      content: this.get('element'),
      classes: this.get('classes'),
      position: this.get('position'),
      remove: this.get('remove'),
      constrainToWindow: this.get('constrainToWindow'),
      constrainToScrollParent: this.get('constrainToWindow'),
      openOn: this.get('event'),
      tetherOptions: {
        constraints: [
          {
            to: 'scrollParent',
            attachment: 'together',
            pin: true
          }
        ]
      }
    }

    const dropInstance = new Drop(dropOptions)
    dropInstance.on('open', () => {
      const onOpen = this.get('onOpen')
      if (onOpen) {
        onOpen(this)
      }
    })
    dropInstance.on('close', () => {
      const onClose = this.get('onClose')
      if (onClose) {
        onClose(this)
      }
    })
    this.set('dropInstance', dropInstance)
  },

  willDestroy () {
    const dropInstance = this.get('dropInstance')
    dropInstance.destroy()
    this._super(...arguments)
  }
})
