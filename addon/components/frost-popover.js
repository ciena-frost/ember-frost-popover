import $ from 'jquery'
import Ember from 'ember'
import layout from '../templates/components/frost-popover'
const ESC = 27

export default Ember.Component.extend({
  layout,
  visible: false,
  event: 'click',
  closest: false,
  position: 'bottom',
  index: 0,
  classNameBindings: ['position', 'visible:visible:invisible'],
  classNames: ['tooltip-frost-popover'],
  didRender () {
    Ember.run.next(() => {
      const context = this
      if (this.get('closest')) {
        this.$().closest(this.get('target')).on(this.get('event'), function () {
          context.send('togglePopover')
        })
      } else {
        this.get('parentView').$(this.get('target')).on(this.get('event'), function () {
          context.send('togglePopover')
        })
      }
    })
  },
  actions: {
    close () {
      if (this.get('isDestroyed')) { return }
      this.set('visible', false)
    },
    togglePopover () {
      this.toggleProperty('visible')      
      let position = this.get('position')
      let targetRect
      targetRect = this.get('closest') ? this.$().closest(this.get('target'))[this.get('index')].getBoundingClientRect() : this.get('parentView').$(this.get('target'))[this.get('index')].getBoundingClientRect()
      let popoverElement = this.get('element')
      let popoverRect = popoverElement.getBoundingClientRect()
      let top
      let bottom
      let left
      let right
      switch (position) {
        case 'bottom':
          top = targetRect.bottom + 5
          left = targetRect.left
          popoverElement.style.top = top + 'px'
          popoverElement.style.left = left + 'px'
          break
        case 'top':
          top = targetRect.top - targetRect.height - 5
          left = targetRect.left
          popoverElement.style.top = top + 'px'
          popoverElement.style.left = left + 'px'
          break
        case 'left':
          top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2
          left = targetRect.left - targetRect.width + 34.4
          popoverElement.style.top = top + 'px'
          popoverElement.style.left = left + 'px'
          break
        case 'right':
          top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2
          left = targetRect.right + 5
          popoverElement.style.top = top + 'px'
          popoverElement.style.left = left + 'px'
          break
      }
    }
  }
})
