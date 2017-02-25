import Ember from 'ember'
const {assert} = Ember
/**
 * Checks if the popover can be positioned on the left
 * @param {Rect} elementPosition - the element client rect
 * @param {Rect} popoverRect - the popover client rect
 * @param {Number} offset - the amount of offset requested
 * @param {String} result - the current position
 * @returns {String} the new result
 */
export function checkLeft (elementPosition, popoverRect, offset, result) {
  if (elementPosition.left > 0 + popoverRect.width + offset) {
    result = 'left'
  }
  return result
}

/**
 * Checks if the popover can be positioned on the right
 * @param {Rect} elementPosition - the element client rect
 * @param {Rect} popoverRect - the popover client rect
 * @param {Number} offset - the amount of offset requested
 * @param {String} result - the current position
 * @returns {String} the new result
 */
export function checkRight (elementPosition, popoverRect, offset, result) {
  if (elementPosition.left < 0 + popoverRect.width + offset) {
    result = 'right'
  }
  return result
}

/**
 * Checks if the popover can be positioned on the top
 * @param {Rect} elementPosition - the element client rect
 * @param {Rect} popoverRect - the popover client rect
 * @param {Number} offset - the amount of offset requested
 * @param {String} result - the current position
 * @returns {String} the new result
 */
export function checkTop (elementPosition, popoverRect, offset, result) {
  if (elementPosition.top > 0 + popoverRect.height + offset) {
    result = 'top'
  }
  return result
}

/**
 * Checks if the popover can be positioned on the bottom
 * @param {Rect} elementPosition - the element client rect
 * @param {Rect} popoverRect - the popover client rect
 * @param {Number} offset - the amount of offset requested
 * @param {String} result - the current position
 * @returns {String} the new result
 */
export function checkBottom (elementPosition, popoverRect, offset, result) {
  if (elementPosition.top < 0 + popoverRect.height + offset) {
    result = 'bottom'
  }
  return result
}
export default {
  positionMap: {
    'left': {
      attachment: 'middle right',
      targetAttachment: 'middle left',
      inverse: 'top'
    },
    'left top': {
      attachment: 'middle right',
      targetAttachment: 'top left',
      inverse: 'right bottom'
    },
    'left bottom': {
      attachment: 'middle right',
      targetAttachment: 'bottom left',
      inverse: 'right top'
    },
    'right': {
      attachment: 'middle left',
      targetAttachment: 'middle right',
      inverse: 'left'
    },
    'right top': {
      attachment: 'middle left',
      targetAttachment: 'top right',
      inverse: 'left bottom'
    },
    'right bottom': {
      attachment: 'middle left',
      targetAttachment: 'bottom right',
      inverse: 'left top'
    },
    'top': {
      attachment: 'bottom center',
      targetAttachment: 'top center',
      inverse: 'bottom'
    },
    'top right': {
      attachment: 'bottom left',
      targetAttachment: 'top left',
      inverse: 'bottom left'
    },
    'top left': {
      attachment: 'bottom right',
      targetAttachment: 'top right',
      inverse: 'bottom right'
    },
    'bottom': {
      attachment: 'top center',
      targetAttachment: 'bottom center',
      inverse: 'top'
    },
    'bottom right': {
      attachment: 'top left',
      targetAttachment: 'bottom left',
      inverse: 'top left'
    },
    'bottom left': {
      attachment: 'top right',
      targetAttachment: 'bottom right',
      inverse: 'top right'
    }
  },
  parsePosition (position) {
    const url = "https://github.com/ciena-frost/ember-frost-popover/blob/master/README.md#placement"
    assert(`
      ${position} is an invalid position.
      See ${url} for available options...
    `, position = this.positionMap[position])
    return position
  },
  findRoom (x, y, el) {
    if (x < 0)
      return 'right'
    if (x + $(el).width() > window.innerWidth)
      return 'left'
  }
}
