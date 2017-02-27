import {expect} from 'chai'
import Ember from 'ember'
const {$, run: {next, later}} = Ember
import hbs from 'htmlbars-inline-precompile'
import {describe, it} from 'mocha'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'
const test = integration('frost-popover')
describe(test.label, function () {
  test.setup()

  it('renders', function () {
    this.render(hbs`
      <div class='target'>
        frost-popover testbed
      </div>
      {{#frost-popover
        hook='rendersTest'
        target='.target'
      }}
        <span class='inside'>Inside</span>
      {{/frost-popover}}
    `)
    expect(this.$()).to.have.length(1)
  })

  it('clicks', function (done) {
    this.render(hbs`
      <div id='foo' class='target'>
        click test
      </div>
      {{#frost-popover hook='clickTest' target='#foo'}}
        <span class='inside'>Inside</span>
      {{/frost-popover}}
    `)
    next(function () {
      $('#foo').click()

      next(function () {
        expect($('.drop-content')).to.have.length(1)
        done()
      })
    })
  })

  it('constrains to the viewport', function (done) {
    this.render(hbs`
      <div id='viewport' style='width: 400px; height: 400px;'>
        <span id='viewport-test'>
          viewport test
        </span>
        {{#frost-popover
          hook='constrainsToViewport'
          target='#viewport-test'
          constrainToScrollParent=true
          position='bottom'
        }}
          <span class='inside' style='display: inline-block; width: 100px'>Inside</span>
        {{/frost-popover}}
      </div>
    `)

    next(function () {
      $('#viewport-test').click()
      next(function () {
        const viewportRect = document.querySelector('#viewport').getBoundingClientRect()
        const popoverRect = document.querySelector('.drop-content').getBoundingClientRect()

        expect($('.drop-content')).to.have.length(1)
        expect(popoverRect.left >= viewportRect.left).to.equal(true)
        done()
      })
    })
  })
  it('calls onBeforeClose when closed', function (done) {
    const onBeforeClose = sinon.spy()
    this.setProperties({
      onBeforeClose
    })
    this.render(hbs`
      <span id='before-close'>
        viewport test
      </span>
      {{frost-popover
        hook='onBeforeClose'
        target='#before-close'
        onBeforeClose=onBeforeClose
        position='bottom'
      }}
    `)
    next(() => {
      $('#before-close')
        .click()
        .blur()
      next(() => {
        expect(onBeforeClose.called).to.equal(true)
        done()
      })
    })
  })
  it('calls onOpen when opened', function (done) {
    const onOpen = sinon.spy()
    this.setProperties({
      onOpen
    })
    this.render(hbs`
      <span id='on-open'>
        viewport test
      </span>
      {{frost-popover
        hook='onOpen'
        target='#on-open'
        onOpen=onOpen
        position='bottom'
      }}
    `)
    next(() => {
      $('#on-open').click()
      next(() => {
        expect(onOpen.called).to.equal(true)
        done()
      })
    })
  })
  it('calls onClose when closed', function (done) {
    const onClose = sinon.spy()
    this.setProperties({
      onClose
    })
    this.render(hbs`
      <span id='on-close'>
        viewport test
      </span>
      {{frost-popover
        hook='onClose'
        target='#on-close'
        onClose=onClose
        position='bottom'
      }}
    `)
    next(() => {
      $('#on-close')
        .click()
        .blur()
      next(() => {
        expect(onClose.called).to.equal(true)
        done()
      })
    })
  })
  it('does not fire onClose when onBeforeClose returns false', function (done) {
    const onBeforeClose = sinon.spy(() => {
      return false
    })
    const onClose = sinon.spy()
    this.setProperties({
      onBeforeClose,
      onClose
    })
    this.render(hbs`
      <span id='on-close'>
        viewport test
      </span>
      {{frost-popover
        hook='onClose'
        target='#on-close'
        onBeforeClose=onBeforeClose
        onClose=onClose
        position='bottom'
      }}
    `)
    next(() => {
      $('#on-close')
        .click()
        .blur()
      next(() => {
        expect(onBeforeClose.called).to.equal(true)
        expect(onClose.called).to.equal(false)
        done()
      })
    })
  })
})
