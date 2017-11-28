import {expect} from 'chai'
import Ember from 'ember'
const {$, run} = Ember
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

const test = integration('frost-popover')
describe(test.label, function () {
  test.setup()

  it('should render', function () {
    this.render(hbs`
      <div class='target'>
        frost-popover testbed
      </div>
      {{#frost-popover target='.target'}}
        <span class='inside'>Inside</span>
      {{/frost-popover}}
    `)
    expect(this.$()).to.have.length(1)
  })

  it('should click', function (done) {
    this.timeout(5000)
    this.render(hbs`
      <div id='foo' class='target'>
        click test
      </div>
      {{#frost-popover target='#foo'}}
        <span class='inside'>Inside</span>
      {{/frost-popover}}
    `)
    run.later(function () {
      $('#foo').click()

      run.later(function () {
        expect($('.visible')).to.have.length(1)
        done()
      }, 100)
    }, 100)
  })

  it('should test handlerIn and handlerOut', function (done) {
    this.timeout(5000)
    this.render(hbs`
      <div id='foo' class='target'>
        click test
      </div>
      {{#frost-popover target='#foo' handlerIn='mouseenter' handlerOut='mouseleave'}}
        <span class='inside'>Inside</span>
      {{/frost-popover}}
    `)
    run.later(function () {
      $('#foo').mouseenter()

      run.later(function () {
        expect($('.visible')).to.have.length(1)
        $('#foo').mouseenter()
        run.later(function () {
          expect($('.visible')).to.have.length(1)
          $('#foo').mouseleave()
          run.later(function () {
            expect($('.visible')).to.have.length(0)
            done()
          }, 100)
        }, 100)
      }, 100)
    }, 100)
  })

  describe('when delay sets to 500ms with handlerIn and handlerOut', function () {
    this.timeout(5000)
    beforeEach(function () {
      return this.render(hbs`
        <div id='foo' class='target'>
          click test
        </div>
        {{#frost-popover target='#foo' delay=500 handlerIn='mouseenter' handlerOut='mouseleave'}}
          <span class='inside'>Inside</span>
        {{/frost-popover}}
      `)
    })

    it('should not be visible after 400ms', function (done) {
      $('#foo').mouseenter()
      run.later(function () {
        expect($('.visible')).to.have.length(0)
        done()
      }, 400)
    })

    it('should be visible after 700ms', function (done) {
      $('#foo').mouseenter()
      run.later(function () {
        expect($('.visible')).to.have.length(1)
        done()
      }, 600)
    })
  })

  describe('when hide delay sets to 500ms with handlerIn and handlerOut', function () {
    this.timeout(5000)
    beforeEach(function () {
      this.render(hbs`
        <div id='foo' class='target'>
          click test
        </div>
        {{#frost-popover target='#foo' hideDelay=500 handlerIn='mouseenter' handlerOut='mouseleave'}}
          <span class='inside'>Inside</span>
        {{/frost-popover}}
      `)
      return wait().then(() => {
        $('#foo').mouseenter()
        return wait()
      })
    })

    it('should still be visible after 400ms', function (done) {
      $('#foo').mouseleave()
      run.later(function () {
        expect($('.visible')).to.have.length(1)
        done()
      }, 400)
    })

    it('should not longer be visible after 700ms', function (done) {
      $('#foo').mouseleave()
      run.later(function () {
        expect($('.visible')).to.have.length(0)
        done()
      }, 600)
    })
  })

  describe('when delay sets to 500ms with click event', function () {
    this.timeout(5000)
    beforeEach(function () {
      return this.render(hbs`
        <div id='foo' class='target'>
          click test
        </div>
        {{#frost-popover target='#foo' delay=500}}
          <span class='inside'>Inside</span>
        {{/frost-popover}}
      `)
    })

    it('should not be visible after 400ms', function (done) {
      $('#foo').click()
      run.later(function () {
        expect($('.visible')).to.have.length(0)
        done()
      }, 400)
    })
    it('should be visible after 700ms', function (done) {
      $('#foo').click()
      run.later(function () {
        expect($('.visible')).to.have.length(1)
        done()
      }, 600)
    })
  })

  it('should constrain to the viewport', function (done) {
    this.render(hbs`
      <div id='viewport' style='width: 400px; height: 400px;'>
        <span id='viewport-test'>
          viewport test
        </span>
        {{#frost-popover target='#viewport-test' viewport='#viewport' position='bottom'}}
          <span class='inside' style='display: inline-block; width: 100px'>Inside</span>
        {{/frost-popover}}
      </div>
    `)

    run.later(function () {
      $('#viewport-test').click()
      run.later(function () {
        const viewportRect = $('#viewport')[0].getBoundingClientRect()
        const popoverRect = $('.tooltip-frost-popover')[0].getBoundingClientRect()

        expect($('.visible')).to.have.length(1)
        expect(popoverRect.left >= viewportRect.left).to.equal(true)
        done()
      }, 100)
    }, 100)
  })
  describe('when stopPropagation is not set', function () {
    let spy
    beforeEach(function () {
      spy = sinon.spy()
      this.setProperties({
        spy
      })
      this.render(hbs`
      <div class='event-propogation-container' onmousedown={{action spy}} style="position: relative;">
        {{#frost-button hook='stopPropogateButton' size='small' priority='primary'
          class='propogate' text='Stop Propogation'}}
          {{#frost-popover target='.propogate' event='mousedown' position='auto' closest=true}}
            <span class='inside'>Stopped Propogation</span>
          {{/frost-popover}}
        {{/frost-button}}
      </div>
      `)
      $('.propogate').trigger('mousedown')
    })
    afterEach(function () {
      spy = null
    })

    it('should propogate the event', function () {
      expect(spy).to.have.callCount(1)
    })
  })

  describe('when stopPropagation is set to true', function () {
    let spy
    beforeEach(function () {
      spy = sinon.spy()
      this.setProperties({
        spy
      })
      this.render(hbs`
        <div class='event-propogation-container' onmousedown={{action spy}} style="position: relative;">
          {{#frost-button hook='stopPropogateButton' size='small' priority='primary'
            class='stop-propogate' text='Stop Propogation'}}
            {{#frost-popover target='.stop-propogate' position='auto' event='mousedown'
            closest=true stopPropagation=true}}
              <span class='inside'>Stopped Propogation</span>
            {{/frost-popover}}
          {{/frost-button}}
        </div>
      `)
      $('.stop-propogate').trigger('mousedown')
    })
    afterEach(function () {
      spy = null
    })

    it('should propogate the event', function () {
      expect(spy).to.have.callCount(0)
    })
  })
})
