import Ember from 'ember'
const {$, Controller} = Ember

export default Controller.extend({
  actions: {
    onToggle: function (toggle) {
      const text = toggle ? 'Toggle is on' : 'Toggle is off'
      $('.on-toggle-content').text(text)
    }
  }
})
