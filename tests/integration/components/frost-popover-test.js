import {expect} from 'chai'
import Ember from 'ember'
const {$, run} = Ember
import {describeComponent, it} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describeComponent(
  'frost-popover',
  'Integration: EmberFrostPopoverComponent',
  {
    integration: true
  },
  function () {
    it('renders', function () {
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

    it('clicks', function (done) {
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

    it('constrains to the viewport', function (done) {
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
  }
)
