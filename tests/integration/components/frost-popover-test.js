import {run} from '@ember/runloop'
import {expect} from 'chai'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import $ from 'jquery'
import {beforeEach, describe, it} from 'mocha'

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
})
