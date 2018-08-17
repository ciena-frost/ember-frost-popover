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
