/* jshint expr:true */
import {expect} from 'chai'
import {describe, it} from 'mocha'

import {unit} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = unit('frost-popover')
describe(test.label, function () {
  test.setup()

  it('calls passed action while close', function () {
    let callCounter = 0
    let forwardedAction = function () {
      callCounter++
    }
    const component = this.subject()
    component.actions.close.apply(component, [forwardedAction])
    expect(callCounter).to.be.equal(1)
  })
})
