import Ember from 'ember'
const {$, Component, run, typeOf, String: {dasherize}, computed, assert} = Ember
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
      position: 'bottom center',
      resize: true,
      viewport: 'body',
      visible: false,
    }
  },
  didInsertElement () {
    this._super(...arguments)
    const baseOptions = {
      target: document.querySelector(this.get('target')),
      content: this.get('element'),
      openOn: this.get('event'),
      remove: true
    }

    let [position, modifier] = this.get('position').split(' ')

    const optionMap = {
      bottom: ['center', 'left', 'right'],
      top: ['center', 'left', 'right'],
      left: ['middle', 'top', 'bottom'],
      right: ['middle', 'top', 'bottom'],

    }

    if (!optionMap[position]) {
      position = 'bottom'
      baseOptions['contrainToWindow'] = true
    }

    if (!modifier) {
      modifier = optionMap[position][0]
    }
    this.set('position', [position, modifier].join(' '))
    const dropInstance = new Drop(
      Object.assign(baseOptions, {
        position: this.get('position'),
        tetherOptions: {
        }
      })
    )
    dropInstance.on('open', function () {
      console.log(this)
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
