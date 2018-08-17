import Ember from 'ember'

const {get, isArray, isNone} = Ember

const CHAR_WIDTH = 6 // using 6 as base number for size of a character
const CHAR_HEIGHT = 18
const WIDTH_PADDING = 5
const HEIGHT_PADDING = 12 // more padding for arrow

export function getWidthOfContent (content) {
  if (isNone(content)) {
    return 0
  }

  if (isArray(content)) {
    let maxLength = 0

    content.forEach(item => {
      const concatenatedString = `${get(item, 'label')}: ${get(item, 'value')}}`
      const stringLength = concatenatedString.length

      maxLength = stringLength > maxLength ? stringLength : maxLength
    })

    return maxLength * CHAR_WIDTH + WIDTH_PADDING
  }

  return content.length * CHAR_WIDTH + WIDTH_PADDING
}

export function getHeightOfContent (content) {
  if (isNone(content)) {
    return 0
  }

  if (isArray(content)) {
    return content.length * CHAR_HEIGHT + HEIGHT_PADDING
  }

  return CHAR_HEIGHT + HEIGHT_PADDING
}
