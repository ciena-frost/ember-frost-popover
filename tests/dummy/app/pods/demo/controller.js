import Ember from 'ember'
const {$, Controller} = Ember

export default Controller.extend({
  actions: {
    onDisplay: function () {
      $('.toggle-functions-content').text('A scary monster is terrorizing the village!!')
    },
    onHide: function () {
      $('.toggle-functions-content').text('The scary monster has been vanquished!')
    }
  }
})
