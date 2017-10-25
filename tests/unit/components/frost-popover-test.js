import {run} from '@ember/runloop'
import {expect} from 'chai'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import $ from 'jquery'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

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

  it('should call passed action while close', function () {
    let callCounter = 0
    let forwardedAction = function () {
      callCounter++
    }
    component = this.subject()
    component.actions.close.apply(component, [forwardedAction])
    expect(callCounter).to.be.equal(1)
  })
  describe('handlers In and Out', function () {
    beforeEach(function () {
      sandbox.spy($.fn, 'on')
      sandbox.spy($.fn, 'off')
      component = this.subject({
        handlerIn: 'mouseenter',
        handlerOut: 'mouseleave'
      })
      sandbox.spy(component, 'togglePopover')
      sandbox.spy(component, 'closePopover')
      component.didInsertElement()
    })
    it('should register event', function () {
      expect($.fn.on.firstCall).to.have.been.calledWith('mouseenter', component._eventHandlerIn)
      expect($.fn.on.secondCall).to.have.been.calledWith('mouseleave', component._eventHandlerOut)
    })

    it('should unregister event', function () {
      component.willDestroyElement()
      expect($.fn.off.firstCall).to.have.been.calledWith('mouseenter', component._eventHandlerIn)
      expect($.fn.off.secondCall).to.have.been.calledWith('mouseleave', component._eventHandlerOut)
    })

    it('should not call togglePopover when component is destroyed', function () {
      run(() => {
        const eventHandlerIn = component._eventHandlerIn
        const eventHandlerOut = component._eventHandlerOut
        component.destroy()
        eventHandlerIn()
        expect(component.togglePopover).to.have.callCount(0)
        eventHandlerOut()
        expect(component.togglePopover).to.have.callCount(0)
      })
    })

    it('should not call closePopover when component is destroyed', function () {
      run(() => {
        component.destroy()
        component.registerClickOff()
        const eventHandler = $.fn.on.lastCall.args[1]
        eventHandler()
        expect(component.closePopover).to.have.callCount(0)
      })
    })
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

    it('should register event', function () {
      expect($.fn.on).to.have.been.calledWith('click', component._eventHandler)
    })

    it('should unregister event', function () {
      component.willDestroyElement()
      expect($.fn.off).to.have.been.calledWith('click', component._eventHandler)
    })

    it('should not call togglePopover when component is destroyed', function () {
      run(() => {
        const eventHandler = component._eventHandler
        component.destroy()
        eventHandler()
        expect(component.togglePopover).to.have.callCount(0)
      })
    })

    it('should not call closePopover when component is destroyed', function () {
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
