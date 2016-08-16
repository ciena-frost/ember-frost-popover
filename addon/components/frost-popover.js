import $ from 'jquery'
import Ember from 'ember'
import layout from '../templates/components/frost-popover'
const ESC = 27

export default Ember.Component.extend({
  layout,
  isVisible: false,
  event: 'click',
  closest: false,
  position: 'bottom',
  classNameBindings: ['position'],
  classNames: ['tooltip-frost-popover'],
  didRender () {
    Ember.run.next(() => {
      const context = this
      if (this.get('closest')) {
        this.$().closest(this.get('target')).on(this.get('event'), function () {
          context.toggleProperty('isVisible')
        })
      } else {
        this.get('parentView').$(this.get('target')).on(this.get('event'), function () {
          context.toggleProperty('isVisible')
        })
      }
    })
  },
  actions: {
    close () {
      if (this.get('isDestroyed')) { return }
      this.set('isVisible', false)
    }
  }
})
