import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

const test = integration('frost-popover-svg')
describe(test.label, function () {
  test.setup()

  let sandbox, items

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    items = [
      {label: 'Count', value: 10},
      {label: 'Shape', value: 'Rectangle'}
    ]
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('after render', function () {
    beforeEach(function () {
      this.setProperties({
        myHook: 'myThing',
        items
      })

      this.render(hbs`
        {{frost-popover-svg
          hook=myHook
          items=items
        }}
      `)

      return wait()
    })

    it('should have an element', function () {
      expect(this.$()).to.have.length(1)
    })

    it('should be accessible via the hook', function () {
      expect($hook('myThing')).to.have.length(1)
    })

    it('should not be hidden', function () {
      expect(this.$('.tooltip-hidden')).to.have.length(0)
    })

    it('should have the right number of label value pairs', function () {
      expect($hook('myThing').find('.item')).to.have.length(2)
    })

    it('should show the label value pairs', function () {
      const items = $hook('myThing').find('.item')

      expect(items[0].innerText.trim()).to.eql('Count: 10')
      expect(items[1].innerText.trim()).to.eql('Shape: Rectangle')
    })
  })

  describe('when items are empty', function () {
    beforeEach(function () {
      this.setProperties({
        myHook: 'myThing',
        items: []
      })

      this.render(hbs`
        {{frost-popover-svg
          hook=myHook
          items=items
        }}
      `)

      return wait()
    })

    it('should have an element', function () {
      expect(this.$()).to.have.length(1)
    })

    it('should be hidden', function () {
      expect(this.$('.tooltip-hidden')).to.have.length(1)
    })
  })
})
