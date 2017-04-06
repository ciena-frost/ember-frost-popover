/* jshint expr:true */
import {expect} from 'chai'
import Ember from 'ember'
const {$, run} = Ember
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {unit} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = unit('frost-popover')
describe(test.label, function () {
  test.setup()

  let component, sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('calls passed action while close', function () {
    let callCounter = 0
    let forwardedAction = function () {
      callCounter++
    }
    component = this.subject()
    component.actions.close.apply(component, [forwardedAction])
    expect(callCounter).to.be.equal(1)
  })

  describe('event handlers', function () {
    beforeEach(function () {
      sandbox.spy($.fn, 'on')
      sandbox.spy($.fn, 'off')
      component = this.subject({
        event: 'click'
      })
      sandbox.spy(component, 'togglePopover')
      sandbox.spy(component, 'closePopover')
      component.didInsertElement()
    })

    it('registers event', function () {
      expect($.fn.on).to.have.been.calledWith('click', component._eventHandler)
    })

    it('unregisters event', function () {
      component.willDestroyElement()
      expect($.fn.off).to.have.been.calledWith('click', component._eventHandler)
    })

    it('does not call togglePopover when component is destroyed', function () {
      run(() => {
        const eventHandler = component._eventHandler
        component.destroy()
        eventHandler()
        expect(component.togglePopover).to.have.callCount(0)
      })
    })

    it('does not call closePopover when component is destroyed', function () {
      run(() => {
        component.destroy()
        component.registerClickOff()
        const eventHandler = $.fn.on.lastCall.args[1]
        eventHandler()
        expect(component.closePopover).to.have.callCount(0)
      })
    })
  })
})
