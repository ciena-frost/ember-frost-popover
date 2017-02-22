import Ember from 'ember'
const {$, Component, run, typeOf, String: {dasherize}, computed} = Ember
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-popover'
import {checkBottom, checkLeft, checkRight, checkTop} from './util'

const arrowMargin = 5
const maxPlacementRetries = 5

export default Component.extend(PropTypeMixin, {
  layout,
  classNameBindings: ['dasherizedPosition'],
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
      position: 'bottom right',
      resize: true,
      viewport: 'body',
      visible: false,
    }
  },
  init () {
    this._super(...arguments)
    const position = this.get('position')
    const validPositions = {
      'bottom': 'bottom center',
      'top': 'top center',
      'right': 'right middle',
      'left': 'left middle',
    }
    this.set('position', validPositions[position] || position)
  },
  didInsertElement () {
    this._super(...arguments)
    const target = this.get('target')
    const targetSelector = document.querySelector(target)

    const content = this.get('element')
    const position = this.get('position')

    const openOn = this.get('event')
    const dropInstance = new Drop({
      target: targetSelector,
      content,
      position,
      openOn
    })
    this.set('dropInstance', dropInstance)
  },
  willDestroy () {
    this.get('dropInstance').destroy()
    this._super(...arguments)
  },
  dasherizedPosition: computed('position', function () {
    return dasherize(this.get('position'))
  }),
  actions: {
    close (action) {
      if (this.get('isDestroyed') || this.get('isDestroying')) {
        return
      }
      this.set('visible', false)

      if (typeOf(action) === 'function') {
        action()
      }
    },
    togglePopover () {

    }
  }
})
