import Ember from 'ember'
const {Controller} = Ember

export default Controller.extend({
  actions: {
    shouldClose (context) {
      return false
    }
  }
})
