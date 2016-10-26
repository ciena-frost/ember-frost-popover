import {expect} from 'chai'
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
      Ember.run.later(function () {
        Ember.$('#foo').click()

        Ember.run.later(function () {
          expect(Ember.$('.visible')).to.have.length(1)
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

      Ember.run.later(function () {
        Ember.$('#viewport-test').click()
        Ember.run.later(function () {
          const viewportRect = Ember.$('#viewport')[0].getBoundingClientRect()
          const popoverRect = Ember.$('.tooltip-frost-popover')[0].getBoundingClientRect()

          expect(Ember.$('.visible')).to.have.length(1)
          expect(popoverRect.left >= viewportRect.left).to.equal(true)
          done()
        }, 100)
      }, 100)
    })
  }
)
