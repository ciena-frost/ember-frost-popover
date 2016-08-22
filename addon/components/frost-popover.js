import Ember from 'ember'
import layout from '../templates/components/frost-popover'
import $ from 'jquery'

function checkLeft (elementPosition, popoverRect, offset, result) {
  if (elementPosition.left > 0 + popoverRect.width + offset) {
    result = 'left'
  }
  return result
}
function checkRight (elementPosition, popoverRect, offset, result) {
  if (elementPosition.left < 0 + popoverRect.width + offset) {
    result = 'right'
  }
  return result
}
function checkTop (elementPosition, popoverRect, offset, result) {
  if (elementPosition.top > 0 + popoverRect.height + offset) {
    result = 'top'
  }
  return result
}
function checkBottom (elementPosition, popoverRect, offset, result) {
  if (elementPosition.top < 0 + popoverRect.height + offset) {
    result = 'bottom'
  }
  return result
}
export default Ember.Component.extend({
  layout,
  visible: false,
  event: 'click',
  closest: false,
  offset: 10,
  position: 'bottom',
  autoPosition: null,
  index: 0,
  excludePadding: false,
  classNameBindings: ['visible:visible:invisible', 'autoPosition'],
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
      let targetElement = this.get('closest')
      ? this.$().closest(this.get('target'))[this.get('index')] : this.get('parentView')
      .$(this.get('target'))[this.get('index')]
      targetRect = {
        top: targetElement.offsetTop,
        left: targetElement.offsetLeft,
        bottom: targetElement.offsetTop + targetElement.offsetHeight,
        right: targetElement.offsetLeft + targetElement.offsetWidth,
        width: targetElement.offsetWidth,
        height: targetElement.offsetHeight
      }
      let popoverElement = this.get('element')
      let popoverRect = popoverElement.getBoundingClientRect()
      let top
      let left
      let excludePadding = this.get('excludePadding')
      let offset = this.get('offset')
      var positions = position.split(' ')
      console.log(positions)
      if (positions[0] === 'auto') {
        var elementPosition = targetElement.getBoundingClientRect()
        let tempAutoPosition = null
        if (positions[1] === 'left') {
          tempAutoPosition = checkBottom(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkTop(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkRight(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkLeft(elementPosition, popoverRect, offset, tempAutoPosition)
        } else if (positions[1] === 'right') {
          tempAutoPosition = checkBottom(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkTop(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkLeft(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkRight(elementPosition, popoverRect, offset, tempAutoPosition)
        } else if (positions[1] === 'bottom') {
          tempAutoPosition = checkLeft(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkRight(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkTop(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkBottom(elementPosition, popoverRect, offset, tempAutoPosition)
        } else {
          tempAutoPosition = checkLeft(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkRight(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkBottom(elementPosition, popoverRect, offset, tempAutoPosition)
          tempAutoPosition = checkTop(elementPosition, popoverRect, offset, tempAutoPosition)
        }
        console.log(tempAutoPosition)
        this.set('autoPosition', tempAutoPosition)
      }
      let autoPosition = this.get('autoPosition')
      if (positions[0] === 'bottom' || autoPosition === 'bottom') {
        this.set('autoPosition', 'bottom')
        top = targetRect.bottom + this.get('offset')
        left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2
        if (excludePadding) {
          let cs = window.getComputedStyle(targetElement)
          top -= parseInt(cs.getPropertyValue('padding-bottom'))
        }
      } else if (positions[0] === 'top' || autoPosition === 'top') {
        this.set('autoPosition', 'top')
        top = targetRect.top - popoverRect.height - this.get('offset')
        left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2
        if (excludePadding) {
          let cs = window.getComputedStyle(targetElement)
          top += parseInt(cs.getPropertyValue('padding-top'))
        }
      } else if (positions[0] === 'left' || autoPosition === 'left') {
        this.set('autoPosition', 'left')
        top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2
        left = targetRect.left - popoverRect.width - this.get('offset')
        if (excludePadding) {
          let cs = window.getComputedStyle(targetElement)
          left += parseInt(cs.getPropertyValue('padding-left'))
        }
      } else {
        this.set('autoPosition', 'right')
        top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2
        left = targetRect.right + this.get('offset')
        if (excludePadding) {
          let cs = window.getComputedStyle(targetElement)
          left -= parseInt(cs.getPropertyValue('padding-right'))
        }
      }
      popoverElement.style.top = top + 'px'
      popoverElement.style.left = left + 'px'
    }
  }
})
