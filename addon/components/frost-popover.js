import Ember from 'ember'
import $ from 'jquery'
import _ from 'lodash/lodash'
import layout from './template'

export default Ember.Component.extend({
  attributeBindings: ['style'],
  layout,

  event: 'manual',
  spacing: Ember.computed.alias('offset'),
  typeClass: 'frost-popover',
  visibility: false,

  style: Ember.computed(function () {
    return Ember.String.htmlSafe('display:none;')
  }),

  setup: Ember.on('didInitAttrs', function () {
    const parentView = this.get('parentView')
    parentView.on('click', (event) => {
      if (!Ember.ViewUtils.isSimpleClick(event)) {
        return true
      }

      this.toggleProperty('visibility')

      if (this.get('visibility')) {
        Ember.run.next(this, () => {
          $('html').on('click.container.' + this.get('elementId'), (event) => {
            let popover = Ember.$('.tooltip-frost-popover')
            if (!popover.is(event.target) && _.isEmpty(popover.has(event.target))) {
              this.set('visibility', false)
              $('html').off('click.container.' + this.get('elementId'))
            }
          })
        })
      }
    })
  }),

  update: Ember.observer('visibility', function () {
    if (this.get('visibility') === true) {
      const parentView = this.get('parentView')
      const tooltip = parentView.get('tooltip')
      if (tooltip) {
        tooltip.destroy()
      }
      parentView.renderTooltip(this)
    }
  }),

  teardown: Ember.on('willDestroyElement', function () {
    $('html').off('click.container.' + this.get('elementId'))
  }),

  actions: {
    close (action) {
      this.set('visibility', false)
      $('html').off('click.container.' + this.get('elementId'))
      if (_.isFunction(action)) {
        action()
      }
    }
  }
})
