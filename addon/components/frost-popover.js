import Ember from 'ember'
import layout from '../templates/components/frost-popover'
import $ from 'jquery'
export default Ember.Component.extend({
  layout,
  visible: false,
  event: 'click',
  closest: false,
  offset: 10,
  position: 'bottom',
  index: 0,
  excludePadding: false,
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
        $(this.get('target')).on(this.get('event'), function () {
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
      // eslint-disable-next-line max-len
      let targetElement = this.get('closest') ? this.$().closest(this.get('target'))[this.get('index')] : this.get('parentView').$(this.get('target'))[this.get('index')]
      targetRect = targetElement.getBoundingClientRect()
      let popoverElement = this.get('element')
      let popoverRect = popoverElement.getBoundingClientRect()
      let top
      let left
      let excludePadding = this.get('excludePadding')
      switch (position) {
        case 'bottom':
          top = targetRect.bottom + this.get('offset')
          left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2
          if (excludePadding) {
            let cs = window.getComputedStyle(targetElement)
            top -= parseInt(cs.getPropertyValue('padding-bottom'))
          }
          popoverElement.style.top = top + 'px'
          popoverElement.style.left = left + 'px'
          break
        case 'top':
          top = targetRect.top - popoverRect.height - this.get('offset')
          left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2
          if (excludePadding) {
            let cs = window.getComputedStyle(targetElement)
            top += parseInt(cs.getPropertyValue('padding-top'))
          }
          popoverElement.style.top = top + 'px'
          popoverElement.style.left = left + 'px'
          break
        case 'left':
          top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2
          left = targetRect.left - popoverRect.width - this.get('offset')
          if (excludePadding) {
            let cs = window.getComputedStyle(targetElement)
            left += parseInt(cs.getPropertyValue('padding-left'))
          }
          popoverElement.style.top = top + 'px'
          popoverElement.style.left = left + 'px'
          break
        case 'right':
          top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2
          left = targetRect.right + this.get('offset')
          if (excludePadding) {
            let cs = window.getComputedStyle(targetElement)
            left -= parseInt(cs.getPropertyValue('padding-right'))
          }
          popoverElement.style.top = top + 'px'
          popoverElement.style.left = left + 'px'
          break
      }
    }
  }
})
