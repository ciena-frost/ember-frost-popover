/* jshint expr:true */
import {expect} from 'chai'
import {
  describeComponent,
  it
} from 'ember-mocha'

describeComponent(
  'frost-popover',
  'FrostPopoverComponent',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  },
  function () {
    it('calls passed action while close', function () {
      let callCounter = 0
      let forwardedAction = function () {
        callCounter++
      }
      const component = this.subject()
      component.actions.close.apply(component, [forwardedAction])
      expect(callCounter).to.be.equal(1)
    })
  }
)
