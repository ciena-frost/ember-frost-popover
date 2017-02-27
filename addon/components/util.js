import Ember from 'ember'
const {assert} = Ember

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
    },
    'auto': {
      attachment: 'top center',
      targetAttachment: 'bottom center'
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
  findRoom (x, y, el, position) {
    el = $(el)
    if (x + el.width() > window.innerWidth) {
      if (y + el.height() > window.innerHeight)
        return 'left top'
      else if (y < 0)
        return 'left bottom'
      return 'left'
    }
    else if (x < 0) {
      if (y + el.height() > window.innerHeight)
        return 'right bottom'
      else if (y < 0)
        return 'right top'
      return 'right'
    }
    // Y doesn't fit bottom
    if (y + el.height() > window.innerHeight) {
      if (x + el.width() > window.innerWidth)
        return 'top left'
      else if (x < 0)
        return 'top right'
      return 'top'
    }
    // y doesn't fit at top
    else if (y < 0) {
      if (x + el.width() > window.innerWidth)
        return 'bottom left'
      else if (x < 0)
        return 'bottom right'
      return 'bottom'
    }
    return position
  }
}
